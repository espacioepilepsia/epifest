import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';
import { MapPin, Clock, Calendar, CheckCircle, Loader2, Send } from 'lucide-react';

const detalles = [
  { icon: Calendar, label: 'Fecha',    value: '27 de marzo de 2026' },
  { icon: Clock,    label: 'Horario',  value: '17:00 a 19:30 hs.' },
  { icon: MapPin,   label: 'Lugar',    value: 'Plaza Mafalda, CABA' },
];

const relacionOptions = [
  'Tengo diagnóstico de epilepsia',
  'Soy padre, madre o cuidador/a de una persona con epilepsia',
  'Soy otro tipo de familiar o tengo amistad con una persona con epilepsia',
  'Soy profesional de la salud y me dedico al área',
  'No tengo relación, simplemente me interesa',
];

const SHEETS_PICNIC_URL = 'https://script.google.com/macros/s/AKfycbx4HywGX5k5IkhyoEgClwkagjf6lQQpCCIo5sDL-0WR7X6mFSRl6JbfyLZbOT1HKbKw/exec';

type SuccessType = 'picnic' | 'picnic_via_epifest' | 'already_registered';

const InscripcionPicnic = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successType, setSuccessType] = useState<SuccessType | null>(null);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const inputClass  = 'w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50';
  const selectClass = 'w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 appearance-none cursor-pointer';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    if (fd.get('website')) { setLoading(false); setSuccessType('picnic'); return; }

    const name         = fd.get('name') as string;
    const email        = fd.get('email') as string;
    const ciudad       = fd.get('ciudad') as string;
    const relacion     = fd.get('relacion') as string;
    const info         = fd.get('info') as string;
    const comentarios  = fd.get('comentarios') as string;

    // ── Verificar si ya está registrado ──────────────────────────
    const { data: existing } = await supabase
      .from('contact_messages')
      .select('id, extra_data')
      .eq('email', email)
      .eq('type', 'general')
      .or('extra_data->>asunto.eq.picnic,extra_data->>asunto.eq.inscripcion_epifest')
      .limit(1);

    if (existing && existing.length > 0) {
      // Verificar si se registró al epifest con picnic incluido
      const viaEpifest = existing.some((r: any) =>
        r.extra_data?.asunto === 'inscripcion_epifest' &&
        r.extra_data?.picnic?.includes('SÍ')
      );
      setLoading(false);
      setSuccessType(viaEpifest ? 'picnic_via_epifest' : 'already_registered');
      return;
    }

    // ── Google Sheets ─────────────────────────────────────────────
    try {
      await fetch(SHEETS_PICNIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, ciudad, relacion, recibir_info: info, comentarios }),
      });
    } catch (_) {}

    // ── Supabase ──────────────────────────────────────────────────
    const { error: err } = await supabase.from('contact_messages').insert({
      type: 'general',
      name, email,
      organization: null,
      message: comentarios || '(sin comentarios)',
      extra_data: { asunto: 'picnic', ciudad, relacion, recibir_info: info },
    });

    // ── Email copia ───────────────────────────────────────────────
    try {
      await fetch('https://formsubmit.co/ajax/espacioepilepsia.arg@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nueva inscripción Picnic Purple Day epifest 2026',
          _template: 'table', _captcha: 'false',
          nombre: name, email, ciudad, relacion,
          recibir_info: info, comentarios: comentarios || '-',
        }),
      });
    } catch (_) {}

    setLoading(false);
    if (err) { setError('Hubo un error al enviar tu inscripción. Intentá de nuevo.'); }
    else { setSuccessType('picnic'); }
  };

  const SuccessMessages: Record<SuccessType, { emoji: string; title: string; body: string }> = {
    picnic: {
      emoji: '🌿',
      title: 'Gracias, tu lugar al picnic ya fue reservado.',
      body: 'Nos vemos el viernes 27 de marzo en Plaza Mafalda a las 17:00 hs. ¡Te esperamos!',
    },
    picnic_via_epifest: {
      emoji: '💜',
      title: 'Gracias, tu lugar al epifest ya fue reservado.',
      body: 'Ya te habías inscripto al epifest con el picnic incluido. ¡Nos vemos el 27 de marzo en Plaza Mafalda!',
    },
    already_registered: {
      emoji: '💜',
      title: 'Gracias, tu lugar ya ha sido reservado con anterioridad.',
      body: 'Ya tenemos tu inscripción al picnic registrada. Si tenés alguna duda escribinos a contacto@espacioepilepsia.org.',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Inscripción al Picnic Purple Day" description="Inscribite al Picnic de Purple Day del epifest! 2026. 27 de marzo, Plaza Mafalda, CABA." canonical="/inscripcion-picnic" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      <div className="relative pt-24 pb-16 px-4 overflow-hidden" ref={ref}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌿</span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Purple Day · 27 de marzo 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">¡Inscripción al<br /><span className="text-gradient-gold">Picnic de Purple Day!</span></h1>
            <p className="text-lg text-foreground/70 leading-relaxed mb-4"><span className="font-semibold text-foreground">¡Te invitamos al Picnic de Purple Day!</span><br />Un encuentro para conectar, compartir y cocrear el 2026.</p>
            <p className="text-base text-foreground/60 leading-relaxed mb-4">En <span className="font-semibold text-foreground">Fundación Espacio Epilepsia</span>, creemos que los encuentros presenciales son la mejor herramienta para reducir el aislamiento y fortalecer nuestra comunidad. Por eso, queremos cerrar el Epifest! con un <span className="font-semibold text-foreground">picnic al aire libre</span> diseñado para escucharnos, compartir momentos entre todos, y conectar en comunidad.</p>
            <p className="text-base text-foreground/60 leading-relaxed mb-8">Este es un espacio seguro y humano pensado para personas con epilepsia, familiares, amigos, profesionales de la salud y organizaciones que quieran sumarse a transformar la realidad de nuestra comunidad.</p>
            <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold text-base">¡Inscribite ahora!</button>
          </motion.div>
        </div>
      </div>

      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-2 mb-5"><span className="text-xl">📍</span><h2 className="text-xl font-extrabold">Detalles del Evento</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {detalles.map((d, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center"><d.icon className="w-4 h-4 text-accent" /></div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-semibold">{d.label}</p>
                <p className="font-bold text-sm">{d.value}</p>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-5 mb-8">
            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-widest mb-2">¿Qué haremos?</p>
            <p className="text-sm text-foreground/70 leading-relaxed">Dinámicas para conocernos, resumen del Epifest, charlas guiadas sobre nuestras experiencias y un espacio especial para dejar "Mensajes de felicidad" en nuestra red comunitaria.</p>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl mt-0.5">💜</span>
            <div>
              <h3 className="font-extrabold text-lg mb-2">¿Por qué sumarte?</h3>
              <p className="text-base text-foreground/60 leading-relaxed">Queremos conocer tus necesidades reales y que tu voz ayude a mejorar la representatividad de las personas con epilepsia. Vení a compartir una tarde de mantas, cintas violetas y construcción colectiva.</p>
            </div>
          </div>
          <p className="font-bold text-foreground/90 mt-6 mb-10">¡Inscribite a continuación y ayudanos a preparar todo para recibirte!</p>
        </div>
      </section>

      <section className="px-4 pb-28" ref={formRef}>
        <div className="container mx-auto max-w-xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-extrabold mb-8 text-center">Completá tu inscripción</motion.h2>

          {successType ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-10 text-center">
              <span className="text-5xl mb-4 block">{SuccessMessages[successType].emoji}</span>
              <p className="text-xl font-bold mb-3">{SuccessMessages[successType].title}</p>
              <p className="text-foreground/70 text-base leading-relaxed">{SuccessMessages[successType].body}</p>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-5">
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div><label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">Correo electrónico *</label><input name="email" type="email" required placeholder="tucorreo@ejemplo.com" className={inputClass} /></div>
              <div><label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">Nombre y Apellido *</label><input name="name" required placeholder="Tu nombre completo" className={inputClass} /></div>
              <div><label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">Ciudad de residencia *</label><input name="ciudad" required placeholder="Ej: Buenos Aires" className={inputClass} /></div>

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">¿Cuál es tu relación con la epilepsia? *</label>
                <div className="relative">
                  <select name="relacion" required defaultValue="" className={selectClass}>
                    <option value="" disabled>Seleccioná una opción</option>
                    {relacionOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center"><svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">¿Te interesa recibir información sobre epilepsia y próximos eventos? *</label>
                <div className="relative">
                  <select name="info" required defaultValue="" className={selectClass}>
                    <option value="" disabled>Seleccioná una opción</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center"><svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">Comentarios <span className="text-foreground/30 normal-case font-normal">(opcional)</span></label>
                <textarea name="comentarios" placeholder="¿Algo que quieras contarnos?" rows={3} className={inputClass} />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Enviar inscripción
              </button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default InscripcionPicnic;
