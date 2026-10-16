import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowLeftRight,
  GitFork,
  Rocket,
  Pickaxe,
  ChevronRight
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. GXQ Network Overview', icon: BookOpen },
    { id: 'quantum_crypto', title: '2. Post-Quantum Cryptography', icon: ShieldCheck },
    { id: 'mining_poqw', title: '3. Proof-of-Quantum-Work Mining', icon: Pickaxe },
    { id: 'sharding_bridge', title: '4. Sharding & Cross-Chain Bridge', icon: GitFork },
    { id: 'contracts_vm', title: '5. Q-WASM Smart Contracts VM', icon: Cpu },
    { id: 'faq', title: '6. Frequently Asked Questions', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#00A8FF]" />
            GXQ Network Technical Documentation & User Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Complete architectural master specification, cryptographic primitives, and user workflows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          <GlassCard level={2} className="p-3 space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full p-2.5 rounded-xl font-tech text-xs font-semibold text-left transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40'
                      : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{sec.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8">
          <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-5 leading-relaxed text-xs sm:text-sm text-[#9AA6B2]">
            {activeSection === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  1. GXQ Network Overview
                </h2>
                <p>
                  GXQ Network is an enterprise-grade, high-throughput Layer 1 Quantum Blockchain built with native post-quantum lattice security. It eliminates the existential cryptographic threats posed by quantum computing advancements (such as Shor's algorithm breaking RSA/ECC and Grover's algorithm weakening legacy hashes).
                </p>
                <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2 text-xs">
                  <div className="font-tech font-bold text-[#00A8FF]">Core System Specifications:</div>
                  <ul className="list-disc list-inside space-y-1 text-[#F5F7FA]">
                    <li>Native Main Token: GXQ (pegged to live Ethereum price parity)</li>
                    <li>Total Supply: 120,450,000 GXQ (matching Ethereum's dynamics)</li>
                    <li>Consensus: Proof-of-Quantum-Work (PoQW) + Lattice PBFT</li>
                    <li>Block Confirmation Time: 1.2 Seconds</li>
                    <li>Throughput: 14,280 TPS average (38,400 peak TPS capacity)</li>
                    <li>Partitions: 4 Concurrent High-Speed Shards</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'quantum_crypto' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  2. Post-Quantum Cryptography Primitives
                </h2>
                <p>
                  Every state transition and transaction signature in GXQ Network is enforced with CRYSTALS-Dilithium-5, the leading post-quantum digital signature algorithm standardized by NIST for Level 5 security (256-bit security equivalent).
                </p>
                <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2 text-xs">
                  <div className="font-tech font-bold text-[#00A8FF]">Dilithium Address Derivation:</div>
                  <p className="font-mono text-[#F5F7FA]">
                    24-Word Seed → SHA-256 Entropy → Lattice Polynomial Ring Degree 1024 → Dilithium Keypair → Address: gxq1q...
                  </p>
                </div>
                <p>
                  Unlike standard Secp256k1 keys vulnerable to quantum Shor's discrete logarithm attacks, Dilithium relies on the hardness of lattice-based Short Integer Solution (SIS) and Learning With Errors (LWE) problems in module lattices.
                </p>
              </div>
            )}

            {activeSection === 'mining_poqw' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  3. Proof-of-Quantum-Work Mining
                </h2>
                <p>
                  Traditional Proof-of-Work (PoW) burns raw compute. GXQ's Proof-of-Quantum-Work (PoQW) utilizes lattice-sieving tasks where miners solve polynomial lattice vector shortest-path challenges.
                </p>
                <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2 text-xs">
                  <div className="font-tech font-bold text-[#FF7A00]">Miner Yield Mechanics:</div>
                  <ul className="list-disc list-inside space-y-1 text-[#F5F7FA]">
                    <li>Per-Block Reward: 2.500 GXQ + transaction gas fees</li>
                    <li>QuBit Depth: Configurable from 16 to 128 QuBits</li>
                    <li>Interactive browser lattice rig with zero client software required</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'sharding_bridge' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  4. Sharding Fabric & Cross-Chain Bridge
                </h2>
                <p>
                  GXQ divides state computation across 4 specialized shard partitions:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-tech">
                  <div className="p-3 rounded-lg glass-lvl-1 border border-white/5">
                    <span className="font-bold text-[#00A8FF]">Shard-0: Prime Settlement</span>
                    <p className="text-[11px] text-[#9AA6B2] mt-1">Global state root and consensus beacon.</p>
                  </div>
                  <div className="p-3 rounded-lg glass-lvl-1 border border-white/5">
                    <span className="font-bold text-[#00A8FF]">Shard-1: High-Frequency DeFi</span>
                    <p className="text-[11px] text-[#9AA6B2] mt-1">AMM DEX swap with 6,400 TPS.</p>
                  </div>
                  <div className="p-3 rounded-lg glass-lvl-1 border border-white/5">
                    <span className="font-bold text-[#00A8FF]">Shard-2: Enterprise Privacy</span>
                    <p className="text-[11px] text-[#9AA6B2] mt-1">Zero-knowledge STARK execution.</p>
                  </div>
                  <div className="p-3 rounded-lg glass-lvl-1 border border-white/5">
                    <span className="font-bold text-[#00A8FF]">Shard-3: Cross-Chain Gateway</span>
                    <p className="text-[11px] text-[#9AA6B2] mt-1">Relayer mesh for USDC, ETH, Arbitrum, Solana.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contracts_vm' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  5. Q-WASM Virtual Machine
                </h2>
                <p>
                  GXQ executes WebAssembly-compiled smart contracts with post-quantum memory isolation. Developers can deploy Solidity, Rust, and C++ contracts with standard ABI interfaces.
                </p>
                <p>
                  Built-in templates include QRC-20 Fungible Tokens, Quantum Escrows, and Validator Staking Vaults with 14.8% APY yield.
                </p>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-xl font-tech font-bold text-[#F5F7FA] border-b border-white/10 pb-3">
                  6. Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                    <div className="font-tech font-bold text-[#00A8FF]">How does GXQ match Ethereum price parity?</div>
                    <p className="text-xs text-[#F5F7FA]">
                      GXQ operates with a direct automated arbitrage oracle linked to Ethereum spot feeds and matches Ethereum's circulating supply (~120M), ensuring price parity alignment while providing post-quantum security and 100x lower fees.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                    <div className="font-tech font-bold text-[#00A8FF]">Can I bridge USDC from any chain?</div>
                    <p className="text-xs text-[#F5F7FA]">
                      Yes! Shard-3 supports cross-chain transfers of USDC from Ethereum, Arbitrum, Solana, Polygon, and Binance Smart Chain using 7/7 multi-sig relayer attestation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
