import SEO from '@/components/epifest/SEO';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import { Heart, RefreshCw, Mail, Shield, ArrowLeft, Sparkles } from 'lucide-react';

const donationOptions = [
  {
    icon: RefreshCw,
    title: 'Donación mensual',
    desc: 'Acompañanos todo el año con un aporte recurrente y ayudá a que la comunidad crezca.',
    cta: 'Donar mensualmente',
    href: '#',
    highlight: true,
  },
  {
    icon: Heart,
    title: 'Donación única',
    desc: 'Cualquier monto suma y marca la diferencia en la vida de personas con epilepsia.',
    cta: 'Hacer donación',
    href: '#',
    highlight: false,
  },
  {
    icon: Mail,
    title: 'Otras formas',
    desc: 'Contactanos para explorar otras maneras de colaborar con la fundación.',
    cta: 'Escribinos',
    href: 'mailto:contacto@espacioepilepsia.org',
    highlight: false,
  },
];

const impactRows = [
  { amount: '$20.000', desc: 'Video testimonial sobre epilepsia', emoji: '🎥' },
  { amount: '$40.000', desc: 'Materiales educativos de primeros auxilios', emoji: '📚' },
  { amount: '$80.000', desc: 'Charla en vivo para cientos de personas', emoji: '🎙️' },
];

const Dona = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Doná" description="Ayudanos a que más personas accedan a información de calidad sobre epilepsia. Tu donación a la Fundación Espacio Epilepsia hace la diferencia." canonical="/dona" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      {/* Hero */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">
              Fundación Espacio Epilepsia
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-4">
              Sembrá<br />
              <span className="text-gradient-gold">conciencia</span> 💜
            </h1>
            <p className="text-foreground/60 text-lg max-w-xl">
              Con tu aporte, ayudás a que más personas accedan a información de calidad
              sobre epilepsia, de forma totalmente gratuita.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section ref={ref} className="px-4 pb-28">
        <div className="container mx-auto max-w-5xl space-y-16">

          {/* Donation cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className={`relative glass-card rounded-2xl p-6 flex flex-col ${
                  opt.highlight ? 'border border-secondary/40' : ''
                }`}
              >
                {opt.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recomendado
                    </span>
                  </div>
                )}
                <opt.icon className={`w-8 h-8 mb-4 ${opt.highlight ? 'text-secondary' : 'text-accent'}`} />
                <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
                <p className="text-sm text-foreground/70 flex-1 mb-6">{opt.desc}</p>
                <a
                  href={opt.href}
                  target={opt.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`text-sm text-center rounded-full px-6 py-3 font-bold transition-all duration-300 hover:scale-105 ${
                    opt.highlight
                      ? 'btn-gold'
                      : 'glass-card hover:bg-white/10'
                  }`}
                >
                  {opt.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Impact table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
              ¿Qué logramos con tu aporte?
            </h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              {impactRows.map((row, i) => (
                <div
                  key={row.amount}
                  className={`flex items-center gap-4 px-6 py-5 ${
                    i !== impactRows.length - 1 ? 'border-b border-border/30' : ''
                  }`}
                >
                  <span className="text-2xl">{row.emoji}</span>
                  <span className="font-extrabold text-secondary min-w-[110px] text-lg">
                    {row.amount}
                  </span>
                  <span className="text-sm text-foreground/80">{row.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 text-foreground/50 text-sm"
          >
            <Shield className="w-5 h-5 text-accent flex-shrink-0" />
            <span>Transparencia total: rendimos cuenta de cada peso donado.</span>
          </motion.div>
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Dona;
