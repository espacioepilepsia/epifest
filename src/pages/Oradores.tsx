import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';
import { supabase } from '@/integrations/supabase/client';
import { User, ArrowLeft, ChevronDown, X } from 'lucide-react';

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
        description="Conocé a los médicos, especialistas y voces de la comunidad que participan en el epifest! 2026."
        canonical="/oradores"
      />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      <div className="relative pt-24 pb-12 px-4 overflow-hidden">
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
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-16 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && speakers.length === 0 && (
            <p className="text-foreground/50 text-center py-24 text-lg">Los oradores se anunciarán próximamente 💜</p>
          )}

          {!loading && speakers.length > 0 && (
            <div className="space-y-3">
              {speakers.map((speaker, i) => (
                <motion.button
                  key={speaker.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  onClick={() => setSelected(speaker)}
                  className="w-full glass-card rounded-2xl px-5 py-4 flex items-center gap-4 text-left hover:bg-white/10 transition-colors group"
                >
                  {/* Número */}
                  <span className="text-xs font-bold text-primary-foreground/40 w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Avatar pequeño */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                    {speaker.photo_url ? (
                      <img src={speaker.photo_url} alt={speaker.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Nombre y título */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm md:text-base leading-tight truncate">{speaker.name}</p>
                    {speaker.title && (
                      <p className="text-accent text-xs mt-0.5 truncate">{speaker.title}</p>
                    )}
                  </div>

                  {/* Flecha */}
                  <ChevronDown className="w-4 h-4 text-foreground/30 group-hover:text-foreground/60 transition-colors flex-shrink-0 -rotate-90" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />

      {/* Modal detalle */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Foto grande */}
              <div className="flex justify-center mb-5">
                {selected.photo_url ? (
                  <img
                    src={selected.photo_url}
                    alt={selected.name}
                    className="w-32 h-32 rounded-full object-cover border-2 border-accent"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-14 h-14 text-muted-foreground" />
                  </div>
                )}
              </div>

              <h3 className="font-extrabold text-xl text-center mb-1">{selected.name}</h3>
              {selected.title && (
                <p className="text-accent text-sm text-center font-medium mb-1">{selected.title}</p>
              )}
              {selected.institution && (
                <p className="text-foreground/40 text-xs text-center mb-4">{selected.institution}</p>
              )}
              {selected.bio && (
                <p className="text-foreground/70 text-sm leading-relaxed text-center">{selected.bio}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Oradores;
