import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Heart, Monitor } from 'lucide-react';

const stats = [
  { icon: Users, value: '+30.000', label: 'personas alcanzadas', color: 'text-accent' },
  { icon: Heart, value: '100%', label: 'Gratuito', color: 'text-secondary' },
  { icon: Monitor, value: 'Híbrido', label: 'Presencial + YouTube', color: 'text-teal' },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            ¿Qué es el <span className="text-gradient-gold">epifest</span>?
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mb-12">
            No es solo un congreso médico. Es un ecosistema de aprendizaje 360° donde la ciencia
            se explica en lenguaje amigable y la experiencia real de los pacientes es la protagonista.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
              <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-sm text-foreground/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-foreground/70 max-w-3xl text-base leading-relaxed"
        >
          Porque la epilepsia no define a nadie. Porque la información es poder. Porque juntos
          reducimos el estigma y empoderamos a quienes conviven con esta condición. El epifest
          es el espacio donde pacientes, familias y profesionales se encuentran para transformar
          realidades.
        </motion.p>
      </div>
    </section>
  );
};

export default AboutSection;
