import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import espacioLogo from '@/assets/espacio-epilepsia-logo.png';
import laceLogo from '@/assets/lace-logo.png';

const organizers = [
  {
    name: 'Espacio Epilepsia',
    logo: espacioLogo,
    url: 'https://espacioepilepsia.org/',
    blend: 'screen' as const,
  },
  {
    name: 'LACE — Liga Argentina Contra la Epilepsia',
    logo: laceLogo,
    url: 'https://www.lace.org.ar/',
    blend: 'luminosity' as const,
  },
];

const OrganizerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-14 px-4" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/40 text-center mb-8"
        >
          Organiza
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {organizers.map((org, i) => (
            <motion.a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center gap-3 group"
              title={org.name}
            >
              <img
                src={org.logo}
                alt={org.name}
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: org.blend }}
              />
              <span className="text-xs text-foreground/40 group-hover:text-foreground/70 transition-colors text-center max-w-[140px] leading-tight">
                {org.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizerSection;
