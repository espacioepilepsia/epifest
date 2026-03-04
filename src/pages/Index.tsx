import { useState } from 'react';
import Header from '@/components/epifest/Header';
import HeroSection from '@/components/epifest/HeroSection';
import AboutSection from '@/components/epifest/AboutSection';
import ProgramSection from '@/components/epifest/ProgramSection';
import SpeakersSection from '@/components/epifest/SpeakersSection';
import MerchSection from '@/components/epifest/MerchSection';
import DonateSection from '@/components/epifest/DonateSection';
import SponsorsSection from '@/components/epifest/SponsorsSection';
import ContactSection from '@/components/epifest/ContactSection';
import PastEditionsSection from '@/components/epifest/PastEditionsSection';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';

const Index = () => {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={() => setRegisterOpen(true)} />
      <HeroSection onRegisterClick={() => setRegisterOpen(true)} />
      <AboutSection />
      <ProgramSection />
      <SpeakersSection />
      <MerchSection />
      <DonateSection />
      <SponsorsSection />
      <ContactSection />
      <PastEditionsSection />
      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Index;
