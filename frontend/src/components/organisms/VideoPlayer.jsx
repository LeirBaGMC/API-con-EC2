import React from 'react';

export const VideoPlayer = ({ videoUrl, posterUrl, title }) => {
  // Resolve video URL: if it's a relative path, prefix API base URL
  const resolvedVideoSrc = videoUrl?.startsWith('http')
    ? videoUrl
    : videoUrl
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${videoUrl}`
    : '';

  const resolvedPoster = posterUrl?.startsWith('http')
    ? posterUrl
    : posterUrl
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${posterUrl}`
    : '';

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/40 border border-slate-800">
      {resolvedVideoSrc ? (
        <video
          key={resolvedVideoSrc}
          controls
          autoPlay
          playsInline
          poster={resolvedPoster}
          className="w-full h-full object-contain"
        >
          <source src={resolvedVideoSrc} type="video/mp4" />
          Tu navegador no soporta la reproducción de video HTML5.
        </video>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
          <p className="text-sm font-medium">Video no disponible</p>
        </div>
      )}
    </div>
  );
};
