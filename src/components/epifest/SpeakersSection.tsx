import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string | null;
  institution: string | null;
  bio: string | null;
  photo_url: string | null;
}

const SpeakersSection = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
    <section id="oradores" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10"
        >
          Oradores <span className="text-gradient-gold">2026</span>
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-2" />
                <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : speakers.length === 0 ? (
          <p className="text-foreground/60 text-center py-12">
            Los oradores se anunciarán próximamente. ¡Mantenete al tanto!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((speaker, i) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                {speaker.photo_url ? (
                  <img
                    src={speaker.photo_url}
                    alt={speaker.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-accent"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <h3 className="font-bold text-lg">{speaker.name}</h3>
                {speaker.title && <p className="text-sm text-accent">{speaker.title}</p>}
                {speaker.institution && (
                  <p className="text-xs text-foreground/60 mt-1">{speaker.institution}</p>
                )}
                {speaker.bio && (
                  <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{speaker.bio}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpeakersSection;
