import React from 'react';
import { NetworkStatus } from '../../types/blockchain';

interface StatusBadgeProps {
  status: NetworkStatus | 'NOMINAL' | 'HIGH_THROUGHPUT' | 'ACTIVE' | 'AUDITED' | 'VERIFIED' | 'SUCCESS' | 'WARN' | 'CRITICAL' | 'MAINTENANCE' | 'JAILED' | 'ONLINE' | 'SECURED';
  label?: string;
  className?: string;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
  pulse = true,
}) => {
  const displayLabel = label || status;

  let colorClasses = 'bg-[#00A8FF]/10 text-[#00A8FF] border-[#00A8FF]/30';
  let dotColor = 'bg-[#00A8FF]';

  switch (status) {
    case 'LIVE':
    case 'NOMINAL':
    case 'ACTIVE':
    case 'AUDITED':
    case 'VERIFIED':
    case 'SUCCESS':
    case 'ONLINE':
    case 'SECURED':
      colorClasses = 'bg-[#00A8FF]/10 text-[#00A8FF] border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]';
      dotColor = 'bg-[#00A8FF]';
      break;
    case 'HIGH_THROUGHPUT':
    case 'WARN':
    case 'DELAYED':
      colorClasses = 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/40 shadow-[0_0_12px_rgba(255,122,0,0.2)]';
      dotColor = 'bg-[#FF7A00]';
      break;
    case 'SYNCING':
      colorClasses = 'bg-[#FFD400]/10 text-[#FFD400] border-[#FFD400]/40 shadow-[0_0_12px_rgba(255,212,0,0.2)]';
      dotColor = 'bg-[#FFD400]';
      break;
    case 'OFFLINE':
    case 'CRITICAL':
      colorClasses = 'bg-[#FF304F]/10 text-[#FF304F] border-[#FF304F]/40 shadow-[0_0_12px_rgba(255,48,79,0.2)]';
      dotColor = 'bg-[#FF304F]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border font-tech ${colorClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`}
      />
      {displayLabel}
    </span>
  );
};
