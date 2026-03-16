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
    desc: 'Plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.',
  },
  {
    id: 'lace',
    logo: laceLogo,
    url: 'https://www.lace.org.ar/',
    name: 'LACE',
    fullName: 'Liga Argentina Contra la Epilepsia',
    desc: 'Primera entidad creada en Latinoamérica con el propósito de difundir los conocimientos relacionados a las epilepsias y colaborar en temas referentes al perfil social e información de la población.',
  },
];

const OrganizerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 px-4" ref={ref}>
      <div className="container mx-auto max-w-5xl">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/40 text-center mb-12"
        >
          Organiza
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {organizers.map((org, i) => (
            <motion.a
              key={org.id}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:scale-[1.02] transition-transform duration-300 group"
            >
              {/* Logo: invert hace blanco→negro y negro→blanco,
                  luego invert de vuelta queda blanco sobre transparente
                  gracias a brightness+contrast */}
              <div className="h-24 flex items-center justify-center">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-20 w-auto object-contain"
                  style={{
                    filter: 'invert(1) brightness(2)',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              <div>
                <p className="font-extrabold text-lg text-foreground group-hover:text-accent transition-colors">
                  {org.name}
                </p>
                {'fullName' in org && org.fullName && (
                  <p className="text-xs text-accent font-semibold mt-0.5">{org.fullName}</p>
                )}
                <p className="text-sm text-foreground/60 mt-3 leading-relaxed">
                  {org.desc}
                </p>
              </div>

              <span className="text-xs text-foreground/30 group-hover:text-accent transition-colors">
                {org.url.replace('https://', '').replace(/\/$/, '')} →
              </span>
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
