import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Sun, Palette, MessageCircle, Brain, Heart } from 'lucide-react';

const day1Topics = [
  { icon: Brain, title: 'Charlas interactivas', desc: 'Neurobiología, manejo de crisis, dieta cetogénica, cannabis medicinal, salud reproductiva' },
  { icon: MessageCircle, title: 'Diálogos en Espejo', desc: 'Diálogo de 30 min entre neurólogo/a y Paciente Experto/a' },
  { icon: Heart, title: 'Consultorio Abierto: Temas Tabú', desc: 'Q&A anónimo sobre sexualidad, miedos, discriminación, futuro' },
  { icon: Palette, title: 'Activación artística virtual', desc: '"¿Qué se siente tener una crisis?" — experiencia inmersiva' },
];

const day1Extra = ['Salud Mental', 'Autonomía Laboral', 'Violencia de Género y Epilepsia', 'Adherencia y Acceso a Tratamiento'];

const day2Topics = [
  { icon: Monitor, title: 'Mañana: Charlas online', desc: 'Continúan las charlas interactivas en formato virtual' },
  { icon: Sun, title: '16:00hs — Picnic Presencial', desc: 'Apagamos pantallas → Encuentro comunitario al aire libre' },
  { icon: Palette, title: 'Taller de arteterapia', desc: 'Creación colectiva en comunidad' },
  { icon: Heart, title: 'Workshop de Primeros Auxilios', desc: 'Primeros auxilios con movimiento — aprender haciendo' },
];

const ProgramSection = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const topics = activeDay === 1 ? day1Topics : day2Topics;

  return (
    <section id="programa" className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10"
        >
          Programa
        </motion.h2>

        {/* Tab selector */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setActiveDay(1)}
            className={`rounded-full px-6 py-3 font-bold text-sm transition-all ${
              activeDay === 1 ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            Día 1 — Jue 26/03
          </button>
          <button
            onClick={() => setActiveDay(2)}
            className={`rounded-full px-6 py-3 font-bold text-sm transition-all ${
              activeDay === 2 ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            Día 2 — Vie 27/03
          </button>
        </div>

        {/* Day subtitle */}
        <p className="font-handwritten text-xl text-accent mb-8">
          {activeDay === 1 ? '"La Frontera Digital" — 100% Virtual' : '"El Gran Cierre" — Híbrido'}
        </p>

        {/* Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 flex gap-4"
            >
              <topic.icon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">{topic.title}</h3>
                <p className="text-sm text-foreground/70">{topic.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Day 1 extra topics */}
        {activeDay === 1 && (
          <div className="flex flex-wrap gap-3">
            {day1Extra.map((tag) => (
              <span key={tag} className="glass-card rounded-full px-4 py-2 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramSection;
