import React from 'react';

export const VideoPlaceholderCard = ({ variant = 'default' }) => {
  const featured = variant === 'featured';

  return (
    <article className={`${featured ? 'overflow-hidden rounded-2xl border border-[#7aa7ff]/10 bg-[#0d1320]' : ''} animate-soft-enter`} aria-label="Espacio reservado para video">
      <div className={`relative aspect-video w-full overflow-hidden bg-[#111827] ${featured ? 'rounded-t-2xl' : 'rounded-xl'}`}>
        <div className="placeholder-sheen" />
        <div className="absolute bottom-2 right-2 h-5 w-12 rounded bg-black/50" />
      </div>
      <div className={`flex gap-3 ${featured ? 'p-3' : 'pt-3'}`}>
        <div className="quiet-pulse h-9 w-9 shrink-0 rounded-full bg-[#111827]" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="quiet-pulse h-4 w-11/12 rounded bg-[#111827]" />
          <div className="quiet-pulse h-4 w-7/12 rounded bg-[#111827]" />
          <div className="h-3 w-5/12 rounded bg-[#0d1320]" />
        </div>
      </div>
    </article>
  );
};
