import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Network,
  Cpu,
  Layers,
  GitFork,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  Server,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ArchitectureNode {
  id: string;
  name: string;
  layer: 'CONSENSUS' | 'SHARDING' | 'BRIDGE' | 'SERVICES' | 'CACHE_API';
  status: 'ONLINE' | 'ACTIVE' | 'SECURED';
  throughput: string;
  latency: string;
  cryptoProtocol: string;
  description: string;
  connections: string[];
}

export const ArchitectureView: React.FC = () => {
  const { setActiveTab } = useGXQ();

  const [selectedLayer, setSelectedLayer] = useState<'ALL' | 'CONSENSUS' | 'SHARDING' | 'BRIDGE' | 'SERVICES' | 'CACHE_API'>('ALL');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isDataFlowActive, setIsDataFlowActive] = useState(true);

  const nodes: ArchitectureNode[] = [
    // Layer 1: Core Quantum Consensus
    {
      id: 'quantum-core',
      name: 'GXQ Quantum Consensus Engine',
      layer: 'CONSENSUS',
      status: 'SECURED',
      throughput: '38,400 Peak TPS',
      latency: '1.2s Finality',
      cryptoProtocol: 'Proof-of-Quantum-Work + Lattice PBFT',
      description: 'The foundation layer orchestrating polynomial lattice sieving, beacon state trie, and validator slashing watchdog.',
      connections: ['shard-0', 'shard-1', 'shard-2', 'shard-3', 'mining-nodes']
    },
    {
      id: 'mining-nodes',
      name: 'PoQW Mining Lattice Mesh',
      layer: 'CONSENSUS',
      status: 'ACTIVE',
      throughput: '42.8 kH/s',
      latency: 'Sub-second solves',
      cryptoProtocol: 'CRYSTALS-Dilithium-5 + SHA-256',
      description: 'Decentralized mining nodes solving shortest-vector lattice challenges to mint new blocks (+2.5 GXQ reward).',
      connections: ['quantum-core']
    },

    // Layer 2: Sharding Partitions
    {
      id: 'shard-0',
      name: 'Shard-0: Prime Settlement',
      layer: 'SHARDING',
      status: 'ONLINE',
      throughput: '3,120 TPS',
      latency: '1.1s',
      cryptoProtocol: 'Global Lattice Merkle Trie',
      description: 'Root anchor partition maintaining post-quantum balance states, validator registry, and cross-shard atomic proofs.',
      connections: ['shard-1', 'shard-2', 'shard-3', 'db-cache']
    },
    {
      id: 'shard-1',
      name: 'Shard-1: High-Frequency DeFi & DEX',
      layer: 'SHARDING',
      status: 'ONLINE',
      throughput: '6,840 TPS',
      latency: '450ms',
      cryptoProtocol: 'Constant Product AMM (x * y = k)',
      description: 'Dedicated high-speed financial execution domain hosting atomic swaps, ETH parity liquidity pools, and order matching.',
      connections: ['shard-0', 'dex-swap', 'db-cache']
    },
    {
      id: 'shard-2',
      name: 'Shard-2: Enterprise Privacy & ZKP',
      layer: 'SHARDING',
      status: 'ONLINE',
      throughput: '2,940 TPS',
      latency: '1.4s',
      cryptoProtocol: 'Post-Quantum STARKs',
      description: 'Confidential zero-knowledge computing environment for institutional settlement, private token transfers, and audit logs.',
      connections: ['shard-0', 'enterprise-hub', 'db-cache']
    },
    {
      id: 'shard-3',
      name: 'Shard-3: Cross-Chain Gateway & Bridge',
      layer: 'SHARDING',
      status: 'ONLINE',
      throughput: '2,190 TPS',
      latency: '1.8s',
      cryptoProtocol: 'Dilithium Relayer Attestation (7/7)',
      description: 'Cryptographic ingress and egress portal communicating with external blockchains and verifying cross-chain Merkle roots.',
      connections: ['shard-0', 'multichain-bridge', 'usdc-vault', 'db-cache']
    },

    // Layer 3: Multichain Bridge & External
    {
      id: 'multichain-bridge',
      name: 'Universal Multi-Chain Relayer Bridge',
      layer: 'BRIDGE',
      status: 'ACTIVE',
      throughput: '1,200 Cross-Chain Tx/h',
      latency: '&lt; 3.5s Relayed',
      cryptoProtocol: '7/7 Multisig Threshold PQC Proof',
      description: 'Bridges assets across Ethereum L1, Arbitrum One, Solana, Polygon, and BNB Smart Chain with zero-custody atomic guarantees.',
      connections: ['shard-3', 'usdc-vault', 'api-sdk']
    },
    {
      id: 'usdc-vault',
      name: 'USDC Universal Ingress Vault',
      layer: 'BRIDGE',
      status: 'SECURED',
      throughput: '$32M+ TVL Reserve',
      latency: 'Instant Lock/Mint',
      cryptoProtocol: 'ERC-20 & SPL Wrapped Dilithium Token',
      description: 'Allows anyone to bridge native USDC from any blockchain into GXQ Shard-1 liquidity pools and Launchpad offerings.',
      connections: ['multichain-bridge', 'launchpad-core', 'dex-swap']
    },

    // Layer 4: Developer SDK, API & Cache
    {
      id: 'db-cache',
      name: 'Quantum L1/L2 High-Speed DB Cache',
      layer: 'CACHE_API',
      status: 'ONLINE',
      throughput: '97.1% Hit Ratio',
      latency: '&lt; 3ms Query Time',
      cryptoProtocol: 'In-Memory LRU + State Trie Buffer',
      description: 'High-performance cache layer caching verified blocks, transaction proofs, and shard state roots to power the Explorer.',
      connections: ['api-sdk', 'block-explorer', 'control-plane']
    },
    {
      id: 'api-sdk',
      name: 'Enterprise API & Multi-Language SDK',
      layer: 'CACHE_API',
      status: 'ONLINE',
      throughput: 'High Concurrency REST/RPC',
      latency: '12ms Response',
      cryptoProtocol: 'Dilithium JSON-RPC / gRPC / REST',
      description: 'Official developer interface providing TypeScript, Python, Go, and cURL libraries for seamless dApp building.',
      connections: ['control-plane', 'smart-contracts-vm', 'ai-intel']
    },

    // Layer 5: User Applications & Services
    {
      id: 'dex-swap',
      name: 'Quantum AMM Swap Protocol',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: '14.8% APR Pool Yield',
      latency: 'Atomic Settlement',
      cryptoProtocol: 'Zero-MEV Front-Running Shield',
      description: 'Decentralized exchange with tight parity to Ethereum ($3,465+), zero slippage routing, and LP fee distribution.',
      connections: ['shard-1', 'usdc-vault']
    },
    {
      id: 'smart-contracts-vm',
      name: 'Q-WASM Virtual Machine & Deployment Studio',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: 'Deterministic Bytecode VM',
      latency: 'Sub-second Call Exec',
      cryptoProtocol: 'Memory-Safe Formal Verification',
      description: 'Executes smart contracts in WebAssembly with prebuilt templates for QRC-20 tokens, Escrows, and Staking Vaults.',
      connections: ['quantum-core', 'api-sdk']
    },
    {
      id: 'launchpad-core',
      name: 'Tokens Launchpad — Enterprise Edition',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: '$303M Raised',
      latency: 'Instant Token Alloc',
      cryptoProtocol: 'Vesting Vaults + Dilithium Audit',
      description: 'Decentralized token launch platform for enterprise offerings with built-in USDC bridging, KYC, and vesting schedules.',
      connections: ['usdc-vault', 'shard-1']
    },
    {
      id: 'block-explorer',
      name: 'Quantum Blockchain Explorer',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: 'Real-time Ledger Sync',
      latency: 'Live Tick Feed',
      cryptoProtocol: 'Cryptographic Proof Validator',
      description: 'Interactive explorer for searching blocks, Dilithium signatures, validator quorum nodes, and state transitions.',
      connections: ['db-cache']
    },
    {
      id: 'control-plane',
      name: 'Control Plane Administration Dashboard',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: '128 Validator Metrics',
      latency: 'Real-time Telemetry',
      cryptoProtocol: 'Immutable Audit Correlation Hash',
      description: 'Central executive administration dashboard monitoring shard loads, mempool health, peer gossip, and consensus parameters.',
      connections: ['api-sdk', 'db-cache']
    },
    {
      id: 'ai-intel',
      name: 'Autonomous AI Intelligence Center',
      layer: 'SERVICES',
      status: 'ONLINE',
      throughput: 'Gemini 3.8 Flash Core',
      latency: 'Structured Reasoning',
      cryptoProtocol: 'Server-Side Secure Gemini Proxy',
      description: 'Autonomous AI analysts auditing contracts, assessing multi-shard risk, and evaluating portfolio health.',
      connections: ['api-sdk', 'control-plane']
    }
  ];

  const filteredNodes = selectedLayer === 'ALL'
    ? nodes
    : nodes.filter(n => n.layer === selectedLayer);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Network className="w-7 h-7 text-[#00A8FF]" />
            GXQ Network Architecture Diagram & Topology
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Visual map of quantum consensus, 4-shard execution fabric, multichain bridges, DB cache, and user services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDataFlowActive(!isDataFlowActive)}
            className={`px-3.5 py-2 rounded-xl font-tech text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isDataFlowActive
                ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40 shadow-[0_0_15px_rgba(0,168,255,0.3)]'
                : 'glass-lvl-2 text-[#9AA6B2] border border-white/10'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isDataFlowActive ? 'animate-pulse text-[#00A8FF]' : ''}`} />
            {isDataFlowActive ? 'PACKET FLOW ACTIVE' : 'PACKET FLOW PAUSED'}
          </button>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-tech text-xs pb-1">
        {[
          { id: 'ALL', label: 'Complete Ecosystem' },
          { id: 'CONSENSUS', label: '1. Quantum Consensus & Mining' },
          { id: 'SHARDING', label: '2. Multi-Shard Fabric' },
          { id: 'BRIDGE', label: '3. Multichain Bridge & USDC' },
          { id: 'CACHE_API', label: '4. API SDK & DB Cache' },
          { id: 'SERVICES', label: '5. dApps & Admin Control' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedLayer(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedLayer === tab.id
                ? 'bg-[#00A8FF] text-[#030507] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                : 'glass-lvl-2 border border-white/5 text-[#9AA6B2] hover:text-[#F5F7FA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Architecture Canvas */}
      <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-8 relative overflow-hidden">
        {/* Visual Background Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Section 1: Core Consensus & Sharding Backbone */}
        {(selectedLayer === 'ALL' || selectedLayer === 'CONSENSUS' || selectedLayer === 'SHARDING') && (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-tech font-bold text-[#00A8FF] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> CORE QUANTUM CONSENSUS & MULTI-SHARD PARALLEL FABRIC
              </span>
              <span className="text-[11px] text-[#66717D] font-mono">14,280 TPS • 1.2s Finality</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {nodes
                .filter(n => n.layer === 'CONSENSUS' || n.layer === 'SHARDING')
                .map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-4 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF] hover:scale-[1.02] transition-all cursor-pointer group space-y-3 relative overflow-hidden"
                  >
                    {isDataFlowActive && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00A8FF] to-transparent animate-pulse" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-xs text-[#F5F7FA] group-hover:text-[#00A8FF] transition-colors">
                        {node.name}
                      </span>
                      <StatusBadge status={node.status} label={node.status} />
                    </div>

                    <p className="text-[11px] text-[#9AA6B2] line-clamp-2">{node.description}</p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#00A8FF]">{node.throughput}</span>
                      <span className="text-[#66717D]">{node.latency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Section 2: Multichain Bridge & USDC Gateway */}
        {(selectedLayer === 'ALL' || selectedLayer === 'BRIDGE') && (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-tech font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <GitFork className="w-4 h-4" /> MULTICHAIN RELAYER BRIDGES & CROSS-SHARD ROUTING MESH
              </span>
              <span className="text-[11px] text-[#66717D] font-mono">Ethereum • Arbitrum • Solana • Polygon • BSC</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes
                .filter(n => n.layer === 'BRIDGE')
                .map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-5 rounded-xl glass-lvl-2 border border-emerald-500/20 hover:border-emerald-400 hover:scale-[1.01] transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-sm text-[#F5F7FA]">{node.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-tech font-bold border border-emerald-500/30">
                        CROSS-CHAIN INGRESS
                      </span>
                    </div>
                    <p className="text-xs text-[#9AA6B2]">{node.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                      <span className="text-emerald-400">{node.throughput}</span>
                      <span className="text-[#66717D]">{node.cryptoProtocol}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Section 3: API SDK & DB Cache Integration Interface */}
        {(selectedLayer === 'ALL' || selectedLayer === 'CACHE_API') && (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-tech font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4" /> QUANTUM L1/L2 DB CACHE & HIGH-THROUGHPUT DEVELOPER SDK
              </span>
              <span className="text-[11px] text-[#66717D] font-mono">In-Memory LRU &lt; 3ms • TypeScript • Python • Go</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes
                .filter(n => n.layer === 'CACHE_API')
                .map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-5 rounded-xl glass-lvl-2 border border-purple-500/20 hover:border-purple-400 hover:scale-[1.01] transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-sm text-[#F5F7FA]">{node.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-tech font-bold border border-purple-500/30">
                        DEVELOPER MESH
                      </span>
                    </div>
                    <p className="text-xs text-[#9AA6B2]">{node.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                      <span className="text-purple-300 font-bold">{node.throughput}</span>
                      <span className="text-[#66717D]">{node.latency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Section 4: User-Facing Applications & Administration Control */}
        {(selectedLayer === 'ALL' || selectedLayer === 'SERVICES') && (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-tech font-bold text-[#FF7A00] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> USER-FACING APPLICATION PROTOCOLS & CONTROL PLANE
              </span>
              <span className="text-[11px] text-[#66717D] font-mono">DEX • VM • Launchpad • Explorer • Gemini AI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes
                .filter(n => n.layer === 'SERVICES')
                .map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-4 rounded-xl glass-lvl-1 border border-white/10 hover:border-[#FF7A00]/60 hover:bg-[#FF7A00]/5 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-xs text-[#F5F7FA] group-hover:text-[#FF7A00] transition-colors">
                        {node.name}
                      </span>
                      <StatusBadge status="ACTIVE" label="ONLINE" />
                    </div>
                    <p className="text-[11px] text-[#9AA6B2] line-clamp-2">{node.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/5 text-[#FF7A00]">
                      <span>{node.throughput}</span>
                      <span className="text-[#66717D]">{node.latency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Node Drill-Down Inspector Modal */}
      <Modal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.name || 'Architecture Component Details'}
        subtitle="Deep cryptographic specification and cross-shard communication protocol"
      >
        {selectedNode && (
          <div className="space-y-5 text-xs font-tech">
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-[#9AA6B2]">FUNCTIONAL ARCHITECTURE:</div>
              <p className="text-sm text-[#F5F7FA] leading-relaxed font-sans">
                {selectedNode.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5 space-y-1">
                <span className="text-[#9AA6B2]">Operating Layer:</span>
                <div className="font-bold text-[#00A8FF]">{selectedNode.layer}</div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5 space-y-1">
                <span className="text-[#9AA6B2]">Cryptographic Protocol:</span>
                <div className="font-bold text-emerald-400 truncate">{selectedNode.cryptoProtocol}</div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5 space-y-1">
                <span className="text-[#9AA6B2]">Throughput Capacity:</span>
                <div className="font-bold text-[#F5F7FA]">{selectedNode.throughput}</div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-2 border border-white/5 space-y-1">
                <span className="text-[#9AA6B2]">Confirmation Latency:</span>
                <div className="font-bold text-[#FF7A00]">{selectedNode.latency}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-[#9AA6B2]">CONNECTED MESH ENDPOINTS:</div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.connections.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[#00A8FF]"
                  >
                    ⇄ {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-3 rounded-xl bg-[#00A8FF] text-[#030507] font-bold hover:brightness-110 cursor-pointer"
            >
              CLOSE COMPONENT SPECIFICATION
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
