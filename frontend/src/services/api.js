// Base URL configurable via environment variable for EC2 deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorDetail = 'Ocurrió un error en la petición';
    try {
      const data = await response.json();
      errorDetail = data.detail || data.message || JSON.stringify(data);
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return response.json();
};

export const api = {
  // Autenticación y Usuarios
  auth: {
    register: async ({ name, email, password }) => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },

    login: async ({ email, password }) => {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getUser: async (id) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Videos
  videos: {
    getAll: async ({ search = '', userId = null, limit = 50, offset = 0 } = {}) => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (userId) params.append('user_id', userId);
      params.append('limit', limit);
      params.append('offset', offset);

      const res = await fetch(`${API_BASE_URL}/videos?${params.toString()}`);
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/videos/${id}`);
      return handleResponse(res);
    },

    getRecommended: async (id, limit = 8) => {
      const res = await fetch(`${API_BASE_URL}/videos/${id}/recommended?limit=${limit}`);
      return handleResponse(res);
    },

    publish: async (formData) => {
      const res = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: getHeaders(true), // Content-Type lo asigna automáticamente el browser con el boundary multipart
        body: formData,
      });
      return handleResponse(res);
    },

    publishJson: async (videoData) => {
      const res = await fetch(`${API_BASE_URL}/videos/json`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(videoData),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Comentarios
  comments: {
    getByVideo: async (videoId) => {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`);
      return handleResponse(res);
    },

    create: async (videoId, content) => {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(res);
    },
  },
};
