import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

const profiles = [
  { value: 'paciente', label: 'Paciente' },
  { value: 'familiar', label: 'Familiar / Cuidador' },
  { value: 'profesional', label: 'Profesional de la salud' },
  { value: 'otro', label: 'Otro' },
];

const RegistrationModal = ({ open, onClose }: RegistrationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const { error: err } = await supabase.from('registrations').insert({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      country: fd.get('country') as string,
      profile: fd.get('profile') as string,
    });

    setLoading(false);
    if (err) {
      setError('Hubo un error. Por favor intentá de nuevo.');
    } else {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="glass-card rounded-3xl p-6 md:p-8 max-w-md w-full relative border border-border/30"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'hsl(263, 70%, 18%)' }}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-foreground/60 hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">¡Ya estás inscripto/a!</h3>
            <p className="text-foreground/70 text-sm mb-6">
              Te enviaremos los accesos por email. #epifest2026 💜
            </p>
            <a
              href="https://forms.gle/EJDhFii8JChQPMND9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent flex items-center justify-center gap-1 hover:underline"
            >
              También podés registrarte por Google Form <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-extrabold mb-6">¡Reservá tu lugar!</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" required placeholder="Nombre completo *" className={inputClass} />
              <input name="email" type="email" required placeholder="Email *" className={inputClass} />
              <input name="country" required placeholder="País *" className={inputClass} />
              <select name="profile" required className={inputClass}>
                <option value="">Perfil *</option>
                {profiles.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inscribirme'}
              </button>
            </form>

            <p className="text-xs text-foreground/40 text-center mt-4">
              También podés registrarte vía{' '}
              <a
                href="https://forms.gle/EJDhFii8JChQPMND9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                Google Form
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
