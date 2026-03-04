import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2, CheckCircle } from 'lucide-react';

type TabType = 'general' | 'speaker' | 'institution';

const tabs: { key: TabType; label: string }[] = [
  { key: 'general', label: 'Consulta general' },
  { key: 'speaker', label: 'Quiero ser orador/a' },
  { key: 'institution', label: 'Sumar mi institución' },
];

const successMessages: Record<TabType, string> = {
  general: '¡Gracias! Te responderemos a la brevedad 💜',
  speaker: '¡Gracias por tu interés! Revisaremos tu propuesta.',
  institution: '¡Genial! Nos pondremos en contacto pronto.',
};

const ContactSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const fd = new FormData(form);

    let extra_data: Record<string, string> | null = null;
    if (activeTab === 'speaker') {
      extra_data = {
        especialidad: fd.get('especialidad') as string,
        tema: fd.get('tema') as string,
        cv_link: fd.get('cv_link') as string || '',
      };
    } else if (activeTab === 'institution') {
      extra_data = {
        sitio_web: fd.get('sitio_web') as string || '',
      };
    }

    const { error: err } = await supabase.from('contact_messages').insert({
      type: activeTab,
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      organization: (fd.get('organization') as string) || null,
      message: fd.get('message') as string,
      extra_data,
    });

    setLoading(false);
    if (err) {
      setError('Hubo un error al enviar tu mensaje. Intentá de nuevo.');
    } else {
      setSuccess(true);
      form.reset();
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <section id="contacto" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10 text-center"
        >
          ¿Querés ser parte del <span className="text-gradient-gold">epifest</span>?
        </motion.h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); resetForm(); }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-secondary text-secondary-foreground' : 'glass-card'
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
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg font-semibold">{successMessages[activeTab]}</p>
            <button onClick={resetForm} className="mt-6 text-sm text-accent underline">
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
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
                <textarea name="message" required placeholder="Mensaje *" rows={4} className={inputClass} />
              </>
            )}

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
