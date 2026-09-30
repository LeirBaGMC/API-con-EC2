import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlaySquare, PlusCircle, UserRound } from 'lucide-react';

const items = [
  { label: 'Inicio', to: '/', icon: Home },
  { label: 'Explorar', to: '/?search=cloud', icon: PlaySquare },
  { label: 'Publicar', action: 'upload', icon: PlusCircle },
  { label: 'Perfil', to: '/profile', icon: UserRound },
];

export const MobileDock = ({ onOpenUpload }) => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#7aa7ff]/12 bg-[#05070f]/95 px-3 py-2 backdrop-blur-xl lg:hidden" aria-label="Navegación móvil">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ label, to, action, icon: Icon }) => {
          const active = to && location.pathname === to.split('?')[0] && location.search === (to.includes('?') ? `?${to.split('?')[1]}` : '');
          const className = `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold transition-colors ${
            active ? 'bg-[#f4f8ff] text-[#0d1320]' : 'text-[#98a2b3] hover:bg-[#111a2b] hover:text-[#f8fbff]'
          }`;

          if (action === 'upload') {
            return (
              <button key={label} type="button" onClick={onOpenUpload} className={className}>
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            );
          }

          return (
            <Link key={label} to={to} className={className}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
