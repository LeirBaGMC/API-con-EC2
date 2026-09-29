import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Video as VideoIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { MainLayout } from '../components/templates/MainLayout';
import { VideoCard } from '../components/organisms/VideoCard';
import { Spinner } from '../components/atoms/Spinner';
import { Button } from '../components/atoms/Button';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.videos.getAll({ search });
      setVideos(data || []);
    } catch (err) {
      setError(err.message || 'Error al conectar con la API de videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [search]);

  const handleVideoPublished = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  return (
    <MainLayout onVideoPublished={handleVideoPublished}>
      {/* Hero Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-900">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo en Tiempo Real
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {search ? (
              <>
                Resultados para <span className="text-gradient">"{search}"</span>
              </>
            ) : (
              <>
                Explora los últimos <span className="text-gradient">videos</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Videos almacenados en Amazon S3 y gestionados dinámicamente con FastAPI y Amazon RDS.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchVideos}
          icon={RefreshCw}
          disabled={loading}
        >
          Actualizar
        </Button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-slate-400 font-medium">Cargando catálogo de videos...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md mx-auto my-12">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-100">Error al cargar videos</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchVideos}>
            Reintentar
          </Button>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto mb-4">
            <VideoIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No se encontraron videos</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            {search
              ? 'No hay videos que coincidan con tu búsqueda. Intenta con otros términos.'
              : 'Aún no se ha publicado ningún video en la plataforma. ¡Sé el primero en subir uno!'}
          </p>
        </div>
      )}
    </MainLayout>
  );
};
