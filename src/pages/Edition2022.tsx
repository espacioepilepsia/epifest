import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:live\/|embed\/|watch\?v=))([^?&]+)/);
  return match ? match[1] : '';
};

const days = [
  {
    title: 'Día 1. Tratamientos y avances en epilepsia + Testimonios de personas con epilepsia',
    videos: [
      'https://www.youtube.com/live/8IIByFm_xbc',
      'https://youtu.be/cBeiI0bfwDQ',
    ],
  },
  {
    title: 'Día 2. Calidad de vida en epilepsia: Salud mental, nutrición',
    videos: [
      'https://www.youtube.com/live/2k9uHNx7DBQ',
      'https://youtu.be/W2_q8RE9LSY',
      'https://youtu.be/9IZ6W1_acSw',
    ],
  },
  {
    title: 'Día 3. Tecnologías vinculadas a la epilepsia + Dinámicas grupales',
    videos: [
      'https://www.youtube.com/live/rk_YwIWqjTc',
      'https://youtu.be/1JwBtPZZWws',
      'https://youtu.be/bIjT4iWzS7I',
    ],
  },
  {
    title: 'Día 4. Tratamientos alternativos en epilepsia (CBD, terapia cetogénica) + Premiaciones y cierre',
    videos: [
      'https://www.youtube.com/live/jKdZU0uN_GM',
      'https://youtu.be/TLb52Hn4hh0',
      'https://youtu.be/9RlWzptyUkM',
    ],
  },
];

const Edition2022 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back link */}
      <div className="container mx-auto max-w-4xl pt-8 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>

      {/* Header */}
      <header className="container mx-auto max-w-4xl px-4 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold mb-6"
        >
          epifest! <span className="text-secondary">2022</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          La primera edición del epifest! se realizó los días 17, 18, 19 y 26 de
          marzo de 2022. Fue organizada por Espacio Epilepsia y la Liga Argentina
          Contra la Epilepsia (LACE) y patrocinada por GSK.
        </motion.p>
      </header>

      {/* Accordion with videos */}
      <section className="container mx-auto max-w-4xl px-4 pb-16">
        <Accordion type="single" collapsible className="space-y-4">
          {days.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <AccordionItem
                value={`day-${i}`}
                className="glass-card rounded-2xl border-none px-6"
              >
                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                  {day.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-10 py-4">
                    {day.videos.map((url, j) => {
                      const videoId = extractYouTubeId(url);
                      return (
                        <div
                          key={j}
                          className="relative w-full rounded-xl overflow-hidden"
                          style={{ aspectRatio: '16/9' }}
                        >
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`${day.title} - Video ${j + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </section>

      {/* CTA to register */}
      <section className="container mx-auto max-w-4xl px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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

export default Edition2022;
