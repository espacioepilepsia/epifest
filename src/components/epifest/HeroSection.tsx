import { motion } from 'framer-motion';
import BrainFlowerSvg from './BrainFlowerSvg';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center bg-hero-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 md:w-96 opacity-20 animate-float">
        <BrainFlowerSvg />
      </div>
      <div className="absolute bottom-10 left-10 w-32 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
        <BrainFlowerSvg />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
            epifest! <span className="text-gradient-gold">2026</span>
          </h1>

          <p className="font-handwritten text-2xl md:text-3xl text-accent mb-6">
            El Congreso para la Comunidad
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
            ¡Transformemos el diagnóstico<br />en comunidad!
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block bg-coral rounded-full px-5 py-2 text-sm font-bold mb-6"
          >
            26 Y 27 DE MARZO 2026
          </motion.div>

          <p className="text-lg text-foreground/80 max-w-xl mb-10">
            5ta Edición del Congreso Latinoamericano de Epilepsia hecho{' '}
            <span className="font-semibold">"con y para"</span> la comunidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onRegisterClick} className="btn-gold text-base">
              ¡Inscribite Gratis!
            </button>
            <a
              href="#programa"
              className="glass-card rounded-full px-8 py-3 text-center font-semibold hover:bg-foreground/10 transition-all"
            >
              Ver Programa
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
