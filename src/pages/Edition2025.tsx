import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const blocks = [
  {
    title: 'Bloque 1. Epilepsia y Manejo de Crisis',
    videoId: 'nESwffCP0KM',
    start: 0,
  },
  {
    title: 'Bloque 2. Deporte y Epilepsia',
    videoId: 'nESwffCP0KM',
    start: 10456,
  },
  {
    title: 'Bloque 3. Cannabis Medicinal y Terapia Cetogénica',
    videoId: 'nESwffCP0KM',
    start: 16683,
  },
  {
    title: 'Bloque 4. Transición de Pediatría al Adulto',
    videoId: '1XbbjoNENO0',
    start: 0,
  },
  {
    title: 'Bloque 5. «Viviendo con Epilepsia: Experiencias Reales, Desafíos y Herramientas para el Día a Día»',
    videoId: '1XbbjoNENO0',
    start: 4870,
  },
];

const Edition2025 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl pt-8 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>

      <header className="container mx-auto max-w-4xl px-4 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold mb-6"
        >
          epifest! <span className="text-secondary">2025</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          La cuarta edición del epifest! se realizó el sábado 15 de marzo de 2025, de 09:00 a 19:00 hs. (ARG).
          Diseñamos ejes temáticos centrados en las necesidades de las personas con epilepsia, para poder abordar
          en cada bloque los distintos desafíos de vivir con epilepsia.
        </motion.p>
      </header>

      <section className="container mx-auto max-w-4xl px-4 pb-16">
        <Accordion type="single" collapsible className="space-y-4">
          {blocks.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <AccordionItem
                value={`block-${i}`}
                className="glass-card rounded-2xl border-none px-6"
              >
                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                  {block.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-4">
                    <div
                      className="relative w-full rounded-xl overflow-hidden"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${block.videoId}${block.start ? `?start=${block.start}` : ''}`}
                        title={block.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/"
            className="inline-block text-2xl md:text-4xl font-extrabold text-secondary hover:opacity-80 transition-opacity"
          >
            ¡Regístrate en el Epifest 2026!
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Edition2025;
