import React from 'react';

export const ShortPlaceholderCard = () => {
  return (
    <article className="animate-soft-enter w-[184px] shrink-0 lg:w-full" aria-label="Espacio reservado para short">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-[#111827]">
        <div className="placeholder-sheen" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="quiet-pulse h-4 w-11/12 rounded bg-[#111827]" />
        <div className="h-3 w-7/12 rounded bg-[#0d1320]" />
      </div>
    </article>
  );
};
