import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import espacioLogo from '@/assets/espacio-epilepsia-logo.png';
import laceLogo from '@/assets/lace-logo.png';

const organizers = [
  {
    name: 'Espacio Epilepsia',
    logo: espacioLogo,
    url: 'https://espacioepilepsia.org/',
    lines: ['Espacio Epilepsia'],
  },
  {
    name: 'LACE',
    logo: laceLogo,
    url: 'https://www.lace.org.ar/',
    lines: ['LACE', 'Liga Argentina', 'Contra la Epilepsia'],
  },
];

const OrganizerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 px-4 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-5xl relative z-10">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/40 text-center mb-10"
        >
          Organiza
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {organizers.map((org, i) => (
            <motion.a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col items-center gap-3 group"
            >
              <img
                src={org.logo}
                alt={org.name}
                className="h-20 md:h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                style={{ mixBlendMode: 'screen' }}
              />
              <div className="text-center">
                {org.lines.map((line, j) => (
                  <p
                    key={j}
                    className={`leading-tight transition-colors ${
                      j === 0
                        ? 'font-bold text-sm md:text-base text-foreground/80 group-hover:text-foreground'
                        : 'text-xs text-foreground/50 group-hover:text-foreground/70'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />
      </div>
    </section>
  );
};

export default OrganizerSection;
