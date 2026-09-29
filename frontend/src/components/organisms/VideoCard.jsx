import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, Play } from 'lucide-react';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

export const VideoCard = ({ video }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Reciente';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatViews = (views) => {
    if (views == null) return 0;
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  // Resolve thumbnail: check if starts with http or fallback
  const thumbnailSrc = video.thumbnail_url?.startsWith('http')
    ? video.thumbnail_url
    : video.thumbnail_url
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${video.thumbnail_url}`
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  return (
    <Link
      to={`/watch/${video.id}`}
      className="group flex flex-col bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={thumbnailSrc}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
          }}
        />
        
        {/* Play hover overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
          <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Views Badge overlay */}
        <div className="absolute bottom-2.5 right-2.5">
          <Badge size="sm" variant="default" className="bg-slate-950/80 text-white border-0 font-medium">
            <Eye className="w-3 h-3 text-indigo-400" />
            {formatViews(video.views)} vistas
          </Badge>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 flex gap-3 flex-1">
        <Avatar name={video.user_name} size="sm" className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug mb-1">
            {video.title}
          </h3>
          <p className="text-xs font-medium text-slate-400 truncate mb-1">
            {video.user_name || 'Autor'}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {formatDate(video.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
