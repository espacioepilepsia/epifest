import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import espacioLogo from '@/assets/espacio-epilepsia-logo.png';
import laceLogo from '@/assets/lace-logo.png';

const organizers = [
  {
    id: 'espacio',
    logo: espacioLogo,
    url: 'https://espacioepilepsia.org/',
    name: 'Espacio Epilepsia',
    desc: 'Espacio Epilepsia es una plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.',
  },
  {
    id: 'lace',
    logo: laceLogo,
    url: 'https://www.lace.org.ar/',
    name: 'LACE',
    desc: 'La Liga Argentina Contra la Epilepsia (LACE) es la primera entidad creada en Latinoamérica con el propósito de difundir los conocimientos relacionados a las epilepsias, así como también colaborar en temas referentes al perfil social e información de la población en relación a la epilepsia.',
  },
];

const OrganizerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 px-4" ref={ref}>
      <div className="container mx-auto max-w-4xl">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/40 text-center mb-12"
        >
          Organiza
        </motion.p>

        <div className="flex flex-col gap-14">
          {organizers.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-8"
            >
              {/* Logo con fondo transparente — sin filtros */}
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300"
              >
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-44 h-auto object-contain"
                />
              </a>

              {/* Texto */}
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                {org.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />
      </div>
    </section>
  );
};

export default OrganizerSection;
