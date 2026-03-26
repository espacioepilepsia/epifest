import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';
import { Calendar, Monitor, CheckCircle, Loader2, Send } from 'lucide-react';

const PAISES = [
  'Argentina','Bolivia','Brasil','Chile','Colombia','Costa Rica','Cuba','Ecuador',
  'El Salvador','España','Estados Unidos','Guatemala','Haití','Honduras','México',
  'Nicaragua','Panamá','Paraguay','Perú','Puerto Rico','República Dominicana',
  'Uruguay','Venezuela',
];
const EDAD_OPTIONS    = ['0 a 18 años','18 a 25 años','25 a 35 años','35 a 45 años','Más de 45 años'];
const GENERO_OPTIONS  = ['Femenino','Masculino','Otro','Prefiero no responder'];
const RELACION_OPTIONS = [
  'Tengo diagnóstico de epilepsia',
  'Soy padre, madre o cuidador/a de una persona con epilepsia',
  'Soy otro tipo de familiar o tengo amistad con una persona con epilepsia',
  'Soy profesional de la salud y me dedico al área',
  'No tengo relación, simplemente me interesa',
];
const PICNIC_SI  = '¡SÍ! Reservame un lugar en el Picnic (Cupos limitados)';
const PICNIC_NO  = 'No puedo asistir, lo veré online';

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbykxyzNesJlgC2uGoEgog6GF9X-a9xrl2Z8Ju9K4KN-WE3dnePCxBbM-hX4ctH7JMo8/exec';

type SuccessType = 'epifest' | 'epifest_picnic' | 'already_registered';

const InscripcionEpifest = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successType, setSuccessType] = useState<SuccessType | null>(null);
  const [error, setError] = useState('');
  const [picnicSelection, setPicnicSelection] = useState('');
  
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
    if (fd.get('website')) { setLoading(false); setSuccessType('epifest'); return; }

    const name        = fd.get('name') as string;
    const email       = fd.get('email') as string;
    const edad        = fd.get('edad') as string;
    const genero      = fd.get('genero') as string;
    const ciudad      = fd.get('ciudad') as string;
    const pais        = fd.get('pais') as string;
    const picnic      = fd.get('picnic') as string;
    const relacion    = fd.get('relacion') as string;
    const info        = fd.get('info') as string;
    const comentarios = fd.get('comentarios') as string;
    const quierePicnic = picnic === PICNIC_SI;

    // ── Verificar si el email ya está registrado ──────────────────
    const { data: existing } = await supabase
      .from('contact_messages')
      .select('id, extra_data')
      .eq('email', email)
      .in('type', ['general'])
      .or('extra_data->>asunto.eq.inscripcion_epifest,extra_data->>asunto.eq.picnic')
      .limit(1);

    if (existing && existing.length > 0) {
      setLoading(false);
      setSuccessType('already_registered');
      return;
    }

    // ── Guardar en Supabase (registrations) ───────────────────────
    const profileMap: Record<string, string> = {
      'Tengo diagnóstico de epilepsia': 'paciente',
      'Soy padre, madre o cuidador/a de una persona con epilepsia': 'familiar',
      'Soy otro tipo de familiar o tengo amistad con una persona con epilepsia': 'familiar',
      'Soy profesional de la salud y me dedico al área': 'profesional',
      'No tengo relación, simplemente me interesa': 'otro'
    };

    await supabase.from('registrations').insert({
      name,
      email,
      country: pais,
      profile: profileMap[relacion] || 'otro'
    });

    // ── Guardar en epifest Sheet (Plan B: JSON + text/plain) ──────
    try {
      const payload = {
        'Dirección de correo electrónico': email,
        'Nombre y Apellido': name,
        'Edad': edad,
        'Género ': genero,
        'Ciudad de residencia': ciudad,
        'País de residencia': pais,
        'picnic_largo': picnic,
        'relacion': relacion,
        'info': info,
        'comentarios': comentarios || '',
        'restricciones': fd.get('restricciones') || '-',
        'cantidad': fd.get('cantidad') || '1',
        'tipo': 'epifest'
      };

      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
    } catch (_) {}
    // ── Guardar en Supabase (contact_messages como backup) ─────────
    await supabase.from('contact_messages').insert({
      type: 'general',
      name, email,
      organization: null,
      message: comentarios || '(sin comentarios)',
      extra_data: { 
        asunto: 'inscripcion_epifest', 
        edad, genero, ciudad, pais, picnic, relacion, 
        recibir_info: info,
        restricciones: fd.get('restricciones') as string,
        cantidad: fd.get('cantidad') as string
      },
    });

    // ── Email copia ───────────────────────────────────────────────
    try {
      await fetch('https://formsubmit.co/ajax/espacioepilepsia.arg@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Nueva inscripción epifest! 2026${quierePicnic ? ' + PICNIC' : ''}`,
          _template: 'table', _captcha: 'false',
          nombre: name, email, edad, genero, ciudad, pais,
          picnic, relacion, recibir_info: info, comentarios: comentarios || '-',
        }),
      });
    } catch (_) {}


    setLoading(false);
    setSuccessType(quierePicnic ? 'epifest_picnic' : 'epifest');
  };

  const SuccessMessages: Record<SuccessType, { emoji: string; title: string; body: string }> = {
    epifest: {
      emoji: '🎉',
      title: '¡Gracias! Tu lugar en el epifest fue reservado.',
      body: '24 horas antes del evento te enviaremos los enlaces de participación a tu correo. ¡Nos vemos el 26 y 27 de marzo!',
    },
    epifest_picnic: {
      emoji: '🎉',
      title: '¡Gracias! Tu lugar en el epifest y en el picnic fue reservado.',
      body: 'Nos vemos el 26 y 27 de marzo en el congreso, y el viernes 27 en Plaza Mafalda para el picnic. ¡Te esperamos!',
    },
    already_registered: {
      emoji: '💜',
      title: 'Gracias, tu lugar ya ha sido reservado con anterioridad.',
      body: 'Ya tenemos tu inscripción registrada. Si tenés alguna duda escribinos a contacto@espacioepilepsia.org.',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Inscripción epifest! 2026" description="Inscribite al epifest! 2026 — Congreso Latinoamericano de Epilepsia. 26 y 27 de marzo. Híbrido, streaming 100% gratuito para toda Latinoamérica." canonical="/inscripciones-epifest" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      <div className="relative pt-24 pb-12 px-4 overflow-hidden" ref={ref}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💜</span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">epifest! 2026 · 5ta Edición</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Inscripción al<br /><span className="text-gradient-gold">epifest! 2026</span></h1>
            <p className="text-xl font-bold text-foreground/90 mb-4">¡Tu diagnóstico no es tu límite! Sumate al Epifest 2026 💜✨</p>
            <p className="text-base text-foreground/60 leading-relaxed mb-8">El Congreso Latinoamericano de Epilepsia organizado por la <span className="font-semibold text-foreground">Fundación Espacio Epilepsia</span> en su 10.º aniversario. Un espacio hecho "con y para" la comunidad.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div><p className="font-bold text-sm">26 y 27 de marzo de 2026</p><p className="text-xs text-foreground/50">Dos días de congreso</p></div>
              </div>
              <div className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <Monitor className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div><p className="font-bold text-sm">Modalidad Híbrida</p><p className="text-xs text-foreground/50">Streaming 100% gratuito para Latinoamérica</p></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-8">
              <p className="font-bold text-sm text-foreground/50 uppercase tracking-widest mb-4">¿Qué te espera en estos dos días?</p>
              <div className="space-y-3">
                {[
                  { emoji: '🧠', title: 'Ciencia que se entiende', desc: 'Charlas sin palabras difíciles sobre neurobiología, protocolos de crisis y nuevos tratamientos de rescate.' },
                  { emoji: '🗺️', title: 'Herramientas para la libertad', desc: '¿Se puede viajar? ¿Hacer deporte? ¿Cómo afecta a las hormonas o la sexualidad? Vamos a hablar de TODO.' },
                  { emoji: '🌿', title: 'Bienestar real', desc: 'De la mano de expertos en Dieta Cetogénica y Cannabis, aprenderemos a cuidar la mente y el cuerpo.' },
                  { emoji: '🌎', title: 'Red Latinoamericana', desc: 'Conectate con una comunidad de personas que entienden exactamente lo que sentís.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{item.emoji}</span>
                    <p className="text-sm text-foreground/70 leading-relaxed"><span className="font-semibold text-foreground">{item.title}:</span> {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-foreground/50 italic mb-6">📧 24 horas antes del evento te enviaremos los enlaces de participación por correo electrónico.</p>
            <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold text-base">¡Inscribite gratis!</button>
          </motion.div>
        </div>
      </div>

      <section className="px-4 pb-28" ref={formRef}>
        <div className="container mx-auto max-w-xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-extrabold mb-8 text-center">
            Completá tu inscripción
          </motion.h2>

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

              {[
                { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tucorreo@ejemplo.com' },
                { name: 'name',  label: 'Nombre y Apellido',  type: 'text', placeholder: 'Tu nombre completo' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">{f.label} *</label>
                  <input name={f.name} type={f.type} required placeholder={f.placeholder} className={inputClass} />
                </div>
              ))}

              {[
                { name: 'edad',   label: 'Edad',   options: EDAD_OPTIONS,   placeholder: 'Seleccioná tu rango de edad' },
                { name: 'genero', label: 'Género', options: GENERO_OPTIONS,  placeholder: 'Seleccioná una opción' },
              ].map(s => (
                <div key={s.name}>
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">{s.label} *</label>
                  <div className="relative">
                    <select name={s.name} required defaultValue="" className={selectClass}>
                      <option value="" disabled>{s.placeholder}</option>
                      {s.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center"><svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                  </div>
                </div>
              ))}

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">Ciudad de residencia *</label>
                <input name="ciudad" required placeholder="Ej: Buenos Aires" className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">País de residencia *</label>
                <div className="relative">
                  <select name="pais" required defaultValue="" className={selectClass}>
                    <option value="" disabled>Seleccioná tu país</option>
                    {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center"><svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">📍 ¿Estás en Buenos Aires o alrededores? *</label>
                <p className="text-xs text-accent mb-2">Invitación al Picnic Presencial Exclusivo — viernes 27 de marzo a las 16:00 hs</p>
                <div className="relative">
                  <select 
                    name="picnic" 
                    required 
                    defaultValue="" 
                    className={selectClass}
                    onChange={(e) => setPicnicSelection(e.target.value)}
                  >
                    <option value="" disabled>Seleccioná una opción</option>
                    <option value={PICNIC_SI}>{PICNIC_SI}</option>
                    <option value={PICNIC_NO}>{PICNIC_NO}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center"><svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>

              {picnicSelection === PICNIC_SI && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 overflow-hidden">
                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">¿Tenes alguna restricción alimentaria? <span className="text-foreground/30 normal-case font-normal">(opcional)</span></label>
                    <input name="restricciones" placeholder="Ej: Celiquía, Vegano, ninguna..." className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">¿Cuántas personas vienen al picnic con vos? *</label>
                    <input name="cantidad" type="number" min="1" required defaultValue="1" className={inputClass} />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5 block">¿Cuál es tu relación con la epilepsia? *</label>
                <div className="relative">
                  <select name="relacion" required defaultValue="" className={selectClass}>
                    <option value="" disabled>Seleccioná una opción</option>
                    {RELACION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
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

              <p className="text-xs text-foreground/40 italic">📧 24 horas antes del evento te enviaremos los enlaces de participación por correo electrónico.</p>
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

export default InscripcionEpifest;
