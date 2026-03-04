import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, RefreshCw, Mail, Shield } from 'lucide-react';

const donationOptions = [
  {
    icon: RefreshCw,
    title: 'Donación mensual',
    desc: 'Acompañanos todo el año con un aporte recurrente.',
    cta: 'Donar mensualmente',
    href: '#',
  },
  {
    icon: Heart,
    title: 'Donación única',
    desc: 'Cualquier monto suma y marca la diferencia.',
    cta: 'Hacer donación',
    href: '#',
  },
  {
    icon: Mail,
    title: 'Otras formas',
    desc: 'Contactanos para explorar otras maneras de colaborar.',
    cta: 'Escribinos',
    href: 'mailto:contacto@espacioepilepsia.org',
  },
];

const impactRows = [
  { amount: '$20.000', desc: 'Video testimonial sobre epilepsia' },
  { amount: '$40.000', desc: 'Materiales educativos de primeros auxilios' },
  { amount: '$80.000', desc: 'Charla en vivo para cientos de personas' },
];

const DonateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="dona" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
            Doná y sembrá conciencia 💜
          </h2>
          <p className="text-foreground/70 text-lg mb-10 max-w-2xl">
            Con tu aporte, ayudás a que más personas accedan a información de calidad sobre
            epilepsia, de forma gratuita.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {donationOptions.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <opt.icon className="w-8 h-8 text-secondary mb-4" />
              <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
              <p className="text-sm text-foreground/70 flex-1 mb-6">{opt.desc}</p>
              <a
                href={opt.href}
                target={opt.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="btn-gold text-sm text-center"
              >
                {opt.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Impact table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h3 className="font-bold text-lg mb-4">¿Qué logramos con tu aporte?</h3>
          <div className="space-y-3">
            {impactRows.map((row) => (
              <div key={row.amount} className="flex items-center gap-4 py-2 border-b border-border/30 last:border-0">
                <span className="font-extrabold text-secondary min-w-[100px]">{row.amount}</span>
                <span className="text-sm text-foreground/80">{row.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center gap-3 text-foreground/60 text-sm">
          <Shield className="w-5 h-5 text-accent" />
          <span>Transparencia total: rendimos cuenta de cada peso donado.</span>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;
