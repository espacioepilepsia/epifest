import { Instagram, Facebook, Youtube, Linkedin, Mail, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import epifestLogo from '@/assets/epifest-logo.png';

const ICON_MAP: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
};

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
  </svg>
);

const Footer = () => {
  const { data: socialLinks = [] } = useQuery({
    queryKey: ['social_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="border-t border-border/30">
      {/* Barra superior — CTA inscripción + Doná */}
      <div
        className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ backgroundColor: 'rgba(37,21,83,0.97)' }}
      >
        <p className="text-sm text-white/70 font-medium">
          🎉 <span className="font-bold text-white">epifest! 2026</span> — 26 y 27 de marzo · Gratis para toda Latinoamérica
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/inscripciones-epifest"
            className="btn-gold text-sm px-5 py-2"
          >
            ¡Inscribite!
          </Link>
          <Link
            to="/dona"
            className="flex items-center gap-1.5 glass-card rounded-full px-5 py-2 text-sm font-bold text-foreground/90 hover:text-foreground transition-colors"
          >
            <Heart className="w-4 h-4 text-secondary" />
            Doná
          </Link>
        </div>
      </div>

      {/* Cuerpo del footer */}
      <div className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <a href="/">
                <img src={epifestLogo} alt="epifest! 5° Edición" className="h-16 w-auto mb-3" />
              </a>
              <p className="font-handwritten text-lg text-accent mb-3">El Congreso para la Comunidad</p>
              <p className="text-sm text-foreground/60">
                Una iniciativa de Espacio Epilepsia y LACE
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const IconComponent = link.platform === 'tiktok' ? TikTokIcon : ICON_MAP[link.platform];
                  if (!IconComponent || !link.url) return null;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
              <a href="mailto:contacto@espacioepilepsia.org" className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> contacto@espacioepilepsia.org
              </a>
              <a href="https://www.espacioepilepsia.org" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground">
                www.espacioepilepsia.org
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/20 space-y-2">
            <div className="flex flex-col md:flex-row justify-between gap-2 text-xs text-foreground/40">
              <p>Evento 100% gratuito | Con registro previo</p>
              <p>#epifest2026</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-2 text-xs text-foreground/30">
              <p>epifest! 2026 ™ — Todos los derechos reservados · Fundación Espacio Epilepsia</p>
              <a
                href="https://cerrolab.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent/60 hover:text-accent transition-colors font-medium"
              >
                ⚡ Desarrollado por Cerro Lab — Laboratorio de IA
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;