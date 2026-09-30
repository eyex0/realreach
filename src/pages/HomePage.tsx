import React from 'react';
import Hero from '../components/Hero';
import RunnerSection from '../components/RunnerSection';
import AgencyCaseStudies from '../components/AgencyCaseStudies';
import PlanSection from '../components/landing/PlanSection';
import VerifyChain from '../components/landing/VerifyChain';
import MeasureSection from '../components/landing/MeasureSection';
import PlatformSection from '../components/landing/PlatformSection';
import InfraSection from '../components/landing/InfraSection';
import WishlistSection from '../components/landing/WishlistSection';

interface HomePageProps {
  onOpenOrder: () => void;
  onOpenRunnerModal: () => void;
}

/**
 * Landing narrative (platform blueprint §8):
 * HERO → PLAN → MOVE → VERIFY → MEASURE → PLATFORM → INFRASTRUCTURE → proof.
 */
export const HomePage: React.FC<HomePageProps> = ({
  onOpenOrder,
  onOpenRunnerModal,
}) => {
  return (
    <div className="flex-1">
      {/* HERO: Real-world marketing, measured */}
      <Hero onOpenOrder={onOpenOrder} />

      {/* 01 — PLAN: campaign + geography */}
      <PlanSection />

      {/* 02 — MOVE: paper plane + field network */}
      <RunnerSection onOpenRunnerModal={onOpenRunnerModal} />

      {/* 03 — VERIFY: GPS + proof + events */}
      <VerifyChain />

      {/* 04 — MEASURE: coverage + reach + response */}
      <MeasureSection />

      {/* 05 — THE PLATFORM: Command Center */}
      <PlatformSection />

      {/* 06 — THE INFRASTRUCTURE: architecture flow */}
      <InfraSection />

      {/* Wishlist: let people register interest before there is a product to sell */}
      <WishlistSection source="landing" />

      {/* Social proof */}
      <AgencyCaseStudies />
    </div>
  );
};

export default HomePage;
