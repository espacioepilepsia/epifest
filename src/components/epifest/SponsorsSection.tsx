import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Building2 } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('id, name, logo_url, website_url')
        .eq('visible', true)
        .order('display_order');
      setSponsors(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section id="sponsors" className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-4 text-center"
        >
          Sponsors
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-foreground/50 text-sm mb-10"
        >
          ¿Querés sumar tu marca? <a href="#contacto" className="text-accent underline">Contactanos</a>
        </motion.p>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-32 h-20 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : sponsors.length === 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-32 h-20 glass-card rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {sponsors.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="h-32 md:h-40 w-auto object-contain"
                    style={{ minWidth: '200px', minHeight: '200px' }}
                  />
                ) : (
                  <div className="h-24 w-40 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground/60">{sponsor.name}</span>
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;
