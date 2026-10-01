import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Video, Upload, Trash2, Edit3, Eye, Calendar, PlusCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MainLayout } from '../components/templates/MainLayout';
import { Avatar } from '../components/atoms/Avatar';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Spinner } from '../components/atoms/Spinner';
import { UploadModal } from '../components/organisms/UploadModal';
import { EditVideoModal } from '../components/organisms/EditVideoModal';

export const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId');
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const targetUserId = queryUserId ? parseInt(queryUserId, 10) : authUser?.id;
  const isOwnProfile = authUser?.id === targetUserId;

  const fetchProfile = async () => {
    if (!targetUserId) {
      if (!authLoading && !isAuthenticated) {
        navigate('/auth?mode=login');
      }
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.auth.getUser(targetUserId);
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Error al cargar perfil de usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId, authLoading, isAuthenticated]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este video?')) return;

    setDeletingId(videoId);
    try {
      await api.videos.delete(videoId);
      setProfile((prev) => ({
        ...prev,
        videos_count: Math.max(0, prev.videos_count - 1),
        videos: prev.videos.filter((v) => v.id !== videoId),
      }));
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el video');
    } finally {
      setDeletingId(null);
    }
  };

  const handleVideoUpdated = (updatedVideo) => {
    setProfile((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => (v.id === updatedVideo.id ? { ...v, ...updatedVideo } : v)),
    }));
  };

  const handleVideoPublished = (newVideo) => {
    setProfile((prev) => ({
      ...prev,
      videos_count: (prev.videos_count || 0) + 1,
      videos: [newVideo, ...(prev.videos || [])],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#98a2b3] font-medium">Cargando perfil y videos...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="py-20 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-100">Usuario no encontrado</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            {error || 'No se pudo encontrar la información del perfil.'}
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <Avatar name={profile.name} size="xl" className="shadow-2xl shadow-[rgba(122,167,255,0.16)]" />
              <div>
                <h1 className="text-2xl font-extrabold text-[#f8fbff] tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-xs text-[#98a2b3] flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-[#7aa7ff]" />
                  {profile.email}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="primary" size="md">
                    <Video className="w-3.5 h-3.5" />
                    {profile.videos_count} {profile.videos_count === 1 ? 'video' : 'videos'} publicados
                  </Badge>
                  <span className="text-[11px] text-[#778295]">
                    Miembro desde {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons (only for owner) */}
            {isOwnProfile && (
              <Button
                variant="primary"
                size="md"
                icon={PlusCircle}
                onClick={() => setIsUploadOpen(true)}
                className="w-full sm:w-auto"
              >
                Publicar Video
              </Button>
            )}
          </div>
        </div>

        {/* User Videos Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#7aa7ff]/12">
            <div>
              <h2 className="text-lg font-bold text-[#f8fbff] tracking-tight">
                {isOwnProfile ? 'Mis Videos Subidos' : `Videos de ${profile.name}`}
              </h2>
              <p className="text-xs text-[#98a2b3]">
                {isOwnProfile
                  ? 'Gestiona, actualiza y consulta el rendimiento de tus videos'
                  : 'Lista completa de videos publicados por este usuario'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#c7ced8] bg-[#0d1320] px-3 py-1 rounded-full border border-[#7aa7ff]/12">
              Total: {profile.videos?.length || 0}
            </span>
          </div>

          {/* Videos Grid / List */}
          {profile.videos && profile.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.videos.map((vid) => {
                const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').trim().replace(/\/+$/, '');
                const thumbnailSrc = vid.thumbnail_url?.startsWith('http')
                  ? vid.thumbnail_url
                  : vid.thumbnail_url
                  ? `${baseUrl}${vid.thumbnail_url.startsWith('/') ? '' : '/'}${vid.thumbnail_url}`
                  : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

                return (
                  <div
                    key={vid.id}
                    className="flex flex-col bg-[#0d1320] rounded-2xl overflow-hidden border border-[#7aa7ff]/10 hover:border-[#7aa7ff]/26 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <Link to={`/watch/${vid.id}`} className="relative aspect-video w-full bg-[#05070f] overflow-hidden group">
                      <img
                        src={thumbnailSrc}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
                        }}
                      />
                      <div className="absolute bottom-2 right-2">
                        <Badge size="sm" variant="default" className="bg-[#05070f]/80 text-[#f8fbff] font-medium border border-[#7aa7ff]/12">
                          <Eye className="w-3 h-3 text-[#7aa7ff]" />
                          {vid.views || 0}
                        </Badge>
                      </div>
                    </Link>

                    {/* Content & Actions */}
                    <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                      <div>
                        <Link
                          to={`/watch/${vid.id}`}
                          className="text-sm font-bold text-[#f8fbff] hover:text-[#bcd3ff] transition-colors line-clamp-2 leading-snug"
                        >
                          {vid.title}
                        </Link>
                        <p className="text-xs text-[#98a2b3] line-clamp-2 mt-1">
                          {vid.description || 'Sin descripción'}
                        </p>
                        <p className="text-[11px] text-[#778295] mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(vid.created_at)}
                        </p>
                      </div>

                      {/* Video Management Actions (Owner only) */}
                      {isOwnProfile && (
                        <div className="flex items-center gap-2 pt-3 border-t border-[#7aa7ff]/12">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Edit3}
                            onClick={() => setEditingVideo(vid)}
                            className="flex-1 text-xs"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            loading={deletingId === vid.id}
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="text-xs px-2.5"
                            title="Eliminar video"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#0d1320]/70 rounded-3xl border border-[#7aa7ff]/12 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#7aa7ff]/10 border border-[#7aa7ff]/28 flex items-center justify-center text-[#7aa7ff] mx-auto mb-3">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#f8fbff]">No hay videos subidos</h3>
              <p className="text-xs text-[#98a2b3] mt-1 mb-5">
                {isOwnProfile
                  ? 'Aún no has publicado ningún video. Comienza subiendo tu primer video.'
                  : 'Este usuario aún no ha subido ningún video.'}
              </p>
              {isOwnProfile && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Upload}
                  onClick={() => setIsUploadOpen(true)}
                >
                  Subir mi Primer Video
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoPublished={handleVideoPublished}
      />

      <EditVideoModal
        isOpen={!!editingVideo}
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onVideoUpdated={handleVideoUpdated}
      />
    </MainLayout>
  );
};
