import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { ShortPlaceholderCard } from '../molecules/ShortPlaceholderCard';

const resolveMediaUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
  if (url.startsWith('http')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').trim().replace(/\/+$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const ShortsShelf = ({ videos = [], placeholderCount = 5 }) => {
  const visibleVideos = videos.slice(0, 5);
  const placeholders = Array.from({ length: Math.max(0, placeholderCount - visibleVideos.length) });

  return (
    <section className="mt-10" aria-labelledby="shorts-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7aa7ff]/18 bg-[#111a2b] text-[#7aa7ff]">
            <Play className="h-4 w-4 fill-current" />
          </span>
          <h2 id="shorts-heading" className="text-xl font-bold text-[#f8fbff]">Shorts</h2>
        </div>
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleVideos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="interactive-lift animate-soft-enter group relative min-h-[320px] w-[184px] shrink-0 overflow-hidden rounded-xl bg-[#0d1320] lg:w-full"
          >
            <img
              src={resolveMediaUrl(video.thumbnail_url)}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#bcd3ff]/70 bg-[#f4f8ff] text-[#0d1320]">
                <Play className="h-4 w-4 fill-current" />
              </div>
              <h3 className="line-clamp-2 text-sm font-black leading-snug text-[#f8fbff]">{video.title}</h3>
              <p className="mt-1 text-xs font-semibold text-[#d8dee8]">{video.views || 0} vistas</p>
            </div>
          </Link>
        ))}
        {placeholders.map((_, index) => (
          <ShortPlaceholderCard key={`short-placeholder-${index}`} />
        ))}
      </div>
    </section>
  );
};
