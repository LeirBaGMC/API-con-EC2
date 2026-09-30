import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Key, Play, AlertCircle, Sparkles, ExternalLink, ArrowLeft, X } from 'lucide-react';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { MainLayout } from '../components/templates/MainLayout';
import { Button } from '../components/atoms/Button';
import { Spinner } from '../components/atoms/Spinner';
import { Badge } from '../components/atoms/Badge';

const YouTubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);


export const YouTubeTestPage = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yt_test_api_key') || '');
  const [query, setQuery] = useState('AWS Cloud Computing');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);

    try {
      localStorage.setItem('yt_test_api_key', apiKey.trim());
      // Llamada usando Promise y fetch
      const results = await searchYouTubeVideos(query.trim(), apiKey.trim());
      setVideos(results);
    } catch (err) {
      setError(err.message || 'Error al obtener videos de YouTube.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {/* Header con aviso de prueba */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#7aa7ff]/12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" size="sm">
                <Sparkles className="w-3 h-3 text-[#7aa7ff]" />
                Módulo de Prueba UX
              </Badge>
              <Badge variant="default" size="sm">
                <YouTubeIcon className="w-3 h-3 text-red-500" />
                YouTube Data API v3
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-[#f8fbff] tracking-tight">
              Explorador de Videos de YouTube
            </h1>
            <p className="text-xs text-[#98a2b3] mt-1">
              Prueba de integración con <code className="text-[#bcd3ff] font-mono">Promise</code> y{' '}
              <code className="text-[#bcd3ff] font-mono">fetch</code> a la API de YouTube.
            </p>
          </div>

          <Link to="/">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Volver al Catálogo
            </Button>
          </Link>
        </div>

        {/* Panel de configuración de API Key y Búsqueda */}
        <form onSubmit={handleSearch} className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#c7ced8] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#7aa7ff]" />
                YouTube Data API v3 Key <span className="text-[#bcd3ff]">*</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#0b1220] border border-[#7aa7ff]/15 hover:border-[#7aa7ff]/30 rounded-xl px-3.5 py-2 text-sm text-[#f8fbff] placeholder:text-[#6f7a8a] focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/40"
              />
              <span className="text-[11px] text-[#778295]">
                Se guarda localmente en tu navegador para facilitar las pruebas.
              </span>
            </div>

            {/* Input Búsqueda */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#c7ced8] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#7aa7ff]" />
                Término de Búsqueda
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. AWS Certified Solutions Architect"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-[#0b1220] border border-[#7aa7ff]/15 hover:border-[#7aa7ff]/30 rounded-xl px-3.5 py-2 text-sm text-[#f8fbff] placeholder:text-[#6f7a8a] focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/40"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  icon={Search}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Mensaje de error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Resultados */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-[#98a2b3] font-medium">
              Consultando YouTube Data API v3 mediante fetch...
            </p>
          </div>
        ) : videos.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#f8fbff]">
                Resultados obtenidos ({videos.length})
              </h2>
              <span className="text-xs text-[#778295]">Haz clic en un video para reproducirlo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="group cursor-pointer flex flex-col bg-[#0d1320] hover:bg-[#111a2b] rounded-2xl overflow-hidden border border-[#7aa7ff]/10 hover:border-[#7aa7ff]/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#05070f]">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#05070f]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge size="sm" variant="default" className="bg-red-600/90 text-white border-0 font-bold text-[10px]">
                        YouTube
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#f8fbff] line-clamp-2 leading-snug group-hover:text-[#bcd3ff] transition-colors">
                        {vid.title}
                      </h3>
                      <p className="text-[11px] text-[#98a2b3] mt-1 truncate font-medium">
                        {vid.channelTitle}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#778295]">
                      {formatDate(vid.publishedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[#7aa7ff]/18 rounded-2xl p-8 bg-[#0d1320]/60">
            <YouTubeIcon className="w-12 h-12 text-[#778295] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#d8dee8]">Sin videos de YouTube cargados</h3>
            <p className="text-xs text-[#778295] mt-1 max-w-md mx-auto">
              Ingresa tu API Key de YouTube y presiona "Buscar" para consultar la API de Google y ver cómo lucen los videos en la interfaz.
            </p>
          </div>
        )}

        {/* Modal de reproducción embebida de YouTube */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050607]/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-3xl rounded-3xl p-5 relative">
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 text-[#98a2b3] hover:text-[#f8fbff] p-1 rounded-full hover:bg-[#17243a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <YouTubeIcon className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-[#f8fbff] truncate pr-8">
                  {selectedVideo.title}
                </h3>
              </div>

              {/* Iframe Player de YouTube */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={`${selectedVideo.embedUrl}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[#98a2b3]">
                <span>Canal: <strong className="text-[#d8dee8]">{selectedVideo.channelTitle}</strong></span>
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#bcd3ff] hover:underline"
                >
                  Abrir en YouTube <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
