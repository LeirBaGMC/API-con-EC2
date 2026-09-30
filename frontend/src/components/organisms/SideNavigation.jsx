import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Clapperboard,
  Compass,
  Flame,
  History,
  Home,
  Library,
  PlaySquare,
  Radio,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const primaryItems = [
  { label: 'Inicio', to: '/', icon: Home },
  { label: 'Explorar', to: '/?search=cloud', icon: Compass },
  { label: 'Tendencias', to: '/?search=popular', icon: Flame },
  { label: 'En vivo', to: '/?search=live', icon: Radio },
];

const libraryItems = [
  { label: 'Mi perfil', to: '/profile', icon: User },
  { label: 'Historial', to: '/?search=recientes', icon: History },
  { label: 'Biblioteca', to: '/?search=biblioteca', icon: Library },
  { label: 'YouTube Lab', to: '/test-youtube', icon: Clapperboard },
];

const subscriptions = ['AWS Labs', 'Cloud Native', 'Frontend UX', 'Data Streams'];

export const SideNavigation = ({ compact = false }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (to) => {
    if (to === '/') {
      return location.pathname === '/' && !location.search;
    }
    return `${location.pathname}${location.search}` === to;
  };

  const renderItem = ({ label, to, icon: Icon }) => {
    const active = isActive(to);
    return (
      <Link
        key={label}
        to={to}
        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
          compact ? 'justify-center px-2' : ''
        } ${
          active
            ? 'border border-[#7aa7ff]/18 bg-[#111a2b] text-[#f8fbff]'
            : 'border border-transparent text-[#c7ced8] hover:bg-[#0d1320] hover:text-[#f8fbff]'
        }`}
        title={compact ? label : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!compact && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`hidden border-r border-[#7aa7ff]/10 bg-[#05070f]/95 lg:sticky lg:top-[73px] lg:flex lg:h-[calc(100vh-73px)] lg:flex-col ${
        compact ? 'w-[76px] px-3' : 'w-64 px-4'
      } py-4`}
    >
      <div className="flex flex-col gap-1">{primaryItems.map(renderItem)}</div>

      <div className="my-4 h-px bg-[#7aa7ff]/10" />

      <div className="flex flex-col gap-1">{libraryItems.map(renderItem)}</div>

      {!compact && (
        <>
          <div className="my-4 h-px bg-[#7aa7ff]/10" />
          <div className="mb-2 flex items-center gap-2 px-3 text-sm font-bold text-[#f8fbff]">
            Canales activos
          </div>
          <div className="flex flex-col gap-1">
            {subscriptions.map((name, index) => (
              <Link
                key={name}
                to={`/?search=${encodeURIComponent(name)}`}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-[#c7ced8] hover:bg-[#0d1320] hover:text-[#f8fbff]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#7aa7ff]/18 bg-[#111a2b] text-xs font-black text-[#dbe7ff]">
                  {name.slice(0, 1)}
                </span>
                <span className="truncate">{name}</span>
                {index < 2 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7aa7ff]" />}
              </Link>
            ))}
          </div>
        </>
      )}

      {!compact && !isAuthenticated && (
        <div className="mt-auto rounded-2xl border border-[#7aa7ff]/14 bg-[#0d1320] p-4">
          <PlaySquare className="mb-2 h-5 w-5 text-[#7aa7ff]" />
          <p className="text-sm font-bold text-[#f8fbff]">Publica tu primer video</p>
          <p className="mt-1 text-xs leading-5 text-[#98a2b3]">Inicia sesión para subir contenido y gestionar tu canal.</p>
        </div>
      )}
    </aside>
  );
};
