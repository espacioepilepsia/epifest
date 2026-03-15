import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Countdown ─────────────────────────────────────────────────────────────────
const TARGET = new Date('2026-03-25T13:00:00Z'); // 25/03/2026 10:00 ARG (UTC-3)

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="glass-card rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[64px] md:min-w-[80px] text-center">
      <span className="text-3xl md:text-5xl font-extrabold text-accent tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs text-muted-foreground mt-2 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const Countdown = () => {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const isOver =
    time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (isOver) {
    return (
      <p className="text-accent font-bold text-xl animate-pulse">
        🎉 ¡El evento está comenzando!
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
        ⏳ Faltan para el congreso
      </p>
      <div className="flex items-end gap-2 md:gap-4">
        <CountdownUnit value={time.days}    label="días" />
        <span className="text-2xl md:text-4xl font-extrabold text-accent mb-3 md:mb-4 leading-none">:</span>
        <CountdownUnit value={time.hours}   label="horas" />
        <span className="text-2xl md:text-4xl font-extrabold text-accent mb-3 md:mb-4 leading-none">:</span>
        <CountdownUnit value={time.minutes} label="minutos" />
        <span className="text-2xl md:text-4xl font-extrabold text-accent mb-3 md:mb-4 leading-none">:</span>
        <CountdownUnit value={time.seconds} label="segundos" />
      </div>
      <p className="text-xs text-muted-foreground">25 de marzo de 2026 · 10:00 hs (ARG)</p>
    </div>
  );
};

// ── HeroSection ───────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onRegisterClick: () => void;
}

const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 section-padding overflow-hidden"
    >
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="glass-card rounded-full px-4 py-1 text-xs font-semibold text-accent uppercase tracking-widest">
            5° Edición · 25 y 26 de marzo 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight"
        >
          epifest!
          <span className="block text-accent">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          Congreso Latinoamericano de Epilepsia para pacientes, familias y cuidadores.
        </motion.p>

        {/* ── Contador regresivo ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full flex justify-center"
        >
          <Countdown />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button onClick={onRegisterClick} className="btn-gold text-base px-8 py-3">
            ¡Inscribite gratis!
          </button>
          <a
            href="/programa"
            className="glass-card rounded-full px-8 py-3 font-semibold text-base hover:bg-white/10 transition-colors"
          >
            Ver programa
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
