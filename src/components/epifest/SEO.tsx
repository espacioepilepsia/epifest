import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SEO = ({
  title = 'epifest! 2026 — Congreso Latinoamericano de Epilepsia',
  description = '5ta edición del Congreso Latinoamericano de Epilepsia para pacientes, familias y cuidadores. 26 y 27 de marzo 2026. Inscripción gratuita.',
  canonical = '/',
}: SEOProps) => {
  const url = `https://epifest.lovable.app${canonical}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

export default SEO;
