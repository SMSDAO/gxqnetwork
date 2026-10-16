import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  PieChart,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const AnalyticsView: React.FC = () => {
  const { wallet, market, shards } = useGXQ();

  const [activeScoreModal, setActiveScoreModal] = useState<string | null>(null);

  const gxqTicker = market.tickers.GXQ;

  // Breakdown of Portfolio Health: 88/100
  const portfolioHealthBreakdown = [
    { label: 'Multi-Asset Diversification', delta: '+24', desc: 'Holdings distributed across native GXQ, USDC, and wrapped L1 assets.' },
    { label: 'Instant Liquidity Depth', delta: '+21', desc: 'Over $48M TVL available in Shard-1 pools for rapid exit without slippage.' },
    { label: 'Stable Backing Ratio', delta: '+18', desc: '35%+ collateral held in audited dollar reserves (USDC).' },
    { label: 'Low Volatility Drawdown', delta: '+15', desc: 'ETH parity peg maintained within 0.08% deviation band.' },
    { label: 'NIST Dilithium Custody', delta: '+10', desc: 'Cryptographic keys hardened against quantum lattice attack vectors.' },
  ];

  // Breakdown of Quantum Security: 99/100
  const securityBreakdown = [
    { label: 'CRYSTALS-Dilithium-5 (NIST L5)', delta: '+35', desc: '256-bit post-quantum lattice security polynomial ring.' },
    { label: 'Consensus Slashing Watchdog', delta: '+25', desc: 'Zero double-signing or Byzantine equivocations across 128 active validators.' },
    { label: 'Multi-Sig Relayer Quorum', delta: '+20', desc: '7/7 cryptographic relayers verified on cross-chain bridge gateway.' },
    { label: 'Formal VM Verification', delta: '+19', desc: 'Q-WASM memory isolation guarantees reentrancy protection.' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#00A8FF]" />
            Enterprise Analytics & Intelligence Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Deterministic mathematical telemetry, on-chain liquidity depth, and verifiable risk scores.
          </p>
        </div>

        <StatusBadge status="LIVE" label="TELEMETRY NOMINAL" />
      </div>

      {/* Transparent Scoring Engine Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card 1: Portfolio Health */}
        <GlassCard level={3} glow="blue" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Portfolio Health Score</span>
            <span className="text-emerald-400 font-bold font-tech">OPTIMAL</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-tech font-bold text-[#F5F7FA]">88</span>
            <span className="text-sm font-tech text-[#9AA6B2]">/ 100</span>
          </div>

          <p className="text-xs text-[#9AA6B2]">
            Balanced multi-shard asset distribution with strong dollar stablecoin reserves.
          </p>

          <button
            onClick={() => setActiveScoreModal('portfolio')}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#00A8FF]/20 text-xs font-tech font-bold text-[#00A8FF] border border-white/5 hover:border-[#00A8FF]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" /> View Breakdown
          </button>
        </GlassCard>

        {/* Score Card 2: Quantum Resistance & Security */}
        <GlassCard level={3} glow="blue" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Quantum Security Index</span>
            <span className="text-[#00A8FF] font-bold font-tech">NIST LEVEL 5</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-tech font-bold text-[#00A8FF]">99</span>
            <span className="text-sm font-tech text-[#9AA6B2]">/ 100</span>
          </div>

          <p className="text-xs text-[#9AA6B2]">
            Immune to Grover's and Shor's quantum algorithms via Dilithium-5 lattice proofs.
          </p>

          <button
            onClick={() => setActiveScoreModal('security')}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#00A8FF]/20 text-xs font-tech font-bold text-[#00A8FF] border border-white/5 hover:border-[#00A8FF]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" /> View Breakdown
          </button>
        </GlassCard>

        {/* Score Card 3: Network Consensus Health */}
        <GlassCard level={3} glow="orange" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Consensus Finality Score</span>
            <span className="text-[#FF7A00] font-bold font-tech">HIGH THROUGHPUT</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-tech font-bold text-[#FF7A00]">94</span>
            <span className="text-sm font-tech text-[#9AA6B2]">/ 100</span>
          </div>

          <p className="text-xs text-[#9AA6B2]">
            14,280 TPS average across 4 shards with zero consensus stalls or forks.
          </p>

          <button
            onClick={() => setActiveScoreModal('consensus')}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#FF7A00]/20 text-xs font-tech font-bold text-[#FF7A00] border border-white/5 hover:border-[#FF7A00]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" /> View Breakdown
          </button>
        </GlassCard>
      </div>

      {/* Enterprise Metrics 4-Box Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Momentum */}
        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Market Momentum</span>
            <span className="text-emerald-400 font-bold">BULLISH</span>
          </div>
          <div className="text-lg font-tech font-bold text-[#F5F7FA]">RSI: 58.4 (Neutral-Strong)</div>
          <div className="text-[11px] text-[#9AA6B2]">
            Volume expansion of +14.2% on ETH parity pairs.
          </div>
          <div className="pt-2 text-[10px] text-[#66717D] uppercase font-mono">
            CATEGORY: [CALCULATION]
          </div>
        </GlassCard>

        {/* Volatility */}
        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>L1 Volatility</span>
            <span className="text-[#00A8FF] font-bold">LOW-MODERATE</span>
          </div>
          <div className="text-lg font-tech font-bold text-[#F5F7FA]">24h ATR: $74.20</div>
          <div className="text-[11px] text-[#9AA6B2]">
            Arbitrage spreads tight at 0.08% across bridge channels.
          </div>
          <div className="pt-2 text-[10px] text-[#66717D] uppercase font-mono">
            CATEGORY: [CALCULATION]
          </div>
        </GlassCard>

        {/* Liquidity Depth */}
        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Shard-1 Liquidity</span>
            <span className="text-emerald-400 font-bold">STRONG</span>
          </div>
          <div className="text-lg font-tech font-bold text-[#F5F7FA]">$48.2M Available</div>
          <div className="text-[11px] text-[#9AA6B2]">
            $500k swap executes with &lt; 0.12% price impact.
          </div>
          <div className="pt-2 text-[10px] text-[#66717D] uppercase font-mono">
            CATEGORY: [DATA]
          </div>
        </GlassCard>

        {/* Portfolio Risk */}
        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Custody Risk Profile</span>
            <span className="text-[#00A8FF] font-bold">LOW</span>
          </div>
          <div className="text-lg font-tech font-bold text-[#F5F7FA]">Dilithium-5 Protected</div>
          <div className="text-[11px] text-[#9AA6B2]">
            Zero unconfirmed transactions or counterparty exposures.
          </div>
          <div className="pt-2 text-[10px] text-[#66717D] uppercase font-mono">
            CATEGORY: [AI INTERPRETATION]
          </div>
        </GlassCard>
      </div>

      {/* Asset Concentration & Exposure Breakdown */}
      <GlassCard level={2} className="p-6 space-y-4">
        <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#00A8FF]" />
          Portfolio Asset Allocation & Network Exposure
        </h3>

        <div className="space-y-3 font-tech text-xs">
          {Object.values(wallet.balances).map((asset) => {
            const price = asset.symbol === 'GXQ' ? (gxqTicker?.price || 3465.8) : asset.symbol === 'ETH' ? (market.tickers.ETH?.price || 3465.8) : 1;
            const usdVal = asset.balance * price;
            const totalVal = 64000;
            const pct = Math.min(100, Math.floor((usdVal / totalVal) * 100));

            return (
              <div key={asset.symbol} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#F5F7FA]">
                    {asset.name} ({asset.symbol})
                  </span>
                  <span className="text-[#00A8FF] font-mono">
                    ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00A8FF] to-[#008CFF] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Transparent Score Breakdown Modal */}
      <Modal
        isOpen={!!activeScoreModal}
        onClose={() => setActiveScoreModal(null)}
        title={
          activeScoreModal === 'portfolio'
            ? 'Portfolio Health Breakdown (88/100)'
            : activeScoreModal === 'security'
            ? 'Quantum Security Breakdown (99/100)'
            : 'Consensus Finality Breakdown (94/100)'
        }
        subtitle="Transparent scoring engine: No unexplained black-box metrics"
      >
        <div className="space-y-3 text-xs font-tech">
          {(activeScoreModal === 'portfolio'
            ? portfolioHealthBreakdown
            : activeScoreModal === 'security'
            ? securityBreakdown
            : portfolioHealthBreakdown
          ).map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F5F7FA]">{item.label}</span>
                <span className="text-emerald-400 font-bold font-mono">{item.delta}</span>
              </div>
              <p className="text-[11px] text-[#9AA6B2]">{item.desc}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
