import React from 'react';
import LiveGpsDemo from '../components/LiveGpsDemo';

export const TrackingPage: React.FC = () => {
  return (
    <div className="flex-1">
      <LiveGpsDemo />
    </div>
  );
};

export default TrackingPage;
