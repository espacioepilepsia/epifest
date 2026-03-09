import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const videos = [
  { id: 'J7sGFbOMmks', caption: '¿Qué son las crisis epilépticas y cómo las podemos describir? – Dr. Nahuel Pereyra' },
  { id: 'CG_D9i35Mc0', caption: 'ABC del Cannabis Medicinal – Dr. Marcos Semprino' },
  { id: '0qXfreVDFZY', caption: 'Dieta Cetogénica 🥑 Tratamientos dietarios para la epilepsia – Dra. Lorena Fasulo' },
  { id: '-GP1KB-V-GA', caption: 'Epilepsia en la adolescencia – Dra. María del Carmen García' },
  { id: 'GRjueOKvn_I', caption: 'Epilepsia y depresión – Dra. Mercedes Sarudiansky' },
  { id: '3DzDxwPLVek', caption: 'Epilepsia y aceptación – Lic. Agostina Gerbaudo' },
  { id: 'sKNLCtIkgmE', caption: 'Epilepsia y aceptación 💕 junto a Valentina Otero' },
  { id: 'fQZO3KEK79w', caption: '🥑 «Dieta cetogénica y tratamiento cannabico» junto a la Familia Vejares Carmona' },
  { id: 'da-mGIx9k-w', caption: 'Neuro-arquitectura y epilepsia junto a la Arquitecta Victoria Silva' },
  { id: 'C5rfGqsCmS4', caption: 'Desmitificando la epilepsia: Reflexiones desde mi experiencia en educación junto a Paula Valeri' },
  { id: 'RFmUF10dvsc', caption: 'Aspectos neuropsicológicos en el ámbito escolar junto a la Lic. María Del Carmen Roncon' },
  { id: 'aeFQcAUtd-Y', caption: 'Violencia de género y discriminación por enfermedad junto a la Dra. Silvia Soria D\'Errico' },
  { id: 'jK4bk2UdhQY', caption: '«¿Y si Da Vinci tuviera epilepsia?» junto a la Licenciada Ornella Padini' },
  { id: '_gIJ5jvXuzM', caption: '«Arte terapia y epilepsia» junto al Dr. Eugenio Mazzucco' },
];

const Edition2024 = () => {
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
          epifest! <span className="text-secondary">2024</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          La tercera edición del epifest! se realizó el día 16 de marzo de 2024.
          Fue organizada por Espacio Epilepsia y la Liga Argentina Contra la
          Epilepsia (LACE) y patrocinada por Nutricia y Laboratorios Alef.
        </motion.p>
      </header>

      <section className="container mx-auto max-w-4xl px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-bold mb-8"
        >
          Charlas
        </motion.h2>
        <div className="grid gap-10">
          {videos.map((video, j) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + j * 0.05 }}
            >
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.caption}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{video.caption}</p>
            </motion.div>
          ))}
        </div>
      </section>

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

export default Edition2024;
