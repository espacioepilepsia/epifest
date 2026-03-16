import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Mostrar después de 3 segundos si no fue descartado
    const dismissed = sessionStorage.getItem('ctaDismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('ctaDismissed', '1');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl"
          style={{ backgroundColor: 'rgba(37,21,83,0.97)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
        >
          <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="text-sm font-medium text-white/80 whitespace-nowrap">
            26 y 27 de marzo — ¡es gratis!
          </span>
          <Link
            to="/inscripciones-epifest"
            className="btn-gold text-xs px-4 py-2 whitespace-nowrap"
            onClick={() => setVisible(false)}
          >
            Inscribite
          </Link>
          <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
