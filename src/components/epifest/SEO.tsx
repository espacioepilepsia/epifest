import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object;
}

const SITE_NAME    = 'epifest! 2026';
const SITE_URL     = 'https://epifest.com.ar';
const DEFAULT_DESC = 'Congreso Latinoamericano de Epilepsia para pacientes, familias y cuidadores. 5ta edición — 26 y 27 de marzo 2026.';
const DEFAULT_IMG  = `${SITE_URL}/og-image.png`;

const SEO = ({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage = DEFAULT_IMG,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — El Congreso para la Comunidad`;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────
    document.title = fullTitle;

    const setMeta = (attr: string, value: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // ── Basic meta ─────────────────────────────────────────────
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    // ── Canonical ──────────────────────────────────────────────
    setLink('canonical', url);

    // ── Open Graph ─────────────────────────────────────────────
    setMeta('property', 'og:type',        ogType);
    setMeta('property', 'og:title',       fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url',         url);
    setMeta('property', 'og:image',       ogImage);
    setMeta('property', 'og:site_name',   SITE_NAME);
    // Locale principal + variantes para todo el mundo hispanohablante
    setMeta('property', 'og:locale',            'es_AR');
    setMeta('property', 'og:locale:alternate',  'es_ES');
    setMeta('property', 'og:locale:alternate',  'es_MX');
    setMeta('property', 'og:locale:alternate',  'es_CL');
    setMeta('property', 'og:locale:alternate',  'es_CO');
    setMeta('property', 'og:locale:alternate',  'es_PE');
    setMeta('property', 'og:locale:alternate',  'es_UY');

    // ── Twitter Card ───────────────────────────────────────────
    setMeta('name', 'twitter:card',        'summary_large_image');
    setMeta('name', 'twitter:title',       fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image',       ogImage);

    // ── Idioma y cobertura geográfica ──────────────────────────
    // El evento es online → audiencia hispanohablante global
    setMeta('name', 'language',          'es');
    setMeta('http-equiv', 'content-language', 'es');
    setMeta('name', 'audience',          'all');
    setMeta('name', 'coverage',          'Worldwide');
    setMeta('name', 'target',            'all');
    // GEO de la organización (sede en CABA) — no limita la audiencia
    setMeta('name', 'geo.region',        'AR-C');
    setMeta('name', 'geo.placename',     'Buenos Aires, Argentina');
    setMeta('name', 'geo.position',      '-34.6037;-58.3816');
    setMeta('name', 'ICBM',              '-34.6037, -58.3816');

    // ── Keywords ───────────────────────────────────────────────
    setMeta('name', 'keywords',
      'epilepsia, congreso epilepsia, epifest, espacio epilepsia, ' +
      'epilepsia argentina, congreso latinoamericano epilepsia, ' +
      'pacientes epilepsia, familias epilepsia, purple day, ' +
      'crisis epilépticas, tratamiento epilepsia, 2026'
    );

    // ── JSON-LD estructurado ───────────────────────────────────
    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'epifest! 2026 — Congreso Latinoamericano de Epilepsia',
      description: DEFAULT_DESC,
      url: SITE_URL,
      startDate: '2026-03-26T10:00:00-03:00',
      endDate:   '2026-03-27T20:00:00-03:00',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'VirtualLocation',
        url: SITE_URL,
      },
      organizer: {
        '@type': 'Organization',
        name: 'Fundación Espacio Epilepsia',
        url: SITE_URL,
        email: 'espacioepilepsia.arg@gmail.com',
        sameAs: ['https://www.instagram.com/espacioepilepsia'],
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        url: SITE_URL,
        validFrom: '2025-01-01',
      },
      image: DEFAULT_IMG,
      inLanguage: 'es',
      isAccessibleForFree: true,
      keywords: 'epilepsia, congreso, latinoamerica, purple day, pacientes',
    };

    const ldData = jsonLd ?? defaultJsonLd;
    let ldScript = document.getElementById('json-ld-main') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id   = 'json-ld-main';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(ldData);

  }, [fullTitle, description, url, ogImage, ogType, noindex, jsonLd]);

  return null;
};

export default SEO;
