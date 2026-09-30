import React from 'react';

export const CategoryRail = ({ categories = [], activeValue = '', onSelect }) => {
  return (
    <nav aria-label="Filtros de video" className="relative -mx-4 sm:-mx-6 lg:mx-0">
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 sm:px-6 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const active = category.value === activeValue;
          return (
            <button
              key={category.label}
              type="button"
              onClick={() => onSelect?.(category.value)}
              className={`interactive-lift shrink-0 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/45 ${
                active
                  ? 'border border-[#bcd3ff]/70 bg-[#f4f8ff] text-[#0d1320]'
                  : 'border border-[#7aa7ff]/12 bg-[#111a2b] text-[#d8dee8] hover:border-[#7aa7ff]/28 hover:bg-[#17243a] hover:text-[#f8fbff]'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
