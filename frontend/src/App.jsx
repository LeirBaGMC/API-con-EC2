import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Página 2: Principal (Catálogo de videos) */}
          <Route path="/" element={<HomePage />} />

          {/* Página 1: Registro / Login */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Página 3: Reproductor con comentarios y recomendados */}
          <Route path="/watch/:id" element={<WatchPage />} />

          {/* Página 4: Perfil de usuario, gestión y publicación de videos */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
