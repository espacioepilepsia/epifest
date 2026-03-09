import Header from '@/components/epifest/Header';
import ProgramSection from '@/components/epifest/ProgramSection';
import Footer from '@/components/epifest/Footer';
import { useState } from 'react';
import RegistrationModal from '@/components/epifest/RegistrationModal';

const Programa = () => {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={() => setRegisterOpen(true)} />
      <div className="pt-20">
        <ProgramSection />
      </div>
      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Programa;
