import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  Pickaxe,
  FileCode2,
  GitFork,
  ExternalLink,
  ChevronRight,
  Activity,
  Boxes,
  Lock
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { QuantumBlock, QuantumTransaction } from '../../types/blockchain';

export const DashboardView: React.FC = () => {
  const {
    wallet,
    market,
    blocks,
    transactions,
    shards,
    setActiveTab,
    triggerFlash,
    addToast
  } = useGXQ();

  const [selectedBlock, setSelectedBlock] = useState<QuantumBlock | null>(null);
  const [selectedTx, setSelectedTx] = useState<QuantumTransaction | null>(null);

  const gxqTicker = market.tickers.GXQ;
  const ethTicker = market.tickers.ETH;

  // Calculate total portfolio USD value
  const totalPortfolioUsd = Object.values(wallet.balances).reduce((acc, curr) => {
    let price = 1;
    if (curr.symbol === 'GXQ') price = gxqTicker?.price || 3465.80;
    else if (curr.symbol === 'ETH') price = ethTicker?.price || 3465.80;
    else if (curr.symbol === 'BTC') price = market.tickers.BTC?.price || 94820;
    else if (curr.symbol === 'SOL') price = market.tickers.SOL?.price || 198.4;
    return acc + (curr.balance * price);
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Valuation */}
        <GlassCard level={3} glow="blue" className="relative group">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Portfolio Valuation</span>
            <span className="text-[#00A8FF] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Dilithium Sec
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#F5F7FA] tracking-tight">
            ${totalPortfolioUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#00A8FF] font-semibold flex items-center gap-1 font-tech">
              <TrendingUp className="w-3.5 h-3.5" /> +{gxqTicker?.change24h ? gxqTicker.change24h.toFixed(2) : '2.45'}% (24h)
            </span>
            <span className="text-[#9AA6B2] text-[11px]">
              {wallet.balanceGXQ.toFixed(3)} GXQ
            </span>
          </div>
        </GlassCard>

        {/* Main Token GXQ Parity */}
        <GlassCard level={2} glow="blue">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Main Token (GXQ)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/30">
              ETH PARITY
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#F5F7FA] tracking-tight">
            ${gxqTicker?.price ? gxqTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '3,465.80'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#9AA6B2]">Total Supply:</span>
            <span className="font-mono text-[#F5F7FA] text-xs">120,450,000 GXQ</span>
          </div>
        </GlassCard>

        {/* Quantum Network Throughput */}
        <GlassCard level={2} glow="none">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Consensus TPS</span>
            <span className="text-emerald-400 font-semibold font-tech">PoQW + PBFT</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#00A8FF] tracking-tight">
            14,280 <span className="text-sm font-normal text-[#9AA6B2]">/ 38.4k</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#9AA6B2]">Target Latency:</span>
            <span className="text-[#F5F7FA] font-tech">1.2s Block Time</span>
          </div>
        </GlassCard>

        {/* Active Multi-Shards */}
        <GlassCard level={2} glow="orange">
          <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Active Shard Nodes</span>
            <StatusBadge status="ACTIVE" label="4 SHARDS" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#FF7A00] tracking-tight">
            128 <span className="text-sm font-normal text-[#9AA6B2]">Validators</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#9AA6B2]">Cross-Shard Queue:</span>
            <span className="text-[#F5F7FA] font-mono">69 Pending PQC</span>
          </div>
        </GlassCard>
      </div>

      {/* Fast Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('swap')}
          className="p-3.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF]/60 hover:bg-[#00A8FF]/10 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-[#00A8FF]/15 text-[#00A8FF] group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="font-tech text-xs font-bold text-[#F5F7FA]">Instant Swap</span>
          <span className="text-[10px] text-[#9AA6B2]">AMM Shard-1</span>
        </button>

        <button
          onClick={() => setActiveTab('mining')}
          className="p-3.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#FF7A00]/60 hover:bg-[#FF7A00]/10 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-[#FF7A00]/15 text-[#FF7A00] group-hover:scale-110 transition-transform">
            <Pickaxe className="w-5 h-5" />
          </div>
          <span className="font-tech text-xs font-bold text-[#F5F7FA]">Quantum Miner</span>
          <span className="text-[10px] text-[#9AA6B2]">PoQW Lattice Sieving</span>
        </button>

        <button
          onClick={() => setActiveTab('bridge')}
          className="p-3.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF]/60 hover:bg-[#00A8FF]/10 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-[#00A8FF]/15 text-[#00A8FF] group-hover:scale-110 transition-transform">
            <GitFork className="w-5 h-5" />
          </div>
          <span className="font-tech text-xs font-bold text-[#F5F7FA]">Multi-Chain Bridge</span>
          <span className="text-[10px] text-[#9AA6B2]">USDC / ETH / Solana</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className="p-3.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
            <FileCode2 className="w-5 h-5" />
          </div>
          <span className="font-tech text-xs font-bold text-[#F5F7FA]">Deploy VM</span>
          <span className="text-[10px] text-[#9AA6B2]">Q-WASM Contracts</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className="col-span-2 sm:col-span-1 p-3.5 rounded-xl glass-lvl-2 border border-white/10 hover:border-yellow-500/60 hover:bg-yellow-500/10 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-yellow-500/15 text-yellow-400 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-tech text-xs font-bold text-[#F5F7FA]">AI Intel</span>
          <span className="text-[10px] text-[#9AA6B2]">Gemini 3.8 Flash</span>
        </button>
      </div>

      {/* Shard Topology Section */}
      <GlassCard level={2} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-tech text-[#F5F7FA] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00A8FF]" />
              GXQ Quantum Sharding Fabric
            </h2>
            <p className="text-xs text-[#9AA6B2]">
              Concurrent execution domains with post-quantum cross-shard routing proofs.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('control_plane')}
            className="text-xs font-tech text-[#00A8FF] hover:underline flex items-center gap-1"
          >
            Shard Telemetry <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {shards.map((shard) => (
            <div
              key={shard.id}
              className="p-4 rounded-xl glass-lvl-1 border border-white/5 hover:border-[#00A8FF]/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-tech font-bold text-xs text-[#F5F7FA]">{shard.name}</span>
                <StatusBadge status={shard.status} label={shard.status === 'HIGH_THROUGHPUT' ? 'HIGH LOAD' : 'NOMINAL'} />
              </div>
              <p className="text-[11px] text-[#9AA6B2] line-clamp-2">{shard.description}</p>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9AA6B2]">Throughput</span>
                  <span className="font-tech text-[#00A8FF] font-semibold">{shard.tps.toLocaleString()} TPS</span>
                </div>
                {/* Load Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      shard.loadPercent > 70 ? 'bg-[#FF7A00]' : 'bg-[#00A8FF]'
                    }`}
                    style={{ width: `${shard.loadPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#66717D]">
                  <span>Load: {shard.loadPercent}%</span>
                  <span>Cross-Shard Queue: {shard.crossShardQueue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Dual Feed: Real-time Blocks and Verified Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quantum Blocks */}
        <GlassCard level={2} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#00A8FF]" />
              <h3 className="font-tech font-bold text-sm sm:text-base text-[#F5F7FA]">
                Latest Quantum Blocks
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('explorer')}
              className="text-xs text-[#00A8FF] font-tech hover:underline flex items-center gap-1"
            >
              All Blocks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {blocks.slice(0, 5).map((block) => (
              <div
                key={block.height}
                onClick={() => setSelectedBlock(block)}
                className="p-3 rounded-xl glass-lvl-1 border border-white/5 hover:border-[#00A8FF]/40 hover:bg-white/[0.02] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00A8FF]/10 text-[#00A8FF] flex items-center justify-center font-tech font-bold text-xs group-hover:scale-105 transition-transform">
                    #{block.height.toString().slice(-4)}
                  </div>
                  <div>
                    <div className="font-tech text-xs font-semibold text-[#F5F7FA]">
                      Block #{block.height.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#9AA6B2] font-mono">
                      Shard-{block.shardId} • {block.transactionsCount} txs • {block.hash.slice(0, 14)}...
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-tech font-bold text-[#00A8FF]">
                    +{block.rewardGXQ} GXQ
                  </div>
                  <div className="text-[10px] text-[#66717D]">
                    {Math.max(1, Math.floor((Date.now() - block.timestamp) / 1000))}s ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard level={2} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="font-tech font-bold text-sm sm:text-base text-[#F5F7FA]">
                Verified Quantum Transactions
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('explorer')}
              className="text-xs text-[#00A8FF] font-tech hover:underline flex items-center gap-1"
            >
              All Txs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.hash}
                onClick={() => setSelectedTx(tx)}
                className="p-3 rounded-xl glass-lvl-1 border border-white/5 hover:border-[#FF7A00]/40 hover:bg-white/[0.02] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center font-tech font-bold text-xs group-hover:scale-105 transition-transform">
                    {tx.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-mono text-xs font-semibold text-[#F5F7FA]">
                      {tx.hash.slice(0, 16)}...
                    </div>
                    <div className="text-[11px] text-[#9AA6B2] flex items-center gap-1">
                      <span>From {tx.from.slice(0, 6)}...</span>
                      <span>→</span>
                      <span>To {tx.to.slice(0, 6)}...</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-tech font-bold text-[#F5F7FA]">
                    {tx.value.toLocaleString()} {tx.symbol}
                  </div>
                  <div className="text-[10px] text-[#00A8FF] flex items-center gap-1 justify-end font-mono">
                    <ShieldCheck className="w-3 h-3 text-[#00A8FF]" /> Dilithium
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Block Inspector Modal */}
      <Modal
        isOpen={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        title={`Quantum Block #${selectedBlock?.height}`}
        subtitle="Cryptographically verified lattice state header"
      >
        {selectedBlock && (
          <div className="space-y-4 text-xs font-tech">
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-[#9AA6B2]">BLOCK HASH:</div>
              <div className="font-mono break-all text-[#00A8FF] bg-[#030507] p-2 rounded">
                {selectedBlock.hash}
              </div>

              <div className="text-[#9AA6B2] pt-2">DILITHIUM POST-QUANTUM ROOT:</div>
              <div className="font-mono break-all text-[#F5F7FA] bg-[#030507] p-2 rounded">
                {selectedBlock.dilithiumRoot}
              </div>

              <div className="text-[#9AA6B2] pt-2">STATE MERKLE ROOT:</div>
              <div className="font-mono break-all text-emerald-400 bg-[#030507] p-2 rounded">
                {selectedBlock.stateRoot}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Shard Domain:</span>
                <div className="font-bold text-[#F5F7FA] mt-1">Shard-{selectedBlock.shardId}</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Proposer Node:</span>
                <div className="font-mono text-[#00A8FF] mt-1 truncate">{selectedBlock.proposer}</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Gas Consumed:</span>
                <div className="font-bold text-[#F5F7FA] mt-1">
                  {selectedBlock.gasUsed.toLocaleString()} / {selectedBlock.gasLimit.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Quantum Nonce:</span>
                <div className="font-mono text-[#FF7A00] mt-1">{selectedBlock.quantumNonce}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Transaction Inspector Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Proof Receipt"
        subtitle="Post-quantum Dilithium-5 digital signature attestation"
      >
        {selectedTx && (
          <div className="space-y-4 text-xs font-tech">
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-[#9AA6B2]">TRANSACTION HASH:</div>
              <div className="font-mono break-all text-[#00A8FF] bg-[#030507] p-2 rounded">
                {selectedTx.hash}
              </div>

              <div className="text-[#9AA6B2] pt-2">DILITHIUM-5 SIGNATURE:</div>
              <div className="font-mono break-all text-purple-400 bg-[#030507] p-2 rounded">
                {selectedTx.quantumSignature}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Transferred Value:</span>
                <div className="text-base font-bold text-[#F5F7FA] mt-1">
                  {selectedTx.value} {selectedTx.symbol}
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">L1 Gas Fee:</span>
                <div className="font-bold text-[#00A8FF] mt-1">
                  {selectedTx.gasFee} GXQ
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Execution Shard:</span>
                <div className="font-bold text-[#F5F7FA] mt-1">Shard-{selectedTx.shardId}</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Security Standard:</span>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NIST PQC Approved
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
