import React from 'react';

interface RealReachLogoProps {
  className?: string;
  size?: number;
  /** Accepted for backwards compatibility; the master artwork is used as-is. */
  color?: string;
  /** Accepted for backwards compatibility; the master artwork is used as-is. */
  starColor?: string;
}

/**
 * Realreach master brand symbol (exact artwork from the brand pack).
 * Renders public/logo.png at the requested size — identical everywhere.
 */
export const RealReachLogo: React.FC<RealReachLogoProps> = ({
  className = '',
  size = 28,
}) => {
  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      alt="Realreach Logo"
      className={`shrink-0 inline-block object-contain transition-transform hover:scale-105 ${className}`}
    />
  );
};

export default RealReachLogo;
