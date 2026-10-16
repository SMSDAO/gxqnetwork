import React, { useState } from 'react';
import { GXQ_LOGO_URL } from '../../constants/tokens';

interface GXQLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

export const GXQLogo: React.FC<GXQLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = true
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-56 h-56 sm:w-64 sm:h-64 rounded-3xl',
  }[size];

  const glowShadow = showGlow
    ? 'shadow-[0_0_24px_rgba(0,168,255,0.45),0_0_12px_rgba(255,122,0,0.35)]'
    : '';

  return (
    <div
      className={`relative overflow-hidden p-0.5 bg-gradient-to-br from-[#00A8FF] via-[#FF7A00] to-[#FF304F] ${sizeClasses} ${glowShadow} shrink-0 ${className}`}
    >
      {!hasError ? (
        <img
          src={GXQ_LOGO_URL}
          alt="GXQ Network Emblem"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-[inherit] transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-full bg-[#030507] rounded-[inherit] flex items-center justify-center p-1.5 relative">
          {/* Cyber-futuristic vector quantum lattice */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_#00A8FF]">
            <defs>
              <linearGradient id="gxqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00A8FF" />
                <stop offset="50%" stopColor="#FFD400" />
                <stop offset="100%" stopColor="#FF7A00" />
              </linearGradient>
              <linearGradient id="latticeGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF304F" />
                <stop offset="100%" stopColor="#00A8FF" />
              </linearGradient>
            </defs>
            {/* Outer Hexagon / Cube Matrix */}
            <polygon
              points="50,6 88,28 88,72 50,94 12,72 12,28"
              fill="none"
              stroke="url(#gxqGrad)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Inner Isometric Cube */}
            <polyline points="50,6 50,50 88,72" fill="none" stroke="#00A8FF" strokeWidth="2.5" opacity="0.8" />
            <polyline points="50,50 12,72" fill="none" stroke="#FF7A00" strokeWidth="2.5" opacity="0.8" />
            {/* Quantum Core Diamond & Q Mark */}
            <polygon points="50,32 68,50 50,68 32,50" fill="url(#latticeGrad)" opacity="0.75" />
            <circle cx="50" cy="50" r="7" fill="#F5F7FA" className="animate-pulse" />
            <line x1="50" y1="50" x2="72" y2="72" stroke="#FFD400" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
};
