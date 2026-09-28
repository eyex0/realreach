import React from 'react';

interface RealReachLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * High-definition transparent vector of user's origami paper-plane with 4-point sparkle star
 * Exactly matching user attachment Image 1.
 */
export const RealReachLogo: React.FC<RealReachLogoProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 inline-block transition-transform hover:scale-105 ${className}`}
      aria-label="REALREACH Logo"
    >
      <g fill={color}>
        {/* Top Aerodynamic Wing Spine & Body */}
        <path 
          d="M381.5 110.2L91.8 280.4C74.6 288.5 73.2 310.8 92.4 316.2L212.5 330.1L381.5 110.2Z" 
        />
        {/* Main Fold & Bottom Fin with V-notch */}
        <path 
          d="M381.5 110.2L212.5 330.1L217.2 411.8C218.4 426.5 237.2 432.8 246.8 421.2L297.4 360.5L356.2 393.1C371.8 401.7 391.2 393.2 393.5 375.4L419.8 141.2C422.1 123.6 401.2 110.5 381.5 110.2Z" 
        />
        {/* 4-point Sparkle Star in Bottom-Left */}
        <path 
          d="M118 412C118 392 134 376 154 376C134 376 118 360 118 340C118 360 102 376 82 376C102 376 118 392 118 412Z" 
        />
      </g>
    </svg>
  );
};

export default RealReachLogo;
