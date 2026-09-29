import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Play, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && !name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error en la autenticación. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Cloud<span className="text-gradient">Tube</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">
            {isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Únete a la plataforma para publicar y reproducir videos'
              : 'Ingresa tus credenciales para acceder a tu cuenta'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <FormField
                label="Nombre completo"
                required
                icon={User}
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            )}

            <FormField
              label="Correo electrónico"
              type="email"
              required
              icon={Mail}
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <FormField
              label="Contraseña"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              helpText={isRegister ? 'Mínimo 6 caracteres' : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="mt-2 w-full justify-center"
              icon={ArrowRight}
            >
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="ml-1.5 text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer"
              >
                {isRegister ? 'Inicia sesión aquí' : 'Regístrate aquí'}
              </button>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
};
