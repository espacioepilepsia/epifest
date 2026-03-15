import { useState } from 'react';
import Header from '@/components/epifest/Header';
import ProgramSection from '@/components/epifest/ProgramSection';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';

const Programa = () => {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Programa"
        description="Conocé el programa completo del epifest! 2026. Dos días de charlas, talleres y bloques temáticos sobre epilepsia, salud mental, cannabis medicinal, derechos y más."
        canonical="/programa"
      />
      <Header onRegisterClick={() => setRegisterOpen(true)} />
      <div className="pt-16">
        <ProgramSection />
      </div>
      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Programa;
