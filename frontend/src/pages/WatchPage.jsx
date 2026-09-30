import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Calendar, User, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { MainLayout } from '../components/templates/MainLayout';
import { VideoPlayer } from '../components/organisms/VideoPlayer';
import { VideoCard } from '../components/organisms/VideoCard';
import { CommentSection } from '../components/organisms/CommentSection';
import { Avatar } from '../components/atoms/Avatar';
import { Badge } from '../components/atoms/Badge';
import { Spinner } from '../components/atoms/Spinner';
import { Button } from '../components/atoms/Button';

export const WatchPage = () => {
  const { id } = useParams();
  const videoId = parseInt(id, 10);

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) return;
      setLoading(true);
      setError('');
      try {
        // Carga simultánea: Detalle de video, comentarios y recomendados dinámicos
        const [videoData, commentsData, recData] = await Promise.all([
          api.videos.getById(videoId),
          api.comments.getByVideo(videoId),
          api.videos.getRecommended(videoId),
        ]);

        setVideo(videoData);
        setComments(commentsData || []);
        setRecommended(recData || []);
      } catch (err) {
        setError(err.message || 'Error al cargar la información del video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [videoId]);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#98a2b3] font-medium">Cargando reproductor y video...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !video) {
    return (
      <MainLayout>
        <div className="py-20 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-100">Video no encontrado</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            {error || 'El video solicitado no existe o fue eliminado.'}
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">
              Volver al Catálogo Principal
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player & Details (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={video.video_url}
            posterUrl={video.thumbnail_url}
            title={video.title}
          />

          {/* Video Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#f8fbff] tracking-tight leading-snug">
            {video.title}
          </h1>

          {/* Metadata & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#7aa7ff]/12">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <Avatar name={video.user_name} size="md" />
              <div>
                <Link
                  to={`/profile?userId=${video.user_id}`}
                  className="text-sm font-bold text-[#f8fbff] hover:text-[#bcd3ff] transition-colors"
                >
                  {video.user_name || 'Autor'}
                </Link>
                <p className="text-[11px] text-[#98a2b3]">Publicado en CloudTube</p>
              </div>
            </div>

            {/* Views, Date & Share */}
            <div className="flex items-center gap-3">
              <Badge variant="primary" size="md">
                <Eye className="w-3.5 h-3.5 text-[#0d1320]" />
                {video.views} vistas
              </Badge>

              <Badge variant="default" size="md">
                <Calendar className="w-3.5 h-3.5 text-[#98a2b3]" />
                {formatDate(video.created_at)}
              </Badge>

              <Button
                variant="secondary"
                size="sm"
                icon={Share2}
                onClick={handleShare}
              >
                {copied ? '¡Copiado!' : 'Compartir'}
              </Button>
            </div>
          </div>

          {/* Description Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1320] border border-[#7aa7ff]/12 text-sm text-[#d8dee8] leading-relaxed whitespace-pre-line">
            <h4 className="text-xs font-bold text-[#98a2b3] uppercase tracking-wider mb-2">
              Descripción del Video
            </h4>
            {video.description || 'Sin descripción disponible para este video.'}
          </div>

          {/* Comments Section */}
          <CommentSection
            videoId={video.id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {/* Right Column: Recommended Videos (1 Col) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#7aa7ff]/12">
            <Sparkles className="w-4 h-4 text-[#7aa7ff]" />
            <h3 className="text-base font-bold text-[#f8fbff]">Videos Recomendados</h3>
          </div>

          {recommended.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recommended.map((recVideo) => (
                <VideoCard key={recVideo.id} video={recVideo} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#778295] py-8 text-center bg-[#0d1320]/70 rounded-2xl border border-[#7aa7ff]/10">
              No hay otros videos recomendados en este momento.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
