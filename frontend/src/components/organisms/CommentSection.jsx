import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { CommentItem } from '../molecules/CommentItem';

export const CommentSection = ({ videoId, comments = [], onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setError('');
    setSubmitting(true);
    try {
      const newComment = await api.comments.create(videoId, content.trim());
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      setError(err.message || 'Error al publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#7aa7ff]" />
        <h3 className="text-lg font-bold text-[#f8fbff]">
          Comentarios <span className="text-[#98a2b3] text-sm font-normal">({comments.length})</span>
        </h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar name={user?.name} size="sm" className="mt-1 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Agrega un comentario público..."
              className="w-full bg-[#0b1220] text-[#f8fbff] placeholder:text-[#6f7a8a] p-3 rounded-xl border border-[#7aa7ff]/15 hover:border-[#7aa7ff]/30 focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/40 focus:border-transparent text-sm resize-none transition-all"
              disabled={submitting}
            />
            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                loading={submitting}
                disabled={!content.trim()}
                icon={Send}
              >
                Comentar
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-[#0d1320] border border-[#7aa7ff]/12 text-center">
          <p className="text-xs text-[#98a2b3]">
            ¿Quieres unirte a la conversación?{' '}
            <Link to="/auth?mode=login" className="text-[#bcd3ff] font-semibold hover:underline">
              Inicia sesión
            </Link>{' '}
            para dejar tu comentario.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="divide-y divide-[#7aa7ff]/10">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-xs text-[#778295] py-6 text-center">
            Aún no hay comentarios en este video. ¡Sé el primero en comentar!
          </p>
        )}
      </div>
    </div>
  );
};
