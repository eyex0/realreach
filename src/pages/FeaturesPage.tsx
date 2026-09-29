import React from 'react';
import CapabilitiesBento from '../components/CapabilitiesBento';

interface FeaturesPageProps {
  onOpenOrder: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenOrder }) => {
  return (
    <div className="flex-1">
      <CapabilitiesBento onOpenOrder={onOpenOrder} />
    </div>
  );
};

export default FeaturesPage;
