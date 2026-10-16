import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Trophy,
  Users,
  Zap,
  Send,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Award,
  Wallet
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const TopUsersView: React.FC = () => {
  const {
    topUsers,
    whaleActivity,
    stakingPools,
    wallet,
    googleUser,
    loginWithGoogle,
    executeP2PTransfer,
    executeStake,
    addToast
  } = useGXQ();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'QUANTUM_WHALE' | 'DIAMOND_VALIDATOR' | 'CYBER_TRADER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // P2P Transfer modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [recipientInput, setRecipientInput] = useState('');
  const [transferAmount, setTransferAmount] = useState('1.5');
  const [transferNote, setTransferNote] = useState('');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  // Staking modal
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('2.0');
  const [isStakingSubmitting, setIsStakingSubmitting] = useState(false);

  // Copy helper
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    addToast('Copied to Clipboard', `${label}: ${text.slice(0, 12)}...`, 'info');
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredUsers = topUsers.filter(u => {
    if (activeFilter !== 'ALL' && u.tier !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.emailMasked.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenTransfer = (target?: string) => {
    if (target) setRecipientInput(target);
    setIsTransferModalOpen(true);
  };

  const handleExecuteP2P = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientInput.trim()) {
      addToast('Recipient Missing', 'Please enter a valid Google email or quantum address.', 'warn');
      return;
    }
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) {
      addToast('Invalid Amount', 'Please specify a positive GXQ transfer amount.', 'warn');
      return;
    }

    setIsSubmittingTransfer(true);
    try {
      const res = await executeP2PTransfer(recipientInput.trim(), val, transferNote.trim() || undefined);
      if (res.success) {
        setIsTransferModalOpen(false);
        setRecipientInput('');
        setTransferNote('');
      }
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const handleOpenStake = (poolId: string) => {
    setSelectedPoolId(poolId);
  };

  const handleExecuteStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolId) return;
    const val = parseFloat(stakeAmount);
    if (isNaN(val) || val <= 0) {
      addToast('Invalid Stake', 'Please enter a valid stake amount.', 'warn');
      return;
    }

    setIsStakingSubmitting(true);
    try {
      const res = await executeStake(selectedPoolId, val);
      if (res.success) {
        setSelectedPoolId(null);
      }
    } finally {
      setIsStakingSubmitting(false);
    }
  };

  const selectedPool = stakingPools.find(p => p.id === selectedPoolId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner: Top Users & Quantum Yield Hub */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-tech font-bold px-2 py-0.5 rounded bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,212,0,0.3)]">
              <Trophy className="w-3.5 h-3.5" /> TOP USERS & YIELD REPUTATION
            </span>
            <span className="text-xs font-tech text-[#9AA6B2]">NIST PQC SMART WALLETS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-tech text-[#F5F7FA] mt-1">
            Top Users & VIP Quantum Guild
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-0.5">
            Verified ranking, whale liquidity radar, high-yield staking pools, and instant peer-to-peer quantum transfers linked to Google Identity.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOpenTransfer()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            INSTANT P2P TRANSFER
          </button>

          {!googleUser ? (
            <button
              onClick={() => loginWithGoogle()}
              className="px-4 py-2.5 rounded-xl glass-lvl-2 border border-[#00A8FF]/40 text-[#00A8FF] font-tech font-bold text-xs sm:text-sm hover:bg-[#00A8FF]/20 shadow-[0_0_15px_rgba(0,168,255,0.2)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              CONNECT GOOGLE SMART WALLET
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-lvl-2 border border-[#FFD400]/30 text-xs font-tech">
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                className="w-6 h-6 rounded-full border border-[#FFD400]"
              />
              <span className="font-bold text-[#F5F7FA]">{googleUser.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFD400]/20 text-[#FFD400] font-mono">
                {googleUser.tier}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4-Color Stat Bar for Top Users */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Blue: Total Staked in Quantum Mesh */}
        <GlassCard level={2} glow="blue" className="p-4 sm:p-5 space-y-1">
          <div className="text-[11px] font-tech text-[#00A8FF] flex items-center justify-between">
            <span>TOTAL VIP STAKE</span>
            <Trophy className="w-4 h-4 text-[#00A8FF]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-tech text-[#F5F7FA]">
            3,250,000 GXQ
          </div>
          <div className="text-[11px] text-[#9AA6B2]">
            $11,261,250 USD locked across 4 shards
          </div>
        </GlassCard>

        {/* Orange: 30D VIP Trading Volume */}
        <GlassCard level={2} glow="orange" className="p-4 sm:p-5 space-y-1">
          <div className="text-[11px] font-tech text-[#FF7A00] flex items-center justify-between">
            <span>30D VIP VOLUME</span>
            <TrendingUp className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-tech text-[#F5F7FA]">
            $66.2M USD
          </div>
          <div className="text-[11px] text-[#9AA6B2]">
            18,420 high-frequency atomic swaps
          </div>
        </GlassCard>

        {/* Yellow: Max Staking APY */}
        <GlassCard level={2} glow="yellow" className="p-4 sm:p-5 space-y-1">
          <div className="text-[11px] font-tech text-[#FFD400] flex items-center justify-between">
            <span>MAX STAKE APY</span>
            <Sparkles className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-tech text-[#FFD400]">
            28.4% APY
          </div>
          <div className="text-[11px] text-[#9AA6B2]">
            Shard-1 High-Frequency DEX AMM Pool
          </div>
        </GlassCard>

        {/* Red: Quantum Active Whales */}
        <GlassCard level={2} glow="red" className="p-4 sm:p-5 space-y-1">
          <div className="text-[11px] font-tech text-[#FF304F] flex items-center justify-between">
            <span>ACTIVE WHALES</span>
            <Flame className="w-4 h-4 text-[#FF304F]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-tech text-[#F5F7FA]">
            142 Nodes / Guilds
          </div>
          <div className="text-[11px] text-[#9AA6B2]">
            NIST Level 5 Dilithium verified wallets
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Left Column Leaderboard, Right Column Staking & Whale Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Top Users Leaderboard */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard level={3} className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFD400]" />
                  Top Users Leaderboard
                </h2>
                <p className="text-xs text-[#9AA6B2] mt-0.5">
                  Ranked by composite score (total stake, monthly DEX turnover, and shard uptime).
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl glass-lvl-1 border border-white/5 text-[11px] font-tech">
                {(['ALL', 'QUANTUM_WHALE', 'DIAMOND_VALIDATOR', 'CYBER_TRADER'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeFilter === filter
                        ? 'bg-[#00A8FF] text-[#030507] font-bold shadow-[0_0_10px_rgba(0,168,255,0.4)]'
                        : 'text-[#9AA6B2] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Tiers' : filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#66717D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username, masked email, or quantum address..."
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs sm:text-sm font-tech text-[#F5F7FA] placeholder-[#66717D] focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-tech">
                <thead>
                  <tr className="border-b border-white/10 text-[#66717D] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-2">Rank</th>
                    <th className="pb-3 px-3">Top User / Guild</th>
                    <th className="pb-3 px-3">Tier</th>
                    <th className="pb-3 px-3 text-right">Total Stake</th>
                    <th className="pb-3 px-3 text-right">30D Volume</th>
                    <th className="pb-3 px-3 text-right">Reputation</th>
                    <th className="pb-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => {
                    const isCopied = copiedAddress === u.address;
                    const tierBadgeColor = {
                      QUANTUM_WHALE: 'bg-[#FF304F]/20 text-[#FF304F] border-[#FF304F]/30',
                      DIAMOND_VALIDATOR: 'bg-[#00A8FF]/20 text-[#00A8FF] border-[#00A8FF]/30',
                      CYBER_TRADER: 'bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/30',
                      PRO_BUILDER: 'bg-[#FFD400]/20 text-[#FFD400] border-[#FFD400]/30',
                    }[u.tier];

                    return (
                      <tr key={u.address} className="hover:bg-white/[0.03] transition-colors group">
                        {/* Rank */}
                        <td className="py-3.5 px-2 font-bold font-mono">
                          {u.rank <= 3 ? (
                            <span className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-gradient-to-br from-[#FFD400] to-[#FF7A00] text-[#030507] font-bold text-xs shadow-[0_0_8px_rgba(255,212,0,0.5)]">
                              #{u.rank}
                            </span>
                          ) : (
                            <span className="text-[#66717D] pl-1.5">#{u.rank}</span>
                          )}
                        </td>

                        {/* Name & Address */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#F5F7FA] group-hover:text-[#00A8FF] transition-colors flex items-center gap-1.5">
                            {u.name}
                            {u.isOnline && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active online" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#66717D] mt-0.5">
                            <span>{u.emailMasked}</span>
                            <span>•</span>
                            <span className="font-mono">{u.address.slice(0, 8)}...{u.address.slice(-6)}</span>
                            <button
                              onClick={() => copyToClipboard(u.address, u.name)}
                              className="text-[#66717D] hover:text-[#00A8FF] cursor-pointer"
                              title="Copy quantum address"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Tier */}
                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierBadgeColor}`}>
                            {u.tier.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Stake */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="font-bold text-[#F5F7FA]">
                            {u.totalStakedGXQ.toLocaleString()} GXQ
                          </div>
                          <div className="text-[10px] text-emerald-400">
                            +{u.yieldApyPercent}% APY
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="font-bold text-[#F5F7FA]">
                            ${(u.volume30dUsd / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-[10px] text-[#66717D]">
                            {u.txCount.toLocaleString()} txs
                          </div>
                        </td>

                        {/* Reputation Score */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
                            {u.reputationScore}/100
                          </div>
                        </td>

                        {/* Quick Send */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenTransfer(u.address)}
                            className="px-2.5 py-1 rounded-lg bg-[#FF7A00]/20 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-[#030507] border border-[#FF7A00]/40 font-bold transition-all text-[11px] cursor-pointer"
                          >
                            Send
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Whale Radar Feed */}
          <GlassCard level={2} glow="red" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF304F]" />
                <h3 className="text-base sm:text-lg font-bold font-tech text-[#F5F7FA]">
                  Live Whale Radar & Institutional Liquidity Flows
                </h3>
              </div>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/40 animate-pulse">
                REAL-TIME RADAR
              </span>
            </div>

            <div className="space-y-2.5">
              {whaleActivity.map((wh) => (
                <div
                  key={wh.id}
                  className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-tech"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF304F]/10 border border-[#FF304F]/30 flex items-center justify-center text-[#FF304F] shrink-0 font-bold">
                      🐋
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F5F7FA]">
                          {wh.fromTag || wh.from.slice(0, 10)}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#66717D]" />
                        <span className="text-[#9AA6B2]">
                          {wh.toTag || wh.to.slice(0, 10)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#F5F7FA] font-mono">
                          Shard-{wh.shardId}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#66717D] mt-0.5 font-mono">
                        Tx: {wh.txHash} • {Math.round((Date.now() - wh.timestamp) / 60000)}m ago
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#FFD400]">
                      {wh.amountGXQ.toLocaleString()} GXQ
                    </div>
                    <div className="text-[11px] text-[#9AA6B2]">
                      ≈ ${(wh.usdValue).toLocaleString()} USD
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column (4 cols): Quantum Staking Pools & User Referral */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Staking Pools */}
          <GlassCard level={3} glow="yellow" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFD400]" />
                <h3 className="text-base sm:text-lg font-bold font-tech text-[#F5F7FA]">
                  High-Yield Staking Pools
                </h3>
              </div>
              <span className="text-[10px] font-tech text-[#9AA6B2]">AUTO-COMPOUND</span>
            </div>
            <p className="text-xs text-[#9AA6B2]">
              Stake GXQ native token into quantum shards to secure the network and earn protocol revenue rewards.
            </p>

            <div className="space-y-3">
              {stakingPools.map((pool) => (
                <div
                  key={pool.id}
                  className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-2 hover:border-[#FFD400]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-[#F5F7FA]">
                      {pool.name}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {pool.aprPercent}% APR
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#9AA6B2]">
                    <span>Total Locked: {pool.totalStakedGXQ.toLocaleString()} GXQ</span>
                    <span>Lock: {pool.lockPeriodDays} Days</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#66717D]">
                      Min: {pool.minStake} GXQ
                    </span>
                    <button
                      onClick={() => handleOpenStake(pool.id)}
                      className="px-3 py-1 rounded-lg bg-[#FFD400] text-[#030507] font-bold text-xs hover:brightness-110 shadow-[0_0_10px_rgba(255,212,0,0.3)] transition-all cursor-pointer"
                    >
                      Stake Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* User Referral & Ambassador Card */}
          <GlassCard level={2} glow="orange" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="text-base sm:text-lg font-bold font-tech text-[#F5F7FA]">
                Ambassador & Referral Hub
              </h3>
            </div>
            <p className="text-xs text-[#9AA6B2]">
              Invite fellow traders and developers to GXQ Network. Earn 10% lifetime commission on their transaction gas and DEX swap fees.
            </p>

            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-2 text-xs font-tech">
              <div className="flex items-center justify-between">
                <span className="text-[#66717D]">YOUR REFERRAL CODE:</span>
                <span className="font-bold text-[#FF7A00] font-mono">
                  {googleUser ? googleUser.referralCode : 'GXQ-PRO-7821'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#66717D]">EARNED COMMISSIONS:</span>
                <span className="font-bold text-emerald-400">
                  {googleUser ? googleUser.referralEarningsGXQ : 14.8} GXQ (~${((googleUser?.referralEarningsGXQ || 14.8) * 3465).toFixed(0)})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const code = googleUser ? googleUser.referralCode : 'GXQ-PRO-7821';
                copyToClipboard(`https://gxq.network/join?ref=${code}`, 'Referral Link');
              }}
              className="w-full py-2.5 rounded-xl glass-lvl-2 border border-[#FF7A00]/40 text-[#FF7A00] hover:bg-[#FF7A00]/20 font-bold font-tech text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              COPY REFERRAL LINK
            </button>
          </GlassCard>

          {/* VIP Tier Benefits */}
          <GlassCard level={2} glow="blue" className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00A8FF]" />
              <h3 className="text-base sm:text-lg font-bold font-tech text-[#F5F7FA]">
                VIP Tier Privileges
              </h3>
            </div>

            <div className="space-y-2 text-xs font-tech text-[#9AA6B2]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#F5F7FA]">Titanium Super-Admin</span>
                <span className="text-[#FF304F] font-bold">100% Fee Rebate + Control</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#F5F7FA]">Quantum Whale</span>
                <span className="text-[#FF7A00] font-bold">80% Fee Rebate + Direct Shard</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#F5F7FA]">Diamond Validator</span>
                <span className="text-[#00A8FF] font-bold">60% Rebate + Block Rewards</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#F5F7FA]">Cyber Trader</span>
                <span className="text-[#FFD400] font-bold">40% Rebate + Priority Relayer</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal: Instant P2P Quantum Transfer */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Instant P2P Quantum Transfer"
        subtitle="Transfer native GXQ token with NIST Level 5 Dilithium post-quantum signature."
      >
        <form onSubmit={handleExecuteP2P} className="space-y-4 text-xs font-tech">
          <div>
            <label className="block text-[#9AA6B2] mb-1 font-bold">
              RECIPIENT (GOOGLE EMAIL OR QUANTUM ADDRESS):
            </label>
            <input
              type="text"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              placeholder="e.g. user@gmail.com or gxq1q88a91..."
              className="w-full px-3 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] font-mono placeholder-[#66717D] focus:outline-none focus:border-[#FF7A00]"
              required
            />
            {recipientInput.includes('@') && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Auto-deriving quantum smart wallet for Google user: {recipientInput}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#9AA6B2] font-bold">AMOUNT (GXQ):</label>
              <span className="text-[#66717D]">
                Available: {wallet.balanceGXQ.toFixed(4)} GXQ
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-base font-bold text-[#F5F7FA] focus:outline-none focus:border-[#FF7A00]"
                required
              />
              <button
                type="button"
                onClick={() => setTransferAmount(wallet.balanceGXQ.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#00A8FF] text-[10px] font-bold cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#9AA6B2] mb-1 font-bold">TRANSACTION MEMO / NOTE (OPTIONAL):</label>
            <input
              type="text"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="e.g. Shard Liquidity Allocation / OTC Settlement"
              className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] placeholder-[#66717D] focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[#66717D]">NETWORK GAS FEE:</span>
              <span className="text-[#F5F7FA]">0.00012 GXQ (~$0.41)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66717D]">ENCRYPTION ALGORITHM:</span>
              <span className="text-[#00A8FF]">CRYSTALS-Dilithium-5 (Lattice)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66717D]">FINALITY TIME:</span>
              <span className="text-emerald-400">1.2 Seconds</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-lvl-1 text-[#9AA6B2] hover:text-[#F5F7FA] font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingTransfer}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-bold hover:brightness-110 shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingTransfer ? 'SIGNING WITH DILITHIUM...' : 'CONFIRM & SEND P2P'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Stake GXQ */}
      {selectedPool && (
        <Modal
          isOpen={!!selectedPoolId}
          onClose={() => setSelectedPoolId(null)}
          title={`Stake in ${selectedPool.name}`}
          subtitle={`Earn ${selectedPool.aprPercent}% APR with ${selectedPool.lockPeriodDays}-day quantum lock.`}
        >
          <form onSubmit={handleExecuteStake} className="space-y-4 text-xs font-tech">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#9AA6B2] font-bold">AMOUNT TO STAKE (GXQ):</label>
                <span className="text-[#66717D]">
                  Available: {wallet.balanceGXQ.toFixed(4)} GXQ
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min={selectedPool.minStake}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-base font-bold text-[#F5F7FA] focus:outline-none focus:border-[#FFD400]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setStakeAmount(wallet.balanceGXQ.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#FFD400] text-[10px] font-bold cursor-pointer"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Calculations preview */}
            <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#66717D]">ESTIMATED MONTHLY YIELD:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  +{((parseFloat(stakeAmount) || 0) * (selectedPool.aprPercent / 100) / 12).toFixed(4)} GXQ
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#66717D]">ESTIMATED YEARLY REWARD:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  +{((parseFloat(stakeAmount) || 0) * (selectedPool.aprPercent / 100)).toFixed(4)} GXQ (~${(((parseFloat(stakeAmount) || 0) * (selectedPool.aprPercent / 100)) * 3465).toFixed(0)})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#66717D]">SECURITY SHIELD:</span>
                <span className="text-[#00A8FF]">{selectedPool.quantumShieldLevel}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPoolId(null)}
                className="px-4 py-2 rounded-xl glass-lvl-1 text-[#9AA6B2] hover:text-[#F5F7FA] font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isStakingSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#FFD400] text-[#030507] font-bold hover:brightness-110 shadow-[0_0_20px_rgba(255,212,0,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isStakingSubmitting ? 'DEPOSITING TO SHARD...' : 'CONFIRM STAKE DEPOSIT'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
