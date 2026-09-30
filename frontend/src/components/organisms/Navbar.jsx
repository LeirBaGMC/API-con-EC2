import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Play, Plus, Search, Upload, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { SearchBar } from '../molecules/SearchBar';
import { IconButton } from '../atoms/IconButton';

export const Navbar = ({ onOpenUpload, onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (term) => {
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#7aa7ff]/10 bg-[#05070f]/95 px-3 py-3 backdrop-blur-xl sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={Menu}
            label="Alternar navegación"
            onClick={onToggleSidebar}
            className="hidden lg:inline-flex"
          />
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 select-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bcd3ff]/60 bg-[#f4f8ff] text-[#0d1320] shadow-[0_10px_26px_rgba(122,167,255,0.18)] transition-transform group-hover:scale-105">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </div>
            <span className="hidden text-xl font-black tracking-tight text-[#f8fbff] sm:inline-block">
              CloudTube
            </span>
          </Link>
        </div>

        <div className="mx-2 hidden max-w-2xl flex-1 md:block">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton icon={Search} label="Buscar" className="md:hidden" />

          {isAuthenticated ? (
            <>
              {onOpenUpload && (
                <button
                  type="button"
                  onClick={onOpenUpload}
                  className="hidden items-center gap-2 rounded-full border border-[#bcd3ff]/70 bg-[#f4f8ff] px-4 py-2 text-sm font-black text-[#0d1320] shadow-[0_12px_34px_rgba(122,167,255,0.16)] transition-colors hover:bg-[#ffffff] sm:inline-flex"
                >
                  <Plus className="h-4 w-4" />
                  Crear
                </button>
              )}

              <IconButton icon={Bell} label="Notificaciones" className="hidden sm:inline-flex" />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-full p-1 transition-all hover:ring-2 hover:ring-[#7aa7ff]/35"
                >
                  <Avatar name={user?.name} size="sm" />
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[#d8dee8] xl:inline">
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#7aa7ff]/10">
                      <p className="text-xs font-bold text-[#f8fbff] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#98a2b3] truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#c7ced8] hover:text-[#f8fbff] hover:bg-[#17243a] rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-[#7aa7ff]" />
                        Mi Perfil y Videos
                      </Link>

                      {onOpenUpload && (
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenUpload();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#c7ced8] hover:text-[#f8fbff] hover:bg-[#17243a] rounded-xl transition-colors sm:hidden"
                        >
                          <Upload className="w-4 h-4 text-[#7aa7ff]" />
                          Publicar Video
                        </button>
                      )}

                      <Link
                        to="/test-youtube"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#c7ced8] hover:text-[#f8fbff] hover:bg-[#17243a] rounded-xl transition-colors"
                      >
                        <Play className="w-4 h-4 text-[#7aa7ff]" />
                        YouTube Lab
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[#7aa7ff]/10">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/auth');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth?mode=login')}
              >
                Ingresar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth?mode=register')}
              >
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar for Mobile */}
      <div className="mt-3 border-t border-[#7aa7ff]/10 pt-3 md:hidden">
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  );
};
