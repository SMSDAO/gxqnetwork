import React, { useState } from 'react';
import { useGXQ, AppTab } from '../../context/GXQContext';
import { GXQ_LOGO_URL } from '../../constants/tokens';
import { GXQLogo } from '../ui/GXQLogo';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ShieldCheck,
  Wallet,
  Menu,
  X,
  Bell,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Zap,
  TrendingUp,
  AlertTriangle,
  Bot,
  Layers,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    wallet,
    connectWallet,
    disconnectWallet,
    googleUser,
    loginWithGoogle,
    logoutGoogle,
    isSuperAdmin,
    market,
    auditEvents,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useGXQ();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const gxqTicker = market.tickers.GXQ;
  const ethTicker = market.tickers.ETH;

  // Four-color quick category groups
  const quickCategories: { label: string; tab: AppTab; color: 'blue' | 'orange' | 'yellow' | 'red'; iconText: string }[] = [
    { label: 'Core', tab: 'dashboard', color: 'blue', iconText: '🔷' },
    { label: 'DeFi & Swap', tab: 'swap', color: 'orange', iconText: '🔶' },
    { label: 'Top Users', tab: 'top_users', color: 'yellow', iconText: '🟡' },
    { label: 'Admin Isolated', tab: 'control_plane', color: 'red', iconText: '🔴' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-lvl-3 border-b border-white/10 backdrop-blur-2xl">
        {/* Top 4-Color Telemetry Strip */}
        <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-[#030507]/80 border-b border-white/5 text-xs font-tech">
          <div className="flex items-center gap-4 xl:gap-6 overflow-x-auto no-scrollbar">
            {/* 1. Electric Blue: Quantum Parity & L1 Finality */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-[#00A8FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8FF] animate-pulse" />
              <span className="font-bold">GXQ PARITY:</span>
              <span className="text-[#F5F7FA] font-mono">
                ${gxqTicker?.price ? gxqTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '3,465.80'}
              </span>
              <span className="text-[10px] text-[#00A8FF] font-mono font-bold">ETH 1:1</span>
            </div>

            {/* 2. Radiant Orange: PoQW Hashrate & AMM Throughput */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
              <span className="font-bold">PoQW CONSENSUS:</span>
              <span className="text-[#F5F7FA] font-mono">14,280 TPS</span>
              <span className="text-[10px] text-[#FF7A00] font-mono font-bold">SHARDS: 4</span>
            </div>

            {/* 3. Amber Yellow: Gemini AI Core */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
              <span className="font-bold">AI INTEL:</span>
              <span className="text-[#F5F7FA] font-mono">GEMINI 3.8 FLASH</span>
              <span className="text-[10px] text-[#FFD400] font-mono font-bold">ONLINE</span>
            </div>

            {/* 4. Neon Red: PQC Threat Shield */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FF304F]/10 border border-[#FF304F]/30 text-[#FF304F]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-bold">PQC SHIELD:</span>
              <span className="text-[#F5F7FA] font-mono">NIST LEVEL 5</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">ZERO THREAT</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={market.status} label={market.status} />
            <span className="text-[#66717D] text-[11px] font-mono">
              {new Date(market.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <GXQLogo size="md" />
            </button>
          </div>

          {/* Quick-Access 4-Color Category Tabs (Desktop/Tablet) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl glass-lvl-1 border border-white/10 font-tech text-xs">
            {quickCategories.map((qc) => {
              const isActive = activeTab === qc.tab;
              const activeColorClass = {
                blue: 'bg-[#00A8FF] text-[#030507] shadow-[0_0_15px_rgba(0,168,255,0.45)]',
                orange: 'bg-[#FF7A00] text-[#030507] shadow-[0_0_15px_rgba(255,122,0,0.45)]',
                red: 'bg-[#FF304F] text-white shadow-[0_0_15px_rgba(255,48,79,0.45)]',
                yellow: 'bg-[#FFD400] text-[#030507] shadow-[0_0_15px_rgba(255,212,0,0.45)]',
              }[qc.color];

              return (
                <button
                  key={qc.tab}
                  onClick={() => setActiveTab(qc.tab)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? activeColorClass
                      : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
                  }`}
                >
                  <span>{qc.iconText}</span>
                  <span>{qc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Google Smart Wallet Login / Profile Button */}
            {googleUser ? (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl glass-lvl-2 border transition-all cursor-pointer ${
                  isSuperAdmin
                    ? 'border-[#FF304F]/50 hover:border-[#FF304F] shadow-[0_0_15px_rgba(255,48,79,0.3)]'
                    : 'border-[#FFD400]/40 hover:border-[#FFD400] shadow-[0_0_12px_rgba(255,212,0,0.2)]'
                }`}
                title={`Logged in as ${googleUser.email}`}
              >
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/20"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold font-tech text-[#F5F7FA] leading-tight">
                    {googleUser.email.split('@')[0]}
                  </div>
                  <div className={`text-[9px] font-mono font-bold leading-tight ${isSuperAdmin ? 'text-[#FF304F]' : 'text-[#FFD400]'}`}>
                    {isSuperAdmin ? 'MASTER ADMIN' : 'SMART WALLET'}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-lvl-2 border border-white/20 hover:border-[#00A8FF]/60 text-xs font-tech font-bold text-[#F5F7FA] hover:text-[#00A8FF] transition-all cursor-pointer"
              >
                {/* Google G logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="hidden sm:inline">Google Login</span>
              </button>
            )}

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF]/60 hover:shadow-[0_0_15px_rgba(0,168,255,0.25)] text-[#9AA6B2] hover:text-[#F5F7FA] transition-all cursor-pointer"
              aria-label="View activity alerts"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {auditEvents.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />
              )}
            </button>

            {/* Wallet Button */}
            {wallet.connected ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-lvl-3 border border-[#00A8FF]/40 hover:border-[#00A8FF] shadow-[0_0_20px_rgba(0,168,255,0.25)] transition-all cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-[#00A8FF] animate-pulse shadow-[0_0_8px_#00A8FF]" />
                <div className="text-left">
                  <div className="text-xs font-bold font-tech text-[#F5F7FA] flex items-center gap-1">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    <ChevronDown className="w-3.5 h-3.5 text-[#9AA6B2]" />
                  </div>
                  <div className="text-[10px] text-[#00A8FF] font-semibold font-mono">
                    {wallet.balanceGXQ.toFixed(3)} GXQ
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => connectWallet()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                CONNECT WALLET
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#FF7A00]/50 text-[#F5F7FA] cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#FF7A00]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Wallet Management Modal */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="Connected Quantum Wallet"
        subtitle="Post-quantum Dilithium-5 authenticated session"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl glass-lvl-2 border border-white/10 space-y-2">
            <div className="text-xs text-[#9AA6B2] uppercase font-tech">Dilithium Address</div>
            <div className="font-mono text-sm break-all text-[#00A8FF] bg-[#030507]/60 p-2.5 rounded-lg border border-white/5">
              {wallet.address}
            </div>
            <div className="flex items-center justify-between text-xs text-[#9AA6B2] pt-1">
              <span>Security Standard:</span>
              <span className="text-[#F5F7FA] font-semibold">{wallet.algorithm || 'CRYSTALS-Dilithium-5'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/10">
              <div className="text-xs text-[#9AA6B2]">GXQ Native Balance</div>
              <div className="text-lg font-tech font-bold text-[#F5F7FA] mt-1">
                {wallet.balanceGXQ.toFixed(4)} GXQ
              </div>
              <div className="text-xs text-[#00A8FF]">
                ≈ ${(wallet.balanceGXQ * (gxqTicker?.price || 3465.80)).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
              </div>
            </div>

            <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/10">
              <div className="text-xs text-[#9AA6B2]">Bridged USDC</div>
              <div className="text-lg font-tech font-bold text-[#F5F7FA] mt-1">
                ${(wallet.balances.USDC?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-emerald-400">100% Reserve Backed</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setIsWalletModalOpen(false);
                setActiveTab('wallet');
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] font-tech font-semibold hover:bg-[#00A8FF]/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Open Quantum Key Vault
            </button>
            <button
              onClick={() => {
                disconnectWallet();
                setIsWalletModalOpen(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#FF304F]/10 border border-[#FF304F]/40 text-[#FF304F] font-tech font-semibold hover:bg-[#FF304F]/20 transition-all text-sm cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>
      </Modal>

      {/* Audit Notifications Modal */}
      <Modal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title="Network Telemetry & Event Stream"
        subtitle="Live cryptographic audit events with correlation verification"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {auditEvents.slice(0, 15).map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl glass-lvl-2 border border-white/10 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-tech font-bold text-[#00A8FF]">{evt.eventType}</span>
                <span className="text-[#66717D]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-[#F5F7FA] font-sans">{evt.details}</div>
              <div className="flex items-center justify-between text-[11px] text-[#9AA6B2] pt-1">
                <span>Actor: <code className="text-[#00A8FF]">{evt.actor}</code></span>
                <span className="text-[#66717D]">{evt.verificationHash}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Google Identity & Smart Wallet Modal */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title={googleUser ? "Google Quantum Smart Wallet" : "Sign in with Google"}
        subtitle="Automatic post-quantum Dilithium address derivation linked to your Google identity."
      >
        <div className="space-y-5 text-xs font-tech">
          {googleUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl glass-lvl-2 border border-white/10 flex items-center gap-3">
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-12 h-12 rounded-full border border-white/20 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#F5F7FA] truncate">{googleUser.name}</div>
                  <div className="text-[#9AA6B2] text-xs truncate">{googleUser.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSuperAdmin ? 'bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/30' : 'bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/30'}`}>
                      {googleUser.tier}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">GOOGLE VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Derived Quantum Smart Address */}
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#9AA6B2]">
                  <span>AUTO-GENERATED QUANTUM SMART ADDRESS:</span>
                  <span className="text-[#00A8FF] font-bold">CRYSTALS-Dilithium-5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-[#00A8FF] break-all">
                  {googleUser.quantumAddress}
                </div>
                <p className="text-[10px] text-[#66717D]">
                  This address is cryptographically derived from your Google ID using HMAC lattice sieving. It will persist whenever you authenticate.
                </p>
              </div>

              {/* Account Quick Links */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setIsGoogleModalOpen(false);
                    setActiveTab(isSuperAdmin ? 'control_plane' : 'top_users');
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSuperAdmin
                      ? 'bg-[#FF304F] text-white hover:brightness-110 shadow-[0_0_15px_rgba(255,48,79,0.3)]'
                      : 'bg-[#FFD400] text-[#030507] hover:brightness-110 shadow-[0_0_15px_rgba(255,212,0,0.3)]'
                  }`}
                >
                  {isSuperAdmin ? 'Admin Control Plane' : 'VIP Top Users Hub'}
                </button>

                <button
                  onClick={() => {
                    setIsGoogleModalOpen(false);
                    setActiveTab('wallet');
                  }}
                  className="py-2.5 px-3 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF] text-[#F5F7FA] font-bold text-xs transition-colors cursor-pointer"
                >
                  View Smart Balances
                </button>
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  logoutGoogle();
                  setIsGoogleModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#FF304F]/20 text-[#9AA6B2] hover:text-[#FF304F] border border-white/10 transition-colors text-xs font-bold cursor-pointer"
              >
                Sign Out Google Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                Connect your Google account to automatically generate a post-quantum Dilithium-5 smart wallet. No private key custody required; your address is deterministically bound to your email.
              </p>

              {/* Option 1: Master Admin One-Click */}
              <button
                onClick={async () => {
                  await loginWithGoogle('gxqstudio@gmail.com', 'GXQ Studio Master Admin');
                  setIsGoogleModalOpen(false);
                }}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#FF304F]/20 via-[#FF7A00]/20 to-[#00A8FF]/20 border border-[#FF304F]/40 hover:border-[#FF304F] transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF304F] text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_#FF304F]">
                    👑
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA] group-hover:text-[#FF304F] transition-colors">
                      Authenticate as Master Admin
                    </div>
                    <div className="text-[10px] text-[#9AA6B2] font-mono">
                      gxqstudio@gmail.com (Super-Admin Clearance)
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF304F]/30 text-[#FF304F]">
                  Admin
                </span>
              </button>

              {/* Option 2: Custom Google Email Input */}
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
                <label className="block text-[#9AA6B2] font-bold">OR ENTER YOUR GOOGLE EMAIL:</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="flex-1 px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs text-[#F5F7FA] font-mono placeholder-[#66717D] focus:outline-none focus:border-[#00A8FF]"
                  />
                  <button
                    onClick={async () => {
                      if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
                        return;
                      }
                      await loginWithGoogle(customGoogleEmail.trim());
                      setIsGoogleModalOpen(false);
                      setCustomGoogleEmail('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#00A8FF] text-[#030507] font-bold text-xs hover:brightness-110 shadow-[0_0_12px_rgba(0,168,255,0.4)] transition-all cursor-pointer"
                  >
                    Generate Smart Wallet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
