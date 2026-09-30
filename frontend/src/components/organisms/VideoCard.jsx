import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, MoreVertical, Play } from 'lucide-react';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

export const VideoCard = ({ video, variant = 'default' }) => {
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

  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/watch/${video.id}`}
      className={`interactive-lift animate-soft-enter group block min-w-0 rounded-3xl ${
        isFeatured
          ? 'overflow-hidden bg-[#0d1320]'
          : 'bg-transparent'
      }`}
    >
      {/* Thumbnail Container */}
      <div className={`relative aspect-video w-full overflow-hidden bg-[#0d1320] ${
        isFeatured ? 'rounded-t-2xl' : 'rounded-xl'
      }`}>
        <img
          src={thumbnailSrc}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
          }}
        />
        
        {/* Play hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#05070f]/45 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full border border-[#bcd3ff]/70 bg-[#f4f8ff] text-[#0d1320] shadow-[0_12px_34px_rgba(122,167,255,0.22)] transition-transform duration-300 group-hover:scale-100">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>

        {/* Views Badge overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
          <Badge size="sm" variant="default" className="border border-[#7aa7ff]/12 bg-[#05070f]/80 font-bold text-[#f8fbff]">
            <Eye className="w-3 h-3 text-[#7aa7ff]" />
            {formatViews(video.views)} vistas
          </Badge>
        </div>
      </div>

      {/* Video Info */}
      <div className={`flex gap-3 ${isFeatured ? 'p-4' : 'pt-3'}`}>
        <Avatar name={video.user_name} size={isFeatured ? 'md' : 'sm'} className="mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className={`${isFeatured ? 'text-lg' : 'text-sm'} mb-1 line-clamp-2 font-bold leading-snug text-[#f8fbff] transition-colors group-hover:text-[#bcd3ff]`}>
            {video.title}
          </h3>
          <p className="mb-1 truncate text-xs font-semibold text-[#98a2b3]">
            {video.user_name || 'Autor'}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#778295]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#778295]" />
              {formatDate(video.created_at)}
            </span>
            <span>•</span>
            <span>{formatViews(video.views)} vistas</span>
          </div>
        </div>
        <MoreVertical className="mt-1 h-4 w-4 shrink-0 text-[#778295] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
};
