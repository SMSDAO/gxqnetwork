import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Search,
  Compass,
  Boxes,
  Activity,
  ShieldCheck,
  Server,
  Layers,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  User,
  GitFork,
  ArrowDownUp,
  DollarSign
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { QuantumBlock, QuantumTransaction } from '../../types/blockchain';

export const ExplorerView: React.FC = () => {
  const { blocks, transactions, validators, shards, market, addToast } = useGXQ();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'blocks' | 'transactions' | 'transfers' | 'validators' | 'shards'>('blocks');
  const [selectedBlock, setSelectedBlock] = useState<QuantumBlock | null>(null);
  const [selectedTx, setSelectedTx] = useState<QuantumTransaction | null>(null);
  const [inspectedAddress, setInspectedAddress] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const gxqTicker = market.tickers.GXQ;
  const ethTicker = market.tickers.ETH;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    addToast('Copied to Clipboard', label, 'info');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filtered lists based on search
  const filteredBlocks = blocks.filter(b => 
    b.height.toString().includes(searchQuery) ||
    b.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.proposer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTxs = transactions.filter(t =>
    t.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tokenTransfers = filteredTxs.filter(t => t.symbol === 'GXQ' || t.symbol === 'USDC');

  return (
    <div className="space-y-6 pb-12">
      {/* Explorer Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-[#00A8FF]" />
            Quantum Blockchain Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Real-time ledger transparency, Dilithium-5 lattice proofs, and multi-shard state roots.
          </p>
        </div>

        {/* Global Explorer Search Bar */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#9AA6B2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Block, Tx Hash, Address, Shard..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-lvl-2 border border-white/10 text-xs text-[#F5F7FA] placeholder-[#66717D] focus:outline-none focus:border-[#00A8FF] transition-all font-mono"
          />
        </div>
      </div>

      {/* Network Overview Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-tech text-xs">
        <GlassCard level={2} className="p-3.5 space-y-1">
          <div className="text-[10px] text-[#9AA6B2] uppercase">GXQ PRICE (ETH PEG)</div>
          <div className="text-lg font-bold text-[#F5F7FA]">
            ${gxqTicker?.price ? gxqTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '3,465.80'}
          </div>
          <div className="text-[10px] text-[#00A8FF] font-semibold">1:1 Parity Benchmark</div>
        </GlassCard>

        <GlassCard level={2} className="p-3.5 space-y-1">
          <div className="text-[10px] text-[#9AA6B2] uppercase">TOTAL SUPPLY</div>
          <div className="text-lg font-bold text-[#F5F7FA]">120,450,000</div>
          <div className="text-[10px] text-[#66717D]">Matched to ETH Supply</div>
        </GlassCard>

        <GlassCard level={2} className="p-3.5 space-y-1">
          <div className="text-[10px] text-[#9AA6B2] uppercase">CIRCULATING SUPPLY</div>
          <div className="text-lg font-bold text-[#00A8FF]">78,210,500 GXQ</div>
          <div className="text-[10px] text-emerald-400">64.9% Ratio</div>
        </GlassCard>

        <GlassCard level={2} className="p-3.5 space-y-1">
          <div className="text-[10px] text-[#9AA6B2] uppercase">MINING DIFFICULTY</div>
          <div className="text-lg font-bold text-[#FF7A00]">0x0000Q_LAT</div>
          <div className="text-[10px] text-[#66717D]">Lattice Sieving Ring</div>
        </GlassCard>

        <GlassCard level={2} className="col-span-2 sm:col-span-1 p-3.5 space-y-1">
          <div className="text-[10px] text-[#9AA6B2] uppercase">AVERAGE GAS FEE</div>
          <div className="text-lg font-bold text-emerald-400">0.00018 GXQ</div>
          <div className="text-[10px] text-[#00A8FF]">~$0.62 per execution</div>
        </GlassCard>
      </div>

      {/* Explorer Subtabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar font-tech">
        <button
          onClick={() => setActiveSubTab('blocks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'blocks'
              ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]'
              : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Quantum Blocks ({blocks.length})
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'transactions'
              ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]'
              : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" />
          Transactions ({transactions.length})
        </button>

        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'transfers'
              ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]'
              : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
          }`}
        >
          <ArrowDownUp className="w-4 h-4" />
          Token Transfers (GXQ & USDC)
        </button>

        <button
          onClick={() => setActiveSubTab('validators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'validators'
              ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]'
              : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
          }`}
        >
          <Server className="w-4 h-4" />
          Validators Quorum ({validators.length})
        </button>

        <button
          onClick={() => setActiveSubTab('shards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'shards'
              ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]'
              : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          Shard Partitions ({shards.length})
        </button>
      </div>

      {/* Subtab Content: Blocks */}
      {activeSubTab === 'blocks' && (
        <GlassCard level={2} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-tech">
              <thead className="bg-[#030507]/60 text-[#9AA6B2] border-b border-white/10 uppercase">
                <tr>
                  <th className="py-3 px-4">Height</th>
                  <th className="py-3 px-4">Shard</th>
                  <th className="py-3 px-4">Block Hash</th>
                  <th className="py-3 px-4">Proposer</th>
                  <th className="py-3 px-4">Tx Count</th>
                  <th className="py-3 px-4">Gas Consumed</th>
                  <th className="py-3 px-4">Security</th>
                  <th className="py-3 px-4 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBlocks.map((block) => (
                  <tr
                    key={block.height}
                    onClick={() => setSelectedBlock(block)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-[#00A8FF]">
                      #{block.height.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                        Shard-{block.shardId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F5F7FA]">
                      {block.hash.slice(0, 16)}...
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedAddress(block.proposer);
                      }}
                      className="py-3 px-4 font-mono text-[#9AA6B2] hover:text-[#00A8FF] hover:underline"
                    >
                      {block.proposer.slice(0, 10)}...
                    </td>
                    <td className="py-3 px-4 text-[#F5F7FA]">{block.transactionsCount}</td>
                    <td className="py-3 px-4 text-[#9AA6B2] font-mono">
                      {block.gasUsed.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] text-[#00A8FF] flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3 h-3 text-[#00A8FF]" /> Dilithium-5
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#66717D]">
                      {Math.max(1, Math.floor((Date.now() - block.timestamp) / 1000))}s ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Subtab Content: Transactions */}
      {activeSubTab === 'transactions' && (
        <GlassCard level={2} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-tech">
              <thead className="bg-[#030507]/60 text-[#9AA6B2] border-b border-white/10 uppercase">
                <tr>
                  <th className="py-3 px-4">Tx Hash</th>
                  <th className="py-3 px-4">Shard</th>
                  <th className="py-3 px-4">From</th>
                  <th className="py-3 px-4">To</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Gas Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTxs.map((tx) => (
                  <tr
                    key={tx.hash}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#00A8FF]">
                      {tx.hash.slice(0, 14)}...
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                        Shard-{tx.shardId} {tx.isCrossShard ? '⇄ S-' + tx.targetShardId : ''}
                      </span>
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedAddress(tx.from);
                      }}
                      className="py-3 px-4 font-mono text-[#9AA6B2] hover:text-[#00A8FF] hover:underline"
                    >
                      {tx.from.slice(0, 8)}...
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedAddress(tx.to);
                      }}
                      className="py-3 px-4 font-mono text-[#9AA6B2] hover:text-[#00A8FF] hover:underline"
                    >
                      {tx.to.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-bold text-[#F5F7FA]">
                      {tx.value.toLocaleString()} {tx.symbol}
                    </td>
                    <td className="py-3 px-4 text-[#9AA6B2] font-mono">{tx.gasFee} GXQ</td>
                    <td className="py-3 px-4">
                      <StatusBadge status="SUCCESS" label="VERIFIED" />
                    </td>
                    <td className="py-3 px-4 text-right text-[#66717D]">
                      {Math.max(1, Math.floor((Date.now() - tx.timestamp) / 1000))}s ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Subtab Content: Visualized Token Transfers (Main GXQ & Bridged USDC) */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl glass-lvl-2 border border-white/10 flex items-center justify-between text-xs font-tech">
            <span className="text-[#9AA6B2]">
              VISUALIZING TOKEN FLOWS: <strong className="text-[#00A8FF]">Main GXQ Native</strong> and <strong className="text-emerald-400">Bridged USDC Gateway</strong>
            </span>
            <span className="text-xs text-[#00A8FF] font-mono">Atomic Zero-Frontrunning Mesh</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokenTransfers.map((tx) => (
              <GlassCard
                key={tx.hash}
                level={2}
                onClick={() => setSelectedTx(tx)}
                className="p-5 space-y-3 hover:border-[#00A8FF]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-tech font-bold text-xs ${tx.symbol === 'GXQ' ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                      ${tx.symbol}
                    </span>
                    <span className="font-mono text-xs text-[#F5F7FA] font-bold">
                      {tx.value.toLocaleString()} {tx.symbol}
                    </span>
                  </div>
                  <StatusBadge status="SUCCESS" label="DILITHIUM-5" />
                </div>

                {/* Transfer Pathway Diagram */}
                <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="text-left">
                    <span className="text-[10px] text-[#66717D] block">SENDER</span>
                    <span className="text-[#9AA6B2]">{tx.from.slice(0, 10)}...</span>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[9px] text-[#00A8FF] font-tech uppercase">
                      Shard-{tx.shardId} {tx.isCrossShard ? '⇄ S-' + tx.targetShardId : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#00A8FF] my-0.5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#66717D] block">RECEIVER</span>
                    <span className="text-[#F5F7FA]">{tx.to.slice(0, 10)}...</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#66717D] pt-1">
                  <span>Tx: {tx.hash.slice(0, 16)}...</span>
                  <span>{Math.max(1, Math.floor((Date.now() - tx.timestamp) / 1000))}s ago</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Subtab Content: Validators */}
      {activeSubTab === 'validators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {validators.map((val) => (
            <GlassCard key={val.id} level={2} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs font-bold text-[#F5F7FA]">{val.name}</span>
                <StatusBadge status={val.status} />
              </div>
              <div
                onClick={() => setInspectedAddress(val.address)}
                className="text-[11px] font-mono text-[#9AA6B2] hover:text-[#00A8FF] hover:underline cursor-pointer truncate"
              >
                {val.address}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                <div>
                  <span className="text-[#66717D] text-[10px]">STAKED:</span>
                  <div className="font-tech font-bold text-[#00A8FF]">
                    {val.stakedGXQ.toLocaleString()} GXQ
                  </div>
                </div>
                <div>
                  <span className="text-[#66717D] text-[10px]">UPTIME:</span>
                  <div className="font-tech font-bold text-emerald-400">{val.uptimePercent}%</div>
                </div>
                <div>
                  <span className="text-[#66717D] text-[10px]">LATENCY:</span>
                  <div className="font-tech text-[#F5F7FA]">{val.latencyMs} ms</div>
                </div>
                <div>
                  <span className="text-[#66717D] text-[10px]">PROPOSED:</span>
                  <div className="font-tech text-[#F5F7FA]">{val.totalBlocksProposed} blocks</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Subtab Content: Shards */}
      {activeSubTab === 'shards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shards.map((shard) => (
            <GlassCard key={shard.id} level={2} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-tech font-bold text-base text-[#F5F7FA]">{shard.name}</h3>
                  <p className="text-xs text-[#9AA6B2]">{shard.description}</p>
                </div>
                <StatusBadge status={shard.status} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9AA6B2]">Throughput</span>
                  <span className="font-tech font-bold text-[#00A8FF]">{shard.tps.toLocaleString()} / {shard.capacityTps.toLocaleString()} TPS</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00A8FF] to-[#008CFF] rounded-full"
                    style={{ width: `${shard.loadPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center border-t border-white/5 pt-3">
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-[#66717D]">Active Nodes</span>
                  <div className="font-tech font-bold text-[#F5F7FA]">{shard.activeNodes}</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-[#66717D]">Current Load</span>
                  <div className="font-tech font-bold text-[#00A8FF]">{shard.loadPercent}%</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-[#66717D]">Cross-Shard Q</span>
                  <div className="font-tech font-bold text-[#FF7A00]">{shard.crossShardQueue}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

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
              <div className="flex items-center justify-between text-[#9AA6B2]">
                <span>BLOCK HASH:</span>
                <button
                  onClick={() => copyToClipboard(selectedBlock.hash, 'Block Hash')}
                  className="text-[#00A8FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Shard Domain:</span>
                <div className="font-bold text-[#F5F7FA] mt-1">Shard-{selectedBlock.shardId}</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Proposer Node:</span>
                <div
                  onClick={() => setInspectedAddress(selectedBlock.proposer)}
                  className="font-mono text-[#00A8FF] mt-1 truncate hover:underline cursor-pointer"
                >
                  {selectedBlock.proposer}
                </div>
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

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Proof & Dilithium Signature"
        subtitle="Post-quantum authenticated atomic state change"
      >
        {selectedTx && (
          <div className="space-y-4 text-xs font-tech">
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#9AA6B2]">
                <span>TRANSACTION HASH:</span>
                <button
                  onClick={() => copyToClipboard(selectedTx.hash, 'Transaction Hash')}
                  className="text-[#00A8FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="font-mono break-all text-[#00A8FF] bg-[#030507] p-2 rounded">
                {selectedTx.hash}
              </div>

              <div className="text-[#9AA6B2] pt-2">CRYSTALS-DILITHIUM-5 SIGNATURE:</div>
              <div className="font-mono break-all text-purple-400 bg-[#030507] p-2 rounded">
                {selectedTx.quantumSignature}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Transferred Amount:</span>
                <div className="text-base font-bold text-[#F5F7FA] mt-1">
                  {selectedTx.value} {selectedTx.symbol}
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Gas Burn:</span>
                <div className="font-bold text-[#00A8FF] mt-1">
                  {selectedTx.gasFee} GXQ
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">From Address:</span>
                <div
                  onClick={() => setInspectedAddress(selectedTx.from)}
                  className="font-mono text-[#00A8FF] mt-1 truncate hover:underline cursor-pointer"
                >
                  {selectedTx.from}
                </div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">To Address:</span>
                <div
                  onClick={() => setInspectedAddress(selectedTx.to)}
                  className="font-mono text-[#00A8FF] mt-1 truncate hover:underline cursor-pointer"
                >
                  {selectedTx.to}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Address Profile Inspector Modal */}
      <Modal
        isOpen={!!inspectedAddress}
        onClose={() => setInspectedAddress(null)}
        title="Quantum Address Profile"
        subtitle="On-chain balance state, Dilithium keys, and execution history"
      >
        {inspectedAddress && (
          <div className="space-y-4 text-xs font-tech">
            <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#9AA6B2]">
                <span>DILITHIUM-5 PUBLIC ADDRESS:</span>
                <button
                  onClick={() => copyToClipboard(inspectedAddress, 'Address')}
                  className="text-[#00A8FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="font-mono break-all text-[#00A8FF] bg-[#030507] p-2.5 rounded-lg border border-white/5">
                {inspectedAddress}
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NIST Level 5 Lattice Verified
                </span>
                <span className="font-mono text-[#66717D]">Nonce: 48</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Native GXQ Holdings:</span>
                <div className="text-base font-bold text-[#F5F7FA] mt-1">
                  14.850 GXQ
                </div>
                <div className="text-[11px] text-[#00A8FF]">
                  ≈ ${(14.85 * (gxqTicker?.price || 3465.8)).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                </div>
              </div>

              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5">
                <span className="text-[#9AA6B2]">Bridged USDC Balance:</span>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  $12,500.00 USDC
                </div>
                <div className="text-[11px] text-[#66717D]">
                  Cross-Chain Collateral
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <span className="text-[#9AA6B2]">Lattice Public Key Proof:</span>
              <div className="font-mono text-[10px] text-purple-300 break-all bg-[#030507] p-2 rounded">
                0xDLTH5_88fa9018471928374a09182374918237490f8492019482019a8e7d6c5b4
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
