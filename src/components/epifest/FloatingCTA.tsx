import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  // No mostrar en la página de inscripción
  const isInscripcionPage = location.pathname === '/inscripciones-epifest';

  useEffect(() => {
    if (sessionStorage.getItem('ctaDismissed') || isInscripcionPage) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [isInscripcionPage]);

  // Ocultar si navega a la página de inscripción
  useEffect(() => {
    if (isInscripcionPage) setVisible(false);
  }, [isInscripcionPage]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('ctaDismissed', '1');
  };

  if (dismissed || isInscripcionPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
        >
          <Link
            to="/inscripciones-epifest"
            onClick={() => setVisible(false)}
            className="btn-gold text-sm md:text-base px-6 py-3 shadow-2xl"
            style={{ boxShadow: '0 8px 32px rgba(201,146,42,0.5)' }}
          >
            🎉 ¡Inscribite al Epifest!
          </Link>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ backgroundColor: 'rgba(37,21,83,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
