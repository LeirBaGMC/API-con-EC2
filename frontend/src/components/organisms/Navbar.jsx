import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Upload, User, LogOut, Video as VideoIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { SearchBar } from '../molecules/SearchBar';

export const Navbar = ({ onOpenUpload }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (term) => {
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group select-none flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight hidden sm:inline-block">
            Cloud<span className="text-gradient">Tube</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {onOpenUpload && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Upload}
                  onClick={onOpenUpload}
                  className="hidden sm:inline-flex"
                >
                  Publicar
                </Button>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  <Avatar name={user?.name} size="sm" />
                  <span className="text-xs font-semibold text-slate-300 hidden lg:inline max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-400" />
                        Mi Perfil y Videos
                      </Link>

                      {onOpenUpload && (
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenUpload();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors sm:hidden"
                        >
                          <Upload className="w-4 h-4 text-indigo-400" />
                          Publicar Video
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/auth');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
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
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/50 md:hidden">
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  );
};
