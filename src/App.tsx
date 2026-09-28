import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ForDistributorsPage from './pages/ForDistributorsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import SignUpPage from './pages/SignUpPage';
import PrintStorePage from './pages/PrintStorePage';
import CampaignBuilderPage from './pages/CampaignBuilderPage';
import DistributionPortalPage from './pages/DistributionPortalPage';
import OrderModal, { CampaignData } from './components/OrderModal';
import ClientPortalModal from './components/ClientPortalModal';
import RunnerApplyModal from './components/RunnerApplyModal';
import ContactModal from './components/ContactModal';
import SignUpModal from './components/SignUpModal';

function AppContent() {
  const location = useLocation();
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isRunnerModalOpen, setIsRunnerModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Default Milan campaign data for order modal
  const [campaignData, setCampaignData] = useState<CampaignData>({
    city: 'Milano Centro & Nord',
    suburb: 'Duomo & Brera',
    quantity: 10000,
    serviceType: 'print_and_deliver',
    format: 'DL Flyer (99 x 210mm)',
    paperStock: '250 GSM Premium Silk',
    isSoloDrop: false,
    totalPrice: 1500,
    pricePerUnit: 0.15,
  });

  const handleOpenOrderWithData = (data: CampaignData) => {
    setCampaignData(data);
    setIsOrderOpen(true);
  };

  const handleOpenOrderWithVolume = (volumeStr?: string) => {
    if (volumeStr) {
      const num = parseInt(volumeStr.replace(/[^0-9]/g, ''), 10) || 5000;
      setCampaignData((prev) => ({
        ...prev,
        quantity: num,
        totalPrice: Math.round(num * prev.pricePerUnit),
      }));
    }
    setIsOrderOpen(true);
  };

  // Dedicated app layouts: /signup, /print, /campaigns/new, /distribution-portal have their own full-screen layout
  const isDedicatedAppPage = [
    '/signup', 
    '/signin', 
    '/print', 
    '/campaigns/new', 
    '/distribution-portal'
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-[#0a0a0b] flex flex-col selection:bg-[#0a0a0b] selection:text-white">
      
      {/* Sticky REALREACH Navbar (hidden on dedicated full-screen auth / builder pages) */}
      {!isDedicatedAppPage && (
        <Navbar
          onOpenPortal={() => setIsPortalOpen(true)}
          onOpenOrder={() => setIsOrderOpen(true)}
          onOpenSignUp={() => setIsSignUpModalOpen(true)}
        />
      )}

      {/* Multi-Page Routes */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenOrder={() => setIsOrderOpen(true)}
                onOpenOrderWithData={handleOpenOrderWithData}
                onOpenOrderWithVolume={handleOpenOrderWithVolume}
                onOpenPortal={() => setIsPortalOpen(true)}
                onOpenRunnerModal={() => setIsRunnerModalOpen(true)}
              />
            }
          />
          <Route path="/for-distributors" element={<ForDistributorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignUpPage />} />
          <Route path="/print" element={<PrintStorePage />} />
          <Route path="/campaigns/new" element={<CampaignBuilderPage />} />
          <Route path="/distribution-portal" element={<DistributionPortalPage />} />
          <Route
            path="*"
            element={
              <HomePage
                onOpenOrder={() => setIsOrderOpen(true)}
                onOpenOrderWithData={handleOpenOrderWithData}
                onOpenOrderWithVolume={handleOpenOrderWithVolume}
                onOpenPortal={() => setIsPortalOpen(true)}
                onOpenRunnerModal={() => setIsRunnerModalOpen(true)}
              />
            }
          />
        </Routes>
      </main>

      {/* PDF Page 11: REALREACH Footer (hidden on dedicated app pages) */}
      {!isDedicatedAppPage && <Footer />}

      {/* Global Modals */}
      <ClientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onOpenOrder={() => {
          setIsPortalOpen(false);
          setIsOrderOpen(true);
        }}
      />

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        campaignData={campaignData}
      />

      <RunnerApplyModal
        isOpen={isRunnerModalOpen}
        onClose={() => setIsRunnerModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
