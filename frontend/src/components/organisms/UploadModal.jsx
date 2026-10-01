import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export const UploadModal = ({ isOpen, onClose, onVideoPublished }) => {
  const [tab, setTab] = useState('files'); // 'files' or 'url'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.mp4')) {
        setError('El video debe ser en formato MP4.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('El video excede el límite recomendado de 100 MB.');
        return;
      }
      setError('');
      setVideoFile(file);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.toLowerCase().split('.').pop();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        setError('La miniatura debe ser en formato JPG, JPEG o PNG.');
        return;
      }
      setError('');
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión con una cuenta para poder publicar un video.');
      return;
    }

    if (!title.trim()) {
      setError('El título del video es obligatorio.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let publishedVideo;
      if (tab === 'files') {
        if (!videoFile) {
          setError('Por favor selecciona un archivo de video MP4.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('video_file', videoFile);
        if (thumbnailFile) {
          formData.append('thumbnail_file', thumbnailFile);
        }

        publishedVideo = await api.videos.publish(formData);
      } else {
        if (!videoUrl.trim()) {
          setError('Por favor ingresa la URL del video MP4.');
          setLoading(false);
          return;
        }

        publishedVideo = await api.videos.publishJson({
          title: title.trim(),
          description: description.trim(),
          video_url: videoUrl.trim(),
          thumbnail_url: thumbnailUrl.trim() || undefined,
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoUrl('');
      setThumbnailUrl('');

      if (onVideoPublished) {
        onVideoPublished(publishedVideo);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error al publicar el video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050607]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 text-[#98a2b3] hover:text-[#f8fbff] p-1 rounded-full hover:bg-[#17243a] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl border border-[#7aa7ff]/30 bg-[#7aa7ff]/10 text-[#bcd3ff] flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#f8fbff]">Publicar Video</h2>
            <p className="text-xs text-[#98a2b3]">Sube tus videos a Amazon S3 y compártelos con la comunidad</p>
          </div>
        </div>

        {/* Tabs: Files vs URL */}
        <div className="flex p-1 bg-[#080d16] rounded-xl mb-6 border border-[#7aa7ff]/15">
          <button
            type="button"
            onClick={() => setTab('files')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'files'
                ? 'bg-[#f4f8ff] text-[#0d1320] shadow-[0_10px_26px_rgba(122,167,255,0.18)]'
                : 'text-[#98a2b3] hover:text-[#f8fbff] hover:bg-[#111a2b]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Subir Archivos a S3
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'url'
                ? 'bg-[#f4f8ff] text-[#0d1320] shadow-[0_10px_26px_rgba(122,167,255,0.18)]'
                : 'text-[#98a2b3] hover:text-[#f8fbff] hover:bg-[#111a2b]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Enlace / URL Directa
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Título del Video"
            required
            placeholder="Ej. Curso de Cloud Computing en AWS"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <FormField
            label="Descripción"
            type="textarea"
            rows={3}
            placeholder="Describe brevemente de qué trata este video..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          {tab === 'files' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Video File Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7ced8] flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#7aa7ff]" />
                  Archivo de Video (MP4) <span className="text-[#bcd3ff]">*</span>
                </label>
                <div className="relative border-2 border-dashed border-[#7aa7ff]/18 hover:border-[#7aa7ff]/45 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#0b1220]/70">
                  <input
                    type="file"
                    accept="video/mp4,.mp4"
                    onChange={handleVideoFileChange}
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <p className="text-xs text-[#d8dee8] font-medium truncate">
                    {videoFile ? videoFile.name : 'Seleccionar video MP4'}
                  </p>
                  <p className="text-[10px] text-[#778295] mt-1">Máx. 100 MB</p>
                </div>
              </div>

              {/* Thumbnail File Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7ced8] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#7aa7ff]" />
                  Miniatura (JPG / PNG)
                </label>
                <div className="relative border-2 border-dashed border-[#7aa7ff]/18 hover:border-[#7aa7ff]/45 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#0b1220]/70">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleThumbnailFileChange}
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <p className="text-xs text-[#d8dee8] font-medium truncate">
                    {thumbnailFile ? thumbnailFile.name : 'Seleccionar imagen'}
                  </p>
                  <p className="text-[10px] text-[#778295] mt-1">JPG, JPEG o PNG</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <FormField
                label="URL del Video (MP4)"
                required
                placeholder="https://tu-bucket-s3.amazonaws.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={loading}
              />
              <FormField
                label="URL de la Miniatura"
                placeholder="https://tu-bucket-s3.amazonaws.com/thumb.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#7aa7ff]/12">
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
              icon={Upload}
            >
              {loading ? 'Subiendo y procesando...' : 'Publicar Ahora'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
