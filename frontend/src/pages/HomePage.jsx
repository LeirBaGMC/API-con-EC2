import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { MainLayout } from '../components/templates/MainLayout';
import { VideoCard } from '../components/organisms/VideoCard';
import { Spinner } from '../components/atoms/Spinner';
import { Button } from '../components/atoms/Button';
import { CategoryRail } from '../components/molecules/CategoryRail';
import { ShortsShelf } from '../components/organisms/ShortsShelf';
import { VideoPlaceholderCard } from '../components/molecules/VideoPlaceholderCard';

const categories = [
  { label: 'Todo', value: '' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'AWS', value: 'aws' },
  { label: 'FastAPI', value: 'fastapi' },
  { label: 'React', value: 'react' },
  { label: 'UX', value: 'ux' },
  { label: 'Música', value: 'musica' },
  { label: 'En directo', value: 'live' },
];

const PAGE_SIZE = 12;
const INITIAL_PLACEHOLDER_PAGES = 2;

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [placeholderPages, setPlaceholderPages] = useState(INITIAL_PLACEHOLDER_PAGES);
  const sentinelRef = useRef(null);
  const extendingPlaceholdersRef = useRef(false);

  const loadVideos = useCallback(async (nextOffset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const data = await api.videos.getAll({
        search,
        limit: PAGE_SIZE,
        offset: nextOffset,
      });
      const fetched = data || [];
      setVideos((prev) => (append ? [...prev, ...fetched] : fetched));
      setOffset(nextOffset + fetched.length);
      setHasMore(fetched.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message || 'Error al conectar con la API de videos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search]);

  useEffect(() => {
    setVideos([]);
    setOffset(0);
    setHasMore(true);
    setPlaceholderPages(INITIAL_PLACEHOLDER_PAGES);
    loadVideos(0, false);
  }, [loadVideos]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loading || loadingMore) return;

        if (videos.length > 0 && hasMore) {
          loadVideos(offset, true);
          return;
        }

        if (!extendingPlaceholdersRef.current) {
          extendingPlaceholdersRef.current = true;
          window.setTimeout(() => {
            setPlaceholderPages((current) => current + 1);
            extendingPlaceholdersRef.current = false;
          }, 220);
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadVideos, loading, loadingMore, offset, videos.length]);

  const handleVideoPublished = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setOffset((current) => current + 1);
  };

  const handleCategorySelect = (value) => {
    navigate(value ? `/?search=${encodeURIComponent(value)}` : '/');
  };

  const activeCategory = categories.some((category) => category.value === search.toLowerCase())
    ? search.toLowerCase()
    : '';

  const featuredVideos = videos.slice(0, 2);
  const feedVideos = videos.slice(2);
  const feedPlaceholderCount = Math.max(
    PAGE_SIZE,
    placeholderPages * PAGE_SIZE - Math.max(feedVideos.length, 0),
  );
  const shouldShowPlaceholders = loading || videos.length === 0 || !hasMore;

  return (
    <MainLayout onVideoPublished={handleVideoPublished}>
      <div className="sticky top-[73px] z-30 -mx-4 mb-5 border-b border-[#7aa7ff]/10 bg-[#05070f]/95 px-4 pt-1 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <CategoryRail
          categories={categories}
          activeValue={activeCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#f8fbff]">
          {search ? `Resultados para "${search}"` : 'Inicio'}
        </h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => loadVideos(0, false)}
          icon={RefreshCw}
          disabled={loading}
        >
          Actualizar
        </Button>
      </div>

      {/* Content Area */}
      {error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md mx-auto my-12">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-100">Error al cargar videos</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => loadVideos(0, false)}>
            Reintentar
          </Button>
        </div>
      ) : (
        <>
          {!search && (
            <section aria-label="Videos destacados" className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
              {featuredVideos.length > 0
                ? featuredVideos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      variant={index === 0 ? 'featured' : 'default'}
                    />
                  ))
                : Array.from({ length: 2 }).map((_, index) => (
                    <VideoPlaceholderCard
                      key={`featured-placeholder-${index}`}
                      variant={index === 0 ? 'featured' : 'default'}
                    />
                  ))}
            </section>
          )}

          <ShortsShelf videos={videos} placeholderCount={5} />

          <section aria-label="Lista de videos" className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-[#f8fbff]">
              {search ? 'Coincidencias' : 'Videos'}
            </h2>

            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {(search ? videos : feedVideos.length ? feedVideos : videos).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
              {shouldShowPlaceholders &&
                Array.from({ length: feedPlaceholderCount }).map((_, index) => (
                  <VideoPlaceholderCard key={`feed-placeholder-${placeholderPages}-${index}`} />
                ))}
              {loadingMore &&
                Array.from({ length: 4 }).map((_, index) => (
                  <VideoPlaceholderCard key={`loading-more-${index}`} />
                ))}
            </div>
          </section>

          <div ref={sentinelRef} className="flex h-24 items-center justify-center">
            {(loading || loadingMore) && (
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                <Spinner size="sm" />
                Cargando más espacios...
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
};
