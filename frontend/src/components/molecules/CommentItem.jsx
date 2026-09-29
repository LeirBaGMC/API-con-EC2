import React from 'react';
import { Avatar } from '../atoms/Avatar';

export const CommentItem = ({ comment }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex gap-3 py-3.5 border-b border-slate-800/60 last:border-0 group">
      <Avatar name={comment.user_name || 'Usuario'} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-200">
            {comment.user_name || 'Usuario'}
          </span>
          <span className="text-[11px] text-slate-500">
            {formatDate(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
