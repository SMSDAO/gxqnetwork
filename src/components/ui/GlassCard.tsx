import React from 'react';
import { GlassLevel } from '../../types/blockchain';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: GlassLevel;
  glow?: 'blue' | 'orange' | 'red' | 'yellow' | 'none';
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  level = 2,
  glow = 'none',
  interactive = false,
  className = '',
  children,
  ...rest
}) => {
  const levelClass = {
    1: 'glass-lvl-1',
    2: 'glass-lvl-2',
    3: 'glass-lvl-3',
    4: 'glass-lvl-4',
  }[level];

  const glowClass = {
    none: '',
    blue: 'border-[#00A8FF]/30 hover:border-[#00A8FF]/70 shadow-[0_0_20px_rgba(0,168,255,0.15)]',
    orange: 'border-[#FF7A00]/30 hover:border-[#FF7A00]/70 shadow-[0_0_20px_rgba(255,122,0,0.15)]',
    red: 'border-[#FF304F]/40 hover:border-[#FF304F]/80 shadow-[0_0_20px_rgba(255,48,79,0.2)]',
    yellow: 'border-[#FFD400]/30 hover:border-[#FFD400]/60 shadow-[0_0_20px_rgba(255,212,0,0.15)]',
  }[glow];

  const interactiveClass = interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-[0.995]'
    : '';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-6 transition-all duration-200 relative overflow-hidden ${levelClass} ${glowClass} ${interactiveClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
