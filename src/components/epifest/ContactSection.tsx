import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2, CheckCircle, MapPin } from 'lucide-react';

type TabType = 'general' | 'speaker' | 'institution';

const tabs: { key: TabType; label: string }[] = [
  { key: 'general',     label: 'Consulta general' },
  { key: 'speaker',     label: 'Quiero ser orador/a' },
  { key: 'institution', label: 'Sumar mi institución' },
];

const ASUNTO_OPTIONS = [
  { value: 'consulta_general', label: 'Consulta general' },
  { value: 'inscripcion',      label: 'Inscripción' },
  { value: 'picnic',           label: 'Picnic Purple Day' },
];

// Envía copia por email usando EmailJS (servicio gratuito, sin backend)
// Si preferís otra solución, reemplazá esta función.
async function sendEmailCopy(payload: {
  tab: TabType;
  name: string;
  email: string;
  organization?: string;
  asunto?: string;
  message: string;
  extra?: Record<string, string>;
}) {
  // Construye el cuerpo del email como texto plano
  const lines = [
    `Formulario: ${tabs.find(t => t.key === payload.tab)?.label}`,
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.organization ? `Organización: ${payload.organization}` : null,
    payload.asunto ? `Asunto: ${ASUNTO_OPTIONS.find(o => o.value === payload.asunto)?.label ?? payload.asunto}` : null,
    `Mensaje: ${payload.message}`,
    ...(payload.extra ? Object.entries(payload.extra).map(([k, v]) => `${k}: ${v}`) : []),
    '',
    `Recibido: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`,
  ].filter(Boolean).join('\n');

  // Usamos Supabase Edge Function si está disponible, o fallback a fetch de FormSubmit
  // FormSubmit.co es un servicio gratuito que no requiere backend:
  // Activación: la primera vez que se envía llega un mail de confirmación a la dirección destino
  try {
    await fetch('https://formsubmit.co/ajax/espacioepilepsia.arg@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: 'Form lleno epifest',
        _template: 'table',
        _captcha: 'false', // el honeypot lo manejamos nosotros
        body: lines,
        nombre: payload.name,
        email: payload.email,
        formulario: tabs.find(t => t.key === payload.tab)?.label,
        mensaje: payload.message,
      }),
    });
  } catch (_) {
    // El email es best-effort; si falla no bloqueamos el envío del form
  }
}

const ContactSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [asunto, setAsunto] = useState('');
  const [caba, setCaba] = useState('');
  const [noCaba, setNoCaba] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Escucha el evento custom de PicnicSection (componente ya montado en el DOM)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setActiveTab('general');
      setAsunto(detail);
      setCaba('');
      setNoCaba(false);
      setSuccess(false);
    };
    window.addEventListener('setContactAsunto', handler);

    // Fallback: si venimos de otra página con sessionStorage
    const intent = sessionStorage.getItem('contactAsunto');
    if (intent) {
      sessionStorage.removeItem('contactAsunto');
      setActiveTab('general');
      setAsunto(intent);
    }

    return () => window.removeEventListener('setContactAsunto', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const fd = new FormData(form);

    // ── Honeypot antispam ──────────────────────────────────────
    // El campo "website" es invisible para humanos; los bots lo llenan.
    if (fd.get('website')) {
      // Bot detectado — simulamos éxito sin guardar nada
      setLoading(false);
      setSuccess(true);
      return;
    }

    // ── Throttle simple: no más de 1 envío por minuto por sesión ──
    const lastSent = sessionStorage.getItem('lastFormSent');
    if (lastSent && Date.now() - Number(lastSent) < 60_000) {
      setLoading(false);
      setError('Por favor esperá un momento antes de enviar otro mensaje.');
      return;
    }

    const name         = fd.get('name') as string;
    const email        = fd.get('email') as string;
    const organization = (fd.get('organization') as string) || null;
    const message      = fd.get('message') as string;
    const asuntoVal    = asunto || (fd.get('asunto') as string) || null;

    let extra_data: Record<string, string> | null = null;
    if (activeTab === 'speaker') {
      extra_data = {
        especialidad: fd.get('especialidad') as string,
        tema:         fd.get('tema') as string,
        cv_link:      (fd.get('cv_link') as string) || '',
      };
    } else if (activeTab === 'institution') {
      extra_data = {
        sitio_web: (fd.get('sitio_web') as string) || '',
      };
    } else if (activeTab === 'general') {
      extra_data = {
        ...(asuntoVal ? { asunto: asuntoVal } : {}),
        ...(asuntoVal === 'picnic' && caba ? { reside_caba: caba } : {}),
      };
    }

    const { error: err } = await supabase.from('contact_messages').insert({
      type: activeTab,
      name,
      email,
      organization,
      message,
      extra_data,
    });

    if (err) {
      setLoading(false);
      setError('Hubo un error al enviar tu mensaje. Intentá de nuevo.');
      return;
    }

    // Guardar timestamp antispam
    sessionStorage.setItem('lastFormSent', String(Date.now()));

    // Enviar copia por email (best-effort)
    await sendEmailCopy({
      tab: activeTab,
      name,
      email,
      organization: organization ?? undefined,
      asunto: asuntoVal ?? undefined,
      message,
      extra: extra_data ?? undefined,
    });

    setLoading(false);
    setSuccess(true);
    form.reset();
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setAsunto('');
    setCaba('');
    setNoCaba(false);
  };

  const inputClass =
    'w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50';

  const selectClass =
    'w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 appearance-none cursor-pointer';

  return (
    <section id="contacto" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10 text-center"
        >
          ¿Querés ser parte del{' '}
          <span className="text-gradient-gold">epifest</span>?
        </motion.h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); resetForm(); }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-secondary text-secondary-foreground'
                  : 'glass-card'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center"
          >
            <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
            <p className="text-xl font-bold mb-2">¡Gracias por su mensaje!</p>
            <p className="text-foreground/70 text-base">
              Será contactado/a a la brevedad. 💜
            </p>
            <button
              onClick={resetForm}
              className="mt-6 text-sm text-accent underline hover:opacity-80 transition-opacity"
            >
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 md:p-8 space-y-4"
          >
            {/* ── Honeypot: oculto para humanos, visible para bots ── */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                placeholder="Leave this empty"
              />
            </div>

            {/* ── Formulario por tab ── */}
            {activeTab === 'institution' ? (
              <>
                <input name="organization" required placeholder="Nombre de la institución *" className={inputClass} />
                <input name="name" required placeholder="Nombre de contacto *" className={inputClass} />
                <input name="email" type="email" required placeholder="Email institucional *" className={inputClass} />
                <input name="sitio_web" placeholder="Sitio web" className={inputClass} />
                <textarea name="message" required placeholder="Mensaje / motivo *" rows={3} className={inputClass} />
              </>
            ) : activeTab === 'speaker' ? (
              <>
                <input name="name" required placeholder="Nombre completo *" className={inputClass} />
                <input name="email" type="email" required placeholder="Email *" className={inputClass} />
                <input name="organization" required placeholder="Institución *" className={inputClass} />
                <input name="especialidad" required placeholder="Especialidad *" className={inputClass} />
                <input name="tema" required placeholder="Tema de charla propuesto *" className={inputClass} />
                <textarea name="message" required placeholder="Breve bio *" rows={3} className={inputClass} />
                <input name="cv_link" placeholder="Link a CV o LinkedIn" className={inputClass} />
              </>
            ) : (
              <>
                <input name="name" required placeholder="Nombre completo *" className={inputClass} />
                <input name="email" type="email" required placeholder="Email *" className={inputClass} />

                {/* Desplegable de asunto — solo en consulta general */}
                <div className="relative">
                  <select
                    name="asunto"
                    required
                    value={asunto}
                    onChange={(e) => {
                      setAsunto(e.target.value);
                      setCaba('');
                      setNoCaba(false);
                    }}
                    className={selectClass}
                  >
                    <option value="" disabled>Asunto *</option>
                    {ASUNTO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Campo CABA — solo si el asunto es picnic */}
                {asunto === 'picnic' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <select
                      name="caba"
                      required
                      value={caba}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCaba(val);
                        setNoCaba(val === 'no');
                      }}
                      className={selectClass}
                    >
                      <option value="" disabled>¿Residís en CABA (Ciudad Autónoma de Buenos Aires)? *</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* Mensaje "no CABA" — reemplaza el resto del form */}
                {noCaba ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-xl p-5 flex gap-3 items-start border border-accent/30"
                  >
                    <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Muchas gracias por tu interés en el picnic, pero el mismo es{' '}
                      <span className="font-semibold text-foreground">solo presencial en CABA</span>.
                    </p>
                  </motion.div>
                ) : (
                  <textarea
                    name="message"
                    required
                    placeholder="Mensaje *"
                    rows={4}
                    className={inputClass}
                  />
                )}
              </>
            )}

            {error && <p className="text-destructive text-sm">{error}</p>}

            {!noCaba && (
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Enviar
              </button>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
