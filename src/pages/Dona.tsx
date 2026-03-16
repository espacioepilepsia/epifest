import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';
import { Heart, RefreshCw, ArrowLeft, Shield, Sparkles, Copy, Check, ExternalLink, X } from 'lucide-react';

const DONATION_LINKS = [
  {
    id: 'mp',
    name: 'Mercado Pago',
    emoji: '💳',
    href: 'https://link.mercadopago.com.ar/espacioepilepsia',
    type: 'link' as const,
  },
  {
    id: 'cafecito',
    name: 'Cafecito',
    emoji: '☕',
    href: 'https://cafecito.app/espacioepilepsia',
    type: 'link' as const,
  },
  {
    id: 'macro',
    name: 'Transferencia — Banco Macro',
    emoji: '🏦',
    type: 'info' as const,
    info: [
      { label: 'CBU',     value: '2850306430094206069221' },
      { label: 'Alias',   value: 'espacioepilepsia' },
      { label: 'Titular', value: 'Fundación Espacio Epilepsia' },
      { label: 'CUIT',    value: '30-71782815-8' },
      { label: 'Tipo',    value: 'Cuenta Corriente' },
    ],
  },
  {
    id: 'mpcvu',
    name: 'Transferencia — Mercado Pago',
    emoji: '📲',
    type: 'info' as const,
    info: [
      { label: 'CVU',       value: '0000003100125649153174' },
      { label: 'Alias',     value: 'espacio.epilepsia' },
      { label: 'Titular',   value: 'Fundación Espacio Epilepsia' },
      { label: 'CUIT/CUIL', value: '30717828158' },
    ],
  },
];

const impactRows = [
  { amount: '$20.000', desc: 'Video testimonial sobre epilepsia',           emoji: '🎥' },
  { amount: '$40.000', desc: 'Materiales educativos de primeros auxilios',  emoji: '📚' },
  { amount: '$80.000', desc: 'Charla en vivo para cientos de personas',     emoji: '🎙️' },
];

const DonationLinktree = ({ onClose }: { onClose: () => void }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="glass-card rounded-3xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">💜</p>
          <h3 className="font-extrabold text-xl mb-1">Donación única</h3>
          <p className="text-sm text-foreground/60">Elegí tu plataforma preferida</p>
        </div>

        <div className="space-y-3">
          {DONATION_LINKS.map(opt => (
            <div key={opt.id}>
              {opt.type === 'link' ? (
                <a
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 glass-card rounded-2xl px-5 py-4 hover:scale-[1.02] transition-transform w-full"
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-bold flex-1">{opt.name}</span>
                  <ExternalLink className="w-4 h-4 text-foreground/40" />
                </a>
              ) : (
                <div>
                  <button
                    onClick={() => setExpanded(expanded === opt.id ? null : opt.id)}
                    className="flex items-center gap-3 glass-card rounded-2xl px-5 py-4 hover:scale-[1.02] transition-transform w-full text-left"
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-bold flex-1">{opt.name}</span>
                    <motion.span animate={{ rotate: expanded === opt.id ? 180 : 0 }} className="text-foreground/40 text-xs">▼</motion.span>
                  </button>
                  <AnimatePresence>
                    {expanded === opt.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="glass-card rounded-b-2xl px-5 py-4 space-y-2 border-t border-border/20">
                          {opt.info!.map(row => (
                            <div key={row.label} className="flex items-center gap-2">
                              <span className="text-xs text-foreground/50 w-20 flex-shrink-0">{row.label}</span>
                              <span className="text-sm font-mono font-bold flex-1 truncate">{row.value}</span>
                              <button onClick={() => copy(row.value, `${opt.id}-${row.label}`)} className="text-foreground/40 hover:text-accent transition-colors flex-shrink-0">
                                {copied === `${opt.id}-${row.label}` ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-foreground/40">
          <Shield className="w-3 h-3" />
          <span>Transparencia total: rendimos cuenta de cada peso donado.</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dona = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showLinktree, setShowLinktree] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleMensualClick = () => {
    window.dispatchEvent(new CustomEvent('setContactAsunto', { detail: 'donacion' }));
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Doná" description="Ayudanos a que más personas accedan a información de calidad sobre epilepsia. Tu donación a la Fundación Espacio Epilepsia hace la diferencia." canonical="/dona" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Fundación Espacio Epilepsia</span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-4">Sembrá<br /><span className="text-gradient-gold">conciencia</span> 💜</h1>
            <p className="text-foreground/60 text-lg max-w-xl">Con tu aporte, ayudás a que más personas accedan a información de calidad sobre epilepsia, de forma totalmente gratuita.</p>
          </motion.div>
        </div>
      </div>

      <section ref={ref} className="px-4 pb-28">
        <div className="container mx-auto max-w-5xl space-y-16">

          {/* 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setShowLinktree(true)}
            >
              <Heart className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-extrabold text-xl mb-2">Donación única</h3>
              <p className="text-sm text-foreground/60 mb-6 flex-1">Cualquier monto suma. Elegí entre Mercado Pago, Cafecito o transferencia bancaria.</p>
              <span className="btn-gold text-sm w-full text-center">Ver opciones de pago</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center border border-secondary/30 cursor-pointer hover:scale-[1.02] transition-transform relative"
              onClick={handleMensualClick}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Recomendado
                </span>
              </div>
              <RefreshCw className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-extrabold text-xl mb-2">Donación mensual u otras formas</h3>
              <p className="text-sm text-foreground/60 mb-6 flex-1">Acompañanos todo el año con un aporte recurrente o contactanos para explorar otras formas de colaborar.</p>
              <span className="btn-gold text-sm w-full text-center">Contactanos</span>
            </motion.div>
          </div>

          {/* Impacto */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6">¿Qué logramos con tu aporte?</h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              {impactRows.map((row, i) => (
                <div key={row.amount} className={`flex items-center gap-4 px-6 py-5 ${i !== impactRows.length - 1 ? 'border-b border-border/30' : ''}`}>
                  <span className="text-2xl">{row.emoji}</span>
                  <span className="font-extrabold text-secondary min-w-[110px] text-lg">{row.amount}</span>
                  <span className="text-sm text-foreground/80">{row.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} className="flex items-center gap-3 text-foreground/50 text-sm">
            <Shield className="w-5 h-5 text-accent flex-shrink-0" />
            <span>Transparencia total: rendimos cuenta de cada peso donado.</span>
          </motion.div>
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <AnimatePresence>{showLinktree && <DonationLinktree onClose={() => setShowLinktree(false)} />}</AnimatePresence>
    </div>
  );
};

export default Dona;
