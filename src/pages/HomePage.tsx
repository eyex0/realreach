import React from 'react';
import Hero from '../components/Hero';
import PickupSection from '../components/PickupSection';
import HowItWorks from '../components/HowItWorks';
import VolumeEstimationCard from '../components/VolumeEstimationCard';
import NowPrintingSection from '../components/NowPrintingSection';
import CapabilitiesBento from '../components/CapabilitiesBento';
import AgencyCaseStudies from '../components/AgencyCaseStudies';
import FaqSection from '../components/FaqSection';
import CampaignCalculator from '../components/CampaignCalculator';
import LiveGpsDemo from '../components/LiveGpsDemo';
import RunnerSection from '../components/RunnerSection';
import { CampaignData } from '../components/OrderModal';

interface HomePageProps {
  onOpenOrder: () => void;
  onOpenOrderWithData: (data: CampaignData) => void;
  onOpenOrderWithVolume: (volume?: string) => void;
  onOpenPortal: () => void;
  onOpenRunnerModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenOrder,
  onOpenOrderWithData,
  onOpenOrderWithVolume,
  onOpenPortal,
  onOpenRunnerModal,
}) => {
  return (
    <div className="flex-1">
      {/* 1. PDF Pages 1 & 2: Hero Section & Milan Motion Map graphic */}
      <Hero onOpenOrder={onOpenOrder} />

      {/* 2. PDF Page 3: Your flyers picked up & distributed */}
      <PickupSection onOpenOrder={onOpenOrder} />

      {/* 3. PDF Pages 4 & 5: How to start distributing */}
      <HowItWorks onOpenOrder={onOpenOrder} />

      {/* 4. PDF Page 6: Monthly flyer estimation questionnaire */}
      <VolumeEstimationCard onOpenOrder={onOpenOrderWithVolume} />

      {/* 5. PDF Page 7: Now Printing */}
      <NowPrintingSection onOpenOrder={onOpenOrder} />

      {/* 6. FREE FEATURES & BENTO CAPABILITIES (Featuring User's Logo) */}
      <CapabilitiesBento onOpenOrder={onOpenOrder} onOpenPortal={onOpenPortal} />

      {/* 7. Interactive Live GPS Telemetry Demo (Milan live walkers) */}
      <LiveGpsDemo />

      {/* 8. Instant Suburb & Zone Pricing Calculator (Milan zones in € EUR) */}
      <CampaignCalculator onOpenOrder={onOpenOrderWithData} />

      {/* 9. For Distributors: Earn Money, Stay Active in Milan */}
      <RunnerSection onOpenRunnerModal={onOpenRunnerModal} />

      {/* 10. PDF Pages 7 & 8: Loved by teams across Italy (Blue section) */}
      <AgencyCaseStudies />

      {/* 11. PDF Pages 9 & 10: App badges & Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
};

export default HomePage;
