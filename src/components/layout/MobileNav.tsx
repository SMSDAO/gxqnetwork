import React from 'react';
import { useGXQ, AppTab } from '../../context/GXQContext';
import { LayoutDashboard, ArrowLeftRight, Trophy, Sliders, Wallet } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, isSuperAdmin } = useGXQ();

  const navItems: {
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'orange' | 'yellow' | 'red';
  }[] = [
    { id: 'dashboard', label: 'Command', icon: LayoutDashboard, color: 'blue' },
    { id: 'swap', label: 'DEX Swap', icon: ArrowLeftRight, color: 'orange' },
    { id: 'top_users', label: 'Top Users', icon: Trophy, color: 'yellow' },
    { id: 'control_plane', label: isSuperAdmin ? 'Admin' : 'Control', icon: Sliders, color: 'red' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'blue' },
  ];

  const colorStyles = {
    blue: {
      textActive: 'text-[#00A8FF]',
      bgActive: 'bg-[#00A8FF]/20 shadow-[0_0_12px_rgba(0,168,255,0.4)]',
    },
    orange: {
      textActive: 'text-[#FF7A00]',
      bgActive: 'bg-[#FF7A00]/20 shadow-[0_0_12px_rgba(255,122,0,0.4)]',
    },
    yellow: {
      textActive: 'text-[#FFD400]',
      bgActive: 'bg-[#FFD400]/20 shadow-[0_0_12px_rgba(255,212,0,0.4)]',
    },
    red: {
      textActive: 'text-[#FF304F]',
      bgActive: 'bg-[#FF304F]/20 shadow-[0_0_12px_rgba(255,48,79,0.4)]',
    },
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-lvl-4 border-t border-white/10 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const style = colorStyles[item.color];

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`min-w-[48px] min-h-[48px] px-2 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? `${style.textActive} font-bold`
                : 'text-[#9AA6B2] hover:text-[#F5F7FA]'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-transform ${
                isActive ? `${style.bgActive} scale-110` : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-tech uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
