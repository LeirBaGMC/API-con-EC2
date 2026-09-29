import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle, Save } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export const EditVideoModal = ({ isOpen, onClose, video, onVideoUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setThumbnailUrl(video.thumbnail_url || '');
      setError('');
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título del video no puede estar vacío.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const updated = await api.videos.update(video.id, {
        title: title.trim(),
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim() || undefined,
      });

      if (onVideoUpdated) {
        onVideoUpdated(updated);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar el video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 lg:p-8 shadow-2xl relative border border-slate-700/60">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Editar Video</h2>
            <p className="text-xs text-slate-400">Actualiza la información de tu publicación</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Título"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <FormField
            label="Descripción"
            type="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          <FormField
            label="URL de la Miniatura (Opcional)"
            placeholder="https://..."
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            disabled={loading}
          />

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={Save}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
