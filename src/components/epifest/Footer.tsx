import { Instagram, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 px-4 md:px-8 border-t border-border/30">
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="text-2xl font-extrabold mb-1">
            epifest! <span className="text-gradient-gold">2026</span>
          </p>
          <p className="font-handwritten text-lg text-accent mb-3">El Congreso para la Comunidad</p>
          <p className="text-sm text-foreground/60">
            Una iniciativa de Espacio Epilepsia y LACE
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <a href="https://instagram.com/epifest" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <a href="mailto:contacto@espacioepilepsia.org" className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" /> contacto@espacioepilepsia.org
          </a>
          <a href="https://www.espacioepilepsia.org" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground">
            www.espacioepilepsia.org
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between gap-2 text-xs text-foreground/40">
        <p>Evento 100% gratuito | Con registro previo</p>
        <p>#epifest2026</p>
      </div>
    </div>
  </footer>
);

export default Footer;
