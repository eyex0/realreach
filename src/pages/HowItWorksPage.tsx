import React from 'react';
import HowItWorks from '../components/HowItWorks';
import CapabilitiesBento from '../components/CapabilitiesBento';

interface HowItWorksPageProps {
  onOpenOrder: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenOrder }) => {
  return (
    <div className="flex-1">
      <HowItWorks onOpenOrder={onOpenOrder} />
      <CapabilitiesBento onOpenOrder={onOpenOrder} />
    </div>
  );
};

export default HowItWorksPage;
