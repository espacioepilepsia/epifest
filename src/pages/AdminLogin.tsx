import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Credenciales incorrectas.');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    setLoading(false);
    if (error) {
      setError('No se pudo enviar el email. Verificá la dirección.');
    } else {
      setResetSent(true);
    }
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 max-w-sm w-full">
        <h1 className="text-2xl font-extrabold text-center mb-2">
          epifest! <span className="text-gradient-gold">Admin</span>
        </h1>
        <p className="text-sm text-foreground/60 text-center mb-8">
          {resetMode ? 'Recuperar contraseña' : 'Ingresá con tu cuenta'}
        </p>

        {resetSent ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-accent mx-auto" />
            <p className="text-sm text-foreground/70">
              Te enviamos un email con el link para resetear tu contraseña.
            </p>
            <button
              onClick={() => { setResetMode(false); setResetSent(false); }}
              className="text-sm text-accent underline"
            >
              Volver al login
            </button>
          </div>
        ) : resetMode ? (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={inputClass}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enviar email de recuperación
            </button>
            <button
              type="button"
              onClick={() => { setResetMode(false); setError(''); }}
              className="w-full text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              Volver al login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className={inputClass}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Ingresar
            </button>
            <button
              type="button"
              onClick={() => { setResetMode(true); setError(''); }}
              className="w-full text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              Olvidé mi contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;