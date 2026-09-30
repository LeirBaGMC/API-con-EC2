/**
 * Servicio temporal de prueba para consultar YouTube Data API v3
 * Utiliza Promise y fetch para obtener videos y mejorar la experiencia de usuario (UX).
 */

export const searchYouTubeVideos = (query = 'AWS Cloud Computing', customApiKey = '') => {
  return new Promise((resolve, reject) => {
    const apiKey = customApiKey || import.meta.env.VITE_YOUTUBE_API_KEY || '';

    if (!apiKey.trim()) {
      return reject(
        new Error(
          'Se requiere una API Key de YouTube Data API v3. Ingresa tu clave en el campo o define VITE_YOUTUBE_API_KEY en .env.'
        )
      );
    }

    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(
      query
    )}&type=video&key=${encodeURIComponent(apiKey.trim())}`;

    fetch(endpoint)
      .then(async (response) => {
        if (!response.ok) {
          let message = 'Error en la petición a YouTube API';
          try {
            const errorData = await response.json();
            message = errorData.error?.message || message;
          } catch {
            message = `Error HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(message);
        }
        return response.json();
      })
      .then((data) => {
        // Mapear los resultados estructurados para la vista
        const videos = (data.items || []).map((item) => ({
          id: item.id?.videoId,
          title: item.snippet?.title || 'Sin título',
          description: item.snippet?.description || '',
          thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            '',
          channelTitle: item.snippet?.channelTitle || 'Canal de YouTube',
          publishedAt: item.snippet?.publishedAt || '',
          videoUrl: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${item.id?.videoId}`,
        }));

        resolve(videos);
      })
      .catch((err) => {
        reject(new Error(err.message || 'Error de red al conectar con YouTube'));
      });
  });
};

