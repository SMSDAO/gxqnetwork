import React from 'react';
import { useGXQ, AppTab } from '../../context/GXQContext';
import {
  LayoutDashboard,
  Compass,
  ArrowLeftRight,
  Pickaxe,
  FileCode2,
  GitFork,
  Rocket,
  Wallet,
  BarChart3,
  Bot,
  Sliders,
  ShieldAlert,
  BookOpen,
  Network,
  FileText,
  Lock,
  Palette,
  Trophy,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: 'CORE (BLUE)' | 'DEFI & COMPUTE (ORANGE)' | 'TOP USERS & YIELD (YELLOW)' | 'ISOLATED ADMIN & SECURITY (RED)' | 'DOCUMENTATION & BRAND';
}

const NAV_ITEMS: NavItem[] = [
  // Core (Blue)
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, category: 'CORE (BLUE)' },
  { id: 'architecture', label: 'Network Architecture', icon: Network, badge: 'Topology', category: 'CORE (BLUE)' },
  { id: 'explorer', label: 'Quantum Explorer', icon: Compass, badge: 'Live', category: 'CORE (BLUE)' },
  { id: 'analytics', label: 'Enterprise Analytics', icon: BarChart3, category: 'CORE (BLUE)' },
  
  // DeFi & Compute (Orange)
  { id: 'swap', label: 'Quantum Swap & DEX', icon: ArrowLeftRight, category: 'DEFI & COMPUTE (ORANGE)' },
  { id: 'mining', label: 'Proof-of-Quantum Mining', icon: Pickaxe, badge: 'PoQW', category: 'DEFI & COMPUTE (ORANGE)' },
  { id: 'contracts', label: 'Smart Contracts VM', icon: FileCode2, category: 'DEFI & COMPUTE (ORANGE)' },
  { id: 'bridge', label: 'Cross-Chain Bridge', icon: GitFork, badge: 'Multi-Shard', category: 'DEFI & COMPUTE (ORANGE)' },
  { id: 'launchpad', label: 'Tokens Launchpad', icon: Rocket, category: 'DEFI & COMPUTE (ORANGE)' },
  
  // Top Users & Yield (Yellow)
  { id: 'top_users', label: 'Top Users & VIP Yield', icon: Trophy, badge: 'VIP Rewards', category: 'TOP USERS & YIELD (YELLOW)' },
  { id: 'wallet', label: 'Smart Quantum Wallet', icon: Wallet, badge: 'Google SSO', category: 'TOP USERS & YIELD (YELLOW)' },

  // Isolated Admin & Security (Red)
  { id: 'control_plane', label: 'Admin Control Plane', icon: Sliders, badge: 'gxqstudio', category: 'ISOLATED ADMIN & SECURITY (RED)' },
  { id: 'security', label: 'Security & Audit Center', icon: ShieldAlert, category: 'ISOLATED ADMIN & SECURITY (RED)' },
  { id: 'enterprise', label: 'Enterprise Edition', icon: Lock, badge: 'Institutional', category: 'ISOLATED ADMIN & SECURITY (RED)' },
  { id: 'ai', label: 'AI Intelligence Center', icon: Bot, badge: 'Gemini', category: 'ISOLATED ADMIN & SECURITY (RED)' },
  
  // Support
  { id: 'whitepaper', label: 'Official Whitepaper', icon: FileText, badge: 'PDF', category: 'DOCUMENTATION & BRAND' },
  { id: 'brand', label: 'Brand Identity & Logo', icon: Palette, category: 'DOCUMENTATION & BRAND' },
  { id: 'docs', label: 'User Guide & Docs', icon: BookOpen, category: 'DOCUMENTATION & BRAND' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, isSuperAdmin } = useGXQ();

  const categories = [
    'CORE (BLUE)',
    'DEFI & COMPUTE (ORANGE)',
    'TOP USERS & YIELD (YELLOW)',
    'ISOLATED ADMIN & SECURITY (RED)',
    'DOCUMENTATION & BRAND'
  ] as const;

  const categoryColorStyles = {
    'CORE (BLUE)': {
      header: 'text-[#00A8FF]',
      active: 'bg-[#00A8FF]/15 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_15px_rgba(0,168,255,0.25)]',
      iconActive: 'text-[#00A8FF]',
      badgeActive: 'bg-[#00A8FF] text-[#030507]'
    },
    'DEFI & COMPUTE (ORANGE)': {
      header: 'text-[#FF7A00]',
      active: 'bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/40 shadow-[0_0_15px_rgba(255,122,0,0.25)]',
      iconActive: 'text-[#FF7A00]',
      badgeActive: 'bg-[#FF7A00] text-[#030507]'
    },
    'TOP USERS & YIELD (YELLOW)': {
      header: 'text-[#FFD400]',
      active: 'bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/40 shadow-[0_0_15px_rgba(255,212,0,0.25)]',
      iconActive: 'text-[#FFD400]',
      badgeActive: 'bg-[#FFD400] text-[#030507]'
    },
    'ISOLATED ADMIN & SECURITY (RED)': {
      header: 'text-[#FF304F]',
      active: 'bg-[#FF304F]/15 text-[#FF304F] border border-[#FF304F]/40 shadow-[0_0_15px_rgba(255,48,79,0.25)]',
      iconActive: 'text-[#FF304F]',
      badgeActive: 'bg-[#FF304F] text-white'
    },
    'DOCUMENTATION & BRAND': {
      header: 'text-[#9AA6B2]',
      active: 'bg-white/10 text-[#F5F7FA] border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.15)]',
      iconActive: 'text-[#F5F7FA]',
      badgeActive: 'bg-white/20 text-[#F5F7FA]'
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#030507]/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 lg:top-[98px] bottom-0 left-0 z-40 w-64 glass-lvl-2 border-r border-white/10 transition-transform duration-300 lg:translate-x-0 overflow-y-auto no-scrollbar flex flex-col justify-between ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {categories.map((cat) => {
            const items = NAV_ITEMS.filter((item) => item.category === cat);
            const style = categoryColorStyles[cat];

            return (
              <div key={cat} className="space-y-1">
                <div className={`px-3 text-[10px] font-tech font-bold uppercase tracking-widest ${style.header}`}>
                  {cat}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-tech text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                        isActive
                          ? style.active
                          : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? style.iconActive : 'text-[#66717D] group-hover:text-[#F5F7FA]'
                          }`}
                        />
                        <span className="tracking-wide text-left">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                            isActive
                              ? style.badgeActive
                              : item.id === 'control_plane'
                              ? 'bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/40'
                              : 'bg-white/10 text-[#9AA6B2] group-hover:text-[#F5F7FA]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-white/5 text-[11px] font-tech text-[#66717D] space-y-1.5">
          <div className="flex items-center justify-between">
            <span>NETWORK:</span>
            <span className="text-[#00A8FF] font-bold">MAINNET ALPHA</span>
          </div>
          <div className="flex items-center justify-between">
            <span>ADMIN STATE:</span>
            <span className={isSuperAdmin ? 'text-[#FF304F] font-bold' : 'text-[#9AA6B2]'}>
              {isSuperAdmin ? 'SUPER-ADMIN (gxqstudio)' : 'USER / GUEST'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>PQC CIPHER:</span>
            <span className="text-[#F5F7FA]">DILITHIUM-5</span>
          </div>
          <div className="pt-2 text-[10px] text-center text-[#66717D]">
            GXQ Network &copy; {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
};
