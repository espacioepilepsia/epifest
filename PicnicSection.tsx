import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const highlights = [
  { icon: Calendar, label: 'Fecha',     value: '27 de marzo 2026' },
  { icon: Clock,    label: 'Horario',   value: '17:00 hs' },
  { icon: MapPin,   label: 'Lugar',     value: 'Plaza Mafalda, CABA' },
  { icon: Users,    label: 'Capacidad', value: '~40 personas' },
];

const PICNIC_FORM_URL = '/inscripcion-picnic';

const PicnicSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="picnic" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🟣</span>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Purple Day · Día Internacional de la Epilepsia</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Picnic de<br /><span className="text-gradient-gold">Purple Day</span> 🌿
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-foreground/70 text-base md:text-lg leading-relaxed mb-6">
              Cerramos el congreso con un picnic al aire libre para conectarnos, celebrar los logros y coconstruir el camino del próximo año juntos.
              Un espacio donde la epilepsia deja de ser aislamiento y se convierte en comunidad.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="text-foreground/60 text-sm leading-relaxed mb-8">
              El formato elegido favorece la participación, la apertura emocional y la conversación espontánea. Abierto a personas con epilepsia, familias, amigos y organizaciones afines.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
              <Link
                to={PICNIC_FORM_URL}
                className="btn-gold text-sm inline-block"
              >
                Quiero participar
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-semibold mb-0.5">{item.label}</p>
                  <p className="font-bold text-sm md:text-base leading-tight">{item.value}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="glass-card rounded-2xl p-5 col-span-2"
            >
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-semibold mb-3">¿Qué vamos a hacer?</p>
              <ul className="space-y-1.5">
                {['🤝 Conectarnos con la comunidad', '💜 Concientizar sobre Purple Day', '🌱 Coconstruir el próximo año', '🎉 Celebrar los logros del congreso'].map(item => (
                  <li key={item} className="text-sm text-foreground/70">{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PicnicSection;
