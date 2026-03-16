import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import espacioLogo from '@/assets/espacio-epilepsia-logo.png';
import laceLogo from '@/assets/lace-logo.png';

const organizers = [
  {
    id: 'espacio',
    logo: espacioLogo,
    url: 'https://espacioepilepsia.org/',
    desc: 'Espacio Epilepsia es una plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.',
  },
  {
    id: 'lace',
    logo: laceLogo,
    url: 'https://www.lace.org.ar/',
    desc: 'La Liga Argentina Contra la Epilepsia (LACE) es la primera entidad creada en Latinoamérica con el propósito de difundir los conocimientos relacionados a las epilepsias, así como también colaborar en temas referentes al perfil social e información de la población en relación a la epilepsia.',
  },
];

const OrganizerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">

        {/* Título coherente con SponsorsSection */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10 text-center"
        >
          Organiza
        </motion.h2>

        <div className="flex flex-col gap-14">
          {organizers.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-8"
            >
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300"
              >
                <img
                  src={org.logo}
                  alt={org.id}
                  className="w-44 h-auto object-contain"
                />
              </a>

              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                {org.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizerSection;
