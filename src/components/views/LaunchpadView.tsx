import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
  PlusCircle,
  TrendingUp,
  ExternalLink,
  Award,
  Zap
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { LaunchpadToken } from '../../types/blockchain';
import { blockchain } from '../../services/blockchainService';

export const LaunchpadView: React.FC = () => {
  const { wallet, launchpadTokens, market, triggerFlash, addToast } = useGXQ();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTokenForInvest, setSelectedTokenForInvest] = useState<LaunchpadToken | null>(null);
  const [investAmountUsd, setInvestAmountUsd] = useState('500');

  // Token creation form state
  const [formName, setFormName] = useState('');
  const [formSymbol, setFormSymbol] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSupply, setFormSupply] = useState('10000000');
  const [formPrice, setFormPrice] = useState('2.50');
  const [formHardCap, setFormHardCap] = useState('5000000');

  const gxqTicker = market.tickers.GXQ;

  const handleCreateToken = () => {
    if (!formName || !formSymbol) {
      addToast('Missing Fields', 'Token name and symbol are required.', 'warn');
      return;
    }

    const supplyNum = parseFloat(formSupply) || 10000000;
    const priceNum = parseFloat(formPrice) || 1.0;
    const hardCapNum = parseFloat(formHardCap) || 1000000;

    blockchain.createLaunchpadToken({
      name: formName,
      symbol: formSymbol.toUpperCase(),
      description: formDescription || 'Enterprise token deployed on GXQ Quantum Blockchain.',
      totalSupply: supplyNum,
      circulatingSupply: Math.floor(supplyNum * 0.4),
      initialPriceUsd: priceNum,
      hardCapUsd: hardCapNum,
      kycVerified: true,
      dilithiumAudited: true,
      creator: wallet.address,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      tags: ['Enterprise', 'QRC-20', 'Dilithium-5'],
    });

    triggerFlash('SUCCESS_FLASH');
    addToast(
      'Token Launched',
      `Launched enterprise token ${formName} ($${formSymbol.toUpperCase()}) with NIST Level 5 Dilithium verification.`,
      'success'
    );
    setIsCreateModalOpen(false);
  };

  const handleInvest = () => {
    if (!selectedTokenForInvest) return;
    const amount = parseFloat(investAmountUsd) || 0;
    if (amount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid investment amount.', 'warn');
      return;
    }

    try {
      blockchain.investInLaunchpadToken(selectedTokenForInvest.id, amount, wallet.address);
      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Investment Confirmed',
        `Invested $${amount} USDC in ${selectedTokenForInvest.name}. Tokens credited to your quantum portfolio.`,
        'success'
      );
      setSelectedTokenForInvest(null);
    } catch (err: any) {
      addToast('Investment Failed', err?.message || 'Could not complete investment.', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Rocket className="w-7 h-7 text-[#00A8FF]" />
            Tokens Launchpad — Exclusive Enterprise Edition
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Institutional token offerings, fair launches, and Dilithium-5 security compliance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          CREATE ENTERPRISE TOKEN
        </button>
      </div>

      {/* Featured Flagship: Main Token GXQ */}
      <GlassCard level={3} glow="blue" className="p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#00A8FF]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-tech font-bold px-2 py-0.5 rounded bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/30">
                FLAGSHIP NATIVE TOKEN
              </span>
              <span className="text-xs font-tech font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NIST LEVEL 5 AUDITED
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#F5F7FA]">
              GXQ Network Prime Token ($GXQ)
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              GXQ operates on a 1:1 dynamic parity anchor with Ethereum, matching Ethereum's circulating supply dynamics (~120M total supply) while offering 14,000+ TPS and post-quantum lattice security. People can bridge directly from Ethereum, Solana, and Arbitrum using USDC.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-tech pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[#9AA6B2]">ETH PARITY PRICE:</span>
                <span className="text-xl font-bold text-[#00A8FF]">
                  ${gxqTicker?.price ? gxqTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '3,465.80'}
                </span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-[#9AA6B2]">TOTAL SUPPLY:</span>
                <span className="text-sm font-bold text-[#F5F7FA]">120,450,000 GXQ</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-[#9AA6B2]">BRIDGED USDC LIQUIDITY:</span>
                <span className="text-sm font-bold text-emerald-400">$32,000,000+</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass-lvl-2 border border-white/10 space-y-3 shrink-0 w-full lg:w-72">
            <div className="flex justify-between text-xs font-tech">
              <span className="text-[#9AA6B2]">Circulating Ratio</span>
              <span className="text-[#00A8FF] font-bold">64.9%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00A8FF] to-[#008CFF] w-[64.9%]" />
            </div>
            <div className="flex justify-between text-[11px] text-[#66717D] font-mono">
              <span>78.2M Circulating</span>
              <span>120.4M Max</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Enterprise Token Launchpad Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF7A00]" />
            Active Institutional Launchpad Projects
          </h3>
          <span className="text-xs font-tech text-[#9AA6B2]">
            Total Raised: <strong className="text-emerald-400 font-mono">$303,867,000 USDC</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launchpadTokens.map((token) => {
            const percentRaised = Math.min(100, Math.floor((token.raisedUsd / token.hardCapUsd) * 100));
            return (
              <GlassCard key={token.id} level={2} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
                        {token.name}
                        <span className="text-xs font-mono text-[#00A8FF]">(${token.symbol})</span>
                      </h4>
                      <p className="text-xs text-[#9AA6B2] mt-1 line-clamp-2">
                        {token.description}
                      </p>
                    </div>
                    <StatusBadge status="ACTIVE" label={token.status} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {token.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-tech px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#9AA6B2]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-tech">
                      <span className="text-[#9AA6B2]">Funding Progress</span>
                      <span className="text-emerald-400 font-bold">{percentRaised}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00A8FF] to-emerald-400 rounded-full"
                        style={{ width: `${percentRaised}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#66717D] font-mono">
                      <span>${(token.raisedUsd / 1000000).toFixed(1)}M Raised</span>
                      <span>${(token.hardCapUsd / 1000000).toFixed(1)}M Hard Cap</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="text-xs font-tech">
                    <span className="text-[#66717D]">PRICE:</span>{' '}
                    <span className="font-bold text-[#F5F7FA]">${token.initialPriceUsd.toFixed(2)} USDC</span>
                  </div>

                  <button
                    onClick={() => setSelectedTokenForInvest(token)}
                    className="px-4 py-2 rounded-xl bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] font-tech font-bold text-xs hover:bg-[#00A8FF]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    PARTICIPATE
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Create Enterprise Token Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Deploy Enterprise QRC-20 Token"
        subtitle="Mint institutional token standard with Dilithium post-quantum security"
      >
        <div className="space-y-4 text-xs font-tech">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">TOKEN NAME</label>
              <input
                type="text"
                placeholder="e.g. Apex Quantum Capital"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">SYMBOL</label>
              <input
                type="text"
                placeholder="e.g. AQC"
                value={formSymbol}
                onChange={(e) => setFormSymbol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#00A8FF] uppercase focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#9AA6B2]">PROJECT DESCRIPTION</label>
            <textarea
              rows={2}
              placeholder="Enterprise utility and tokenomics..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">TOTAL SUPPLY</label>
              <input
                type="number"
                value={formSupply}
                onChange={(e) => setFormSupply(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-mono text-[#F5F7FA] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">INITIAL PRICE (USD)</label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-mono text-[#F5F7FA] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">HARD CAP (USD)</label>
              <input
                type="number"
                value={formHardCap}
                onChange={(e) => setFormHardCap(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-mono text-[#F5F7FA] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">VESTING CLIFF (MONTHS)</label>
              <select className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 text-xs font-mono text-[#00A8FF] focus:outline-none">
                <option>0 Months (Instant Unlock)</option>
                <option>3 Months Cliff</option>
                <option>6 Months Cliff (Recommended)</option>
                <option>12 Months Cliff (Enterprise)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">LINEAR VESTING DURATION</label>
              <select className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 text-xs font-mono text-[#00A8FF] focus:outline-none">
                <option>6 Months Linear</option>
                <option>12 Months Linear</option>
                <option>24 Months Linear</option>
                <option>48 Months Linear</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1 text-[11px]">
            <div className="flex justify-between text-[#9AA6B2]">
              <span>Tokenomics:</span>
              <span className="text-[#F5F7FA]">50% Public Presale • 30% Shard-1 LP • 20% Team/Treasury</span>
            </div>
            <div className="flex justify-between text-[#9AA6B2]">
              <span>Dilithium Security:</span>
              <span className="text-emerald-400 font-bold">Automatic NIST Level 5 Bytecode Audit Badge</span>
            </div>
          </div>

          <button
            onClick={handleCreateToken}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-bold hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all cursor-pointer mt-2"
          >
            MINT & REGISTER TOKEN BLUEPRINT
          </button>
        </div>
      </Modal>

      {/* Invest in Project Modal */}
      <Modal
        isOpen={!!selectedTokenForInvest}
        onClose={() => setSelectedTokenForInvest(null)}
        title={`Participate in ${selectedTokenForInvest?.name}`}
        subtitle={`Deposit USDC to receive allocated $${selectedTokenForInvest?.symbol} tokens`}
      >
        {selectedTokenForInvest && (
          <div className="space-y-4 text-xs font-tech">
            <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="flex justify-between text-[#9AA6B2]">
                <span>TOKEN PRICE:</span>
                <span className="font-bold text-[#F5F7FA]">${selectedTokenForInvest.initialPriceUsd.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between text-[#9AA6B2]">
                <span>YOUR USDC BALANCE:</span>
                <span className="font-bold text-emerald-400">
                  ${(wallet.balances.USDC?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#9AA6B2]">INVESTMENT AMOUNT (USDC)</label>
              <input
                type="number"
                value={investAmountUsd}
                onChange={(e) => setInvestAmountUsd(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 text-base font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <div className="flex justify-between text-[#9AA6B2]">
                <span>Estimated Token Allocation:</span>
                <span className="font-bold text-[#00A8FF]">
                  {((parseFloat(investAmountUsd) || 0) / selectedTokenForInvest.initialPriceUsd).toFixed(2)} ${selectedTokenForInvest.symbol}
                </span>
              </div>
            </div>

            <button
              onClick={handleInvest}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              CONFIRM ALLOCATION DEPOSIT
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
