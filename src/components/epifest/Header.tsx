import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import epifestLogo from '@/assets/epifest-logo.png';

const navLinks = [
  { label: 'Inicio',    href: '/',         section: 'inicio' },
  { label: 'Programa',  href: '/programa',  section: null },
  { label: 'Oradores',  href: '/',         section: 'oradores' },
  { label: 'Tienda',    href: '/',         section: 'tienda' },
  { label: 'Doná',      href: '/',         section: 'dona' },
  { label: 'Contacto',  href: '/',         section: 'contacto' },
];

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header = ({ onRegisterClick }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cuando llegamos al home con un hash pendiente, hacemos scroll
  useEffect(() => {
    const hash = sessionStorage.getItem('scrollTo');
    if (hash && location.pathname === '/') {
      sessionStorage.removeItem('scrollTo');
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[0]
  ) => {
    e.preventDefault();
    setMenuOpen(false);

    // Ruta pura sin sección (ej: /programa)
    if (link.section === null) {
      navigate(link.href);
      return;
    }

    if (location.pathname === '/') {
      // Ya estamos en el home → scroll directo
      const el = document.getElementById(link.section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Estamos en otra página → guardamos destino y volvemos al home
      sessionStorage.setItem('scrollTo', link.section);
      navigate('/');
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-lg'
          : 'bg-primary/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">

        {/* Logo → siempre lleva al home */}
        <a href="/" onClick={handleLogoClick} className="cursor-pointer">
          <img
            src={epifestLogo}
            alt="epifest! 5° Edición"
            className="h-20 md:h-24 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button onClick={onRegisterClick} className="btn-gold text-sm">
            ¡Inscribite!
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-primary-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary/98 backdrop-blur-md border-t border-border px-4 pb-6">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium py-2 text-primary-foreground/90 hover:text-primary-foreground cursor-pointer"
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { onRegisterClick(); setMenuOpen(false); }}
              className="btn-gold text-sm mt-2"
            >
              ¡Inscribite!
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
