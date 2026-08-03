import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Asegurate de tener tu cliente de supabase importado
import { LogIn, UserPlus, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Login / Registro tradicional con Email
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login rápido con Google
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl relative">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold"
        >
          ✕
        </button>

        {/* TITULO */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-wider text-yellow-400">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Accedé a tus entrenamientos y planes personalizados</p>
        </div>

        {/* BOTÓN DE GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-zinc-800"></div>
          <span className="px-3 text-xs text-zinc-500 font-bold uppercase">o con email</span>
          <div className="flex-1 border-t border-zinc-800"></div>
        </div>

        {/* ERROR MSG */}
        {errorMsg && (
          <div className="bg-red-950/60 border border-red-500 text-red-200 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@gmail.com"
                className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl transition-all uppercase text-sm tracking-wider flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarme'}
          </button>
        </form>

        {/* TOGGLE LOGIN / REGISTRO */}
        <div className="mt-6 text-center text-xs text-zinc-400">
          {isLogin ? '¿No tenés cuenta todavía?' : '¿Ya tenés una cuenta?'} {' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-yellow-400 font-bold hover:underline ml-1"
          >
            {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
          </button>
        </div>

      </div>
    </div>
  );
}
