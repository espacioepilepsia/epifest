import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';
import { supabase } from '@/integrations/supabase/client';
import { User, ArrowLeft } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string | null;
  institution: string | null;
  bio: string | null;
  photo_url: string | null;
}

const Oradores = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Speaker | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchSpeakers = async () => {
      const { data } = await supabase
        .from('speakers')
        .select('id, name, title, institution, bio, photo_url')
        .eq('visible', true)
        .order('display_order');
      setSpeakers(data || []);
      setLoading(false);
    };
    fetchSpeakers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Oradores"
        description="Conocé a los médicos, especialistas y voces de la comunidad que participan en el epifest! 2026. Expertos en epilepsia, salud mental, neurología y derechos del paciente."
        canonical="/oradores"
      />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/30 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Epifest 2026</span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-4">
              Quiénes<br /><span className="text-gradient-gold">hablan</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-xl">
              Médicos, especialistas y voces de la comunidad que compartirán su experiencia el 26 y 27 de marzo de 2026.
            </p>
          </motion.div>
        </div>
      </div>

      <section ref={ref} className="px-4 pb-28">
        <div className="container mx-auto max-w-5xl">
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-3xl p-6 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          )}
          {!loading && speakers.length === 0 && (
            <p className="text-foreground/50 text-center py-24 text-lg">Los oradores se anunciarán próximamente 💜</p>
          )}
          {!loading && speakers.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {speakers.map((speaker, i) => (
                <motion.button
                  key={speaker.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={() => setSelected(speaker)}
                  className="group relative glass-card rounded-3xl overflow-hidden text-left cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    {speaker.photo_url ? (
                      <img src={speaker.photo_url} alt={speaker.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-extrabold text-sm md:text-base leading-tight">{speaker.name}</h3>
                    {speaker.title && <p className="text-accent text-xs mt-0.5 font-medium">{speaker.title}</p>}
                    {speaker.institution && <p className="text-foreground/50 text-[10px] mt-0.5">{speaker.institution}</p>}
                    {speaker.bio && <span className="mt-2 text-[10px] text-secondary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Ver perfil →</span>}
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />

      {selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="glass-card rounded-3xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground text-xl font-bold">✕</button>
            {selected.photo_url ? (
              <img src={selected.photo_url} alt={selected.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-2 border-accent" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <h3 className="font-extrabold text-xl text-center">{selected.name}</h3>
            {selected.title && <p className="text-accent text-sm text-center mt-1">{selected.title}</p>}
            {selected.institution && <p className="text-foreground/50 text-xs text-center mt-1">{selected.institution}</p>}
            {selected.bio && <p className="text-foreground/70 text-sm mt-4 leading-relaxed text-center">{selected.bio}</p>}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Oradores;
