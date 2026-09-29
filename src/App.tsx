import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OnboardingPage from './pages/OnboardingPage';
import ForDistributorsPage from './pages/ForDistributorsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import PlannerPage from './pages/PlannerPage';
import MissionsPage from './pages/MissionsPage';
import TrackingPage from './pages/TrackingPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import CommunityClientsPage from './pages/legal/CommunityClientsPage';
import CommunityDistributorsPage from './pages/legal/CommunityDistributorsPage';
import LegalRedirect from './pages/legal/LegalRedirect';
import SignUpPage from './pages/SignUpPage';
import PrintStorePage from './pages/PrintStorePage';
import CampaignBuilderPage from './pages/CampaignBuilderPage';
import DistributionPortalPage from './pages/DistributionPortalPage';
import OpsConsolePage from './pages/OpsConsolePage';
import ReportsPage from './pages/ReportsPage';
import OrderModal, { CampaignData } from './components/OrderModal';
import RunnerApplyModal from './components/RunnerApplyModal';
import ContactModal from './components/ContactModal';

function RequireAuth({ children }: { children: React.ReactElement }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isRunnerModalOpen, setIsRunnerModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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

  // Dedicated app layouts have their own full-screen layout (no marketing navbar/footer)
  const isDedicatedAppPage =
    ['/signup', '/signin'].some((p) => location.pathname.startsWith(p)) ||
    [
      '/dashboard',
      '/print',
      '/planner',
      '/missions',
      '/campaigns/new',
      '/distribution-portal',
      '/ops',
      '/reports',
    ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-[#0a0a0b] flex flex-col selection:bg-[#0a0a0b] selection:text-white">
      
      {/* Sticky Realreach Navbar (hidden on dedicated full-screen auth / builder pages) */}
      {!isDedicatedAppPage && <Navbar />}

      {/* Multi-Page Routes */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenOrder={() => setIsOrderOpen(true)}
                onOpenRunnerModal={() => setIsRunnerModalOpen(true)}
              />
            }
          />
          <Route path="/for-distributors" element={<ForDistributorsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage onOpenOrder={() => setIsOrderOpen(true)} />} />
          <Route path="/features" element={<FeaturesPage onOpenOrder={() => setIsOrderOpen(true)} />} />
          <Route
            path="/pricing"
            element={
              <PricingPage
                onOpenOrderWithData={handleOpenOrderWithData}
                onOpenOrderWithVolume={handleOpenOrderWithVolume}
              />
            }
          />
          <Route path="/gps-tracking" element={<TrackingPage />} />
          <Route path="/planner" element={<RequireAuth><PlannerPage /></RequireAuth>} />
          <Route path="/missions" element={<RequireAuth><MissionsPage /></RequireAuth>} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/community-clients" element={<CommunityClientsPage />} />
          <Route path="/legal/community-distributors" element={<CommunityDistributorsPage />} />
          <Route path="/legal/:type" element={<LegalRedirect />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/opportunities" element={<RequireAuth><OpportunitiesPage /></RequireAuth>} />
        <Route path="/start" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
          <Route path="/print" element={<RequireAuth><PrintStorePage /></RequireAuth>} />
          <Route path="/campaigns/new" element={<RequireAuth><CampaignBuilderPage /></RequireAuth>} />
          <Route path="/distribution-portal" element={<RequireAuth><DistributionPortalPage /></RequireAuth>} />
            <Route path="/ops" element={<RequireAuth><OpsConsolePage /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
          <Route
            path="*"
            element={
              <HomePage
                onOpenOrder={() => setIsOrderOpen(true)}
                onOpenRunnerModal={() => setIsRunnerModalOpen(true)}
              />
            }
          />
        </Routes>
      </main>

      {/* PDF Page 11: Realreach Footer (hidden on dedicated app pages) */}
      {!isDedicatedAppPage && <Footer />}

      {/* Global Modals */}
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
