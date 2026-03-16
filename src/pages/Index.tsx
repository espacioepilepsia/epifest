import { useState } from 'react';
import Header from '@/components/epifest/Header';
import HeroSection from '@/components/epifest/HeroSection';
import AboutSection from '@/components/epifest/AboutSection';
import PicnicSection from '@/components/epifest/PicnicSection';
import OrganizerSection from '@/components/epifest/OrganizerSection';
import SponsorsSection from '@/components/epifest/SponsorsSection';
import ContactSection from '@/components/epifest/ContactSection';
import PastEditionsSection from '@/components/epifest/PastEditionsSection';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import SEO from '@/components/epifest/SEO';

const Index = () => {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO canonical="/" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />
      <HeroSection onRegisterClick={() => setRegisterOpen(true)} />
      <AboutSection />
      <PicnicSection />
      <OrganizerSection />
      <SponsorsSection />
      <ContactSection />
      <PastEditionsSection />
      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Index;
