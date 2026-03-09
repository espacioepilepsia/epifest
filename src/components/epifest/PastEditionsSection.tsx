import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const editions = [
  { year: '2025', tagline: '4ta Edición — Expandiendo fronteras', link: '#' },
  { year: '2024', tagline: '3ra Edición — Comunidad en acción', link: '#' },
  { year: '2023', tagline: '2da Edición — Rompiendo estigmas', link: '#' },
  { year: '2022', tagline: '1ra Edición — El comienzo', link: '/edicion/2022' },
];

const PastEditionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10"
        >
          Ediciones anteriores
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editions.map((ed, i) => (
            <motion.a
              key={ed.year}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform group"
            >
              <p className="text-3xl font-extrabold text-gradient-gold mb-2">{ed.year}</p>
              <p className="text-xs text-foreground/60 mb-4">{ed.tagline}</p>
              <span className="text-sm text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver edición <ArrowRight className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEditionsSection;
