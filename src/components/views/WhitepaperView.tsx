import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  FileText,
  Download,
  ShieldCheck,
  Cpu,
  Layers,
  GitFork,
  Rocket,
  Pickaxe,
  ArrowLeftRight,
  Database,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Lock,
  ExternalLink,
  Printer
} from 'lucide-react';
import { useGXQ } from '../../context/GXQContext';

export const WhitepaperView: React.FC = () => {
  const { addToast } = useGXQ();

  const [activeSection, setActiveSection] = useState('exec-summary');

  const navSections = [
    { id: 'exec-summary', label: '1. Executive Summary & Problem' },
    { id: 'quantum-consensus', label: '2. PoQW Consensus & Sharding' },
    { id: 'cryptography', label: '3. NIST PQC Cryptography' },
    { id: 'tokenomics', label: '4. Tokenomics & ETH Parity' },
    { id: 'multichain-bridge', label: '5. Multichain & USDC Bridge' },
    { id: 'smart-contracts', label: '6. Q-WASM Smart Contracts' },
    { id: 'launchpad', label: '7. Enterprise Tokens Launchpad' },
    { id: 'enterprise-suite', label: '8. Exclusive Enterprise Edition' },
    { id: 'api-cache', label: '9. API SDK & DB Caching' },
    { id: 'roadmap', label: '10. Development Roadmap' },
    { id: 'legal', label: '11. Security Model & Disclaimer' },
  ];

  const handleDownloadWhitepaper = () => {
    const element = document.getElementById('whitepaper-content');
    if (!element) return;
    window.print();
    addToast('Whitepaper Ready', 'Use browser print dialog to save as PDF.', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-tech font-bold px-2 py-0.5 rounded bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/30">
              OFFICIAL PROTOCOL SPECIFICATION
            </span>
            <span className="text-xs font-tech text-[#9AA6B2]">RELEASE VERSION 2.4.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-tech text-[#F5F7FA] mt-1">
            GXQ Network Whitepaper
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-0.5">
            A Quantum-Resistant Sharded Layer 1 Blockchain with Native ETH Price Parity, Multichain Bridging, and Enterprise Infrastructure.
          </p>
        </div>

        <button
          onClick={handleDownloadWhitepaper}
          className="px-4 py-2.5 rounded-xl bg-[#00A8FF] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          PRINT / EXPORT AS PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Contents Sticky Nav */}
        <div className="lg:col-span-4 sticky top-24 space-y-2">
          <GlassCard level={2} className="p-4 space-y-2">
            <div className="text-xs font-tech font-bold uppercase tracking-wider text-[#66717D] px-2">
              TABLE OF CONTENTS
            </div>
            <div className="space-y-1">
              {navSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-tech font-semibold transition-all flex items-center justify-between ${
                    activeSection === sec.id
                      ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40'
                      : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{sec.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Full Whitepaper Content Container */}
        <div id="whitepaper-content" className="lg:col-span-8 space-y-8">
          {/* Section 1 */}
          <GlassCard id="exec-summary" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <FileText className="w-4 h-4" /> SECTION 1
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              1. Executive Summary & Problem Statement
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                Modern distributed ledgers rely on classical public-key cryptography—predominantly ECDSA (secp256k1/ed25519) and RSA. Advances in fault-tolerant quantum computing (FTQC) threaten this foundation. Specifically, <strong>Shor's Algorithm</strong> can factor large integers and solve discrete logarithms in polynomial time, fundamentally breaking every elliptic curve signature in Bitcoin, Ethereum, and Solana. Simultaneously, <strong>Grover's Algorithm</strong> quadratically accelerates brute-force pre-image searches against cryptographic hash functions.
              </p>
              <p>
                <strong>GXQ Network</strong> addresses this vulnerability. It is an enterprise-first, high-throughput Layer 1 blockchain engineered with post-quantum lattice cryptography, concurrent sharding, and real-time multichain interoperability.
              </p>
              <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
                <span className="font-tech font-bold text-[#00A8FF] text-xs">GXQ Core Guarantees:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#F5F7FA]">
                  <li><strong>Post-Quantum Resistance:</strong> Standardized on NIST Level 5 CRYSTALS-Dilithium-5 signatures.</li>
                  <li><strong>High Scalability:</strong> 4 concurrent partition shards delivering 14,280 TPS average with 1.2s block times.</li>
                  <li><strong>ETH Price Parity:</strong> Main token GXQ dynamically maintains 1:1 parity with Ethereum spot pricing with matching supply dynamics (~120M total supply).</li>
                  <li><strong>Universal USDC Ingress:</strong> Seamless lock-and-mint bridging of USDC from Ethereum, Arbitrum, Solana, Polygon, and BSC.</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Section 2 */}
          <GlassCard id="quantum-consensus" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Cpu className="w-4 h-4" /> SECTION 2
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              2. Proof-of-Quantum-Work (PoQW) & Multi-Shard Consensus
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                GXQ introduces <strong>Proof-of-Quantum-Work (PoQW)</strong>, a dual consensus mechanism harmonizing lattice-sieving compute tasks with Practical Byzantine Fault Tolerant (PBFT) validator quorums.
              </p>
              <p>
                Instead of computing useless arbitrary SHA-256 hashes, PoQW miners solve shortest-vector problems (SVP) in high-dimensional polynomial rings (R_q = Z_q[X]/(X^n + 1) where n=1024). This mathematical work validates state transitions while creating provable entropy for cross-shard random beacon generation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-tech font-bold text-xs text-[#00A8FF]">Shard-0: Prime Settlement</span>
                  <p className="text-[11px] text-[#9AA6B2]">Global finality root, validator staking registry, and cross-shard atomic commit anchor.</p>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-tech font-bold text-xs text-[#00A8FF]">Shard-1: High-Frequency DeFi</span>
                  <p className="text-[11px] text-[#9AA6B2]">Sub-500ms AMM liquidity pools, zero-frontrunning swap routes, and order book matching.</p>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-tech font-bold text-xs text-[#00A8FF]">Shard-2: Enterprise Privacy</span>
                  <p className="text-[11px] text-[#9AA6B2]">Zero-knowledge STARK execution environment for confidential institutional balance sheets.</p>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-tech font-bold text-xs text-[#00A8FF]">Shard-3: Cross-Chain Gateway</span>
                  <p className="text-[11px] text-[#9AA6B2]">Decentralized relayer threshold mesh managing atomic bridge transfers and USDC minting.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 3 */}
          <GlassCard id="cryptography" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <ShieldCheck className="w-4 h-4" /> SECTION 3
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              3. NIST Post-Quantum Cryptography Architecture
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                All user accounts and validator nodes utilize <strong>CRYSTALS-Dilithium-5</strong> (NIST FIPS 204), delivering 256 bits of post-quantum classical and quantum security.
              </p>
              <div className="p-4 rounded-xl bg-[#030507]/90 border border-white/10 font-mono text-xs text-[#00A8FF] space-y-1">
                <div>Public Key Matrix: A in R_q^(k x l) where k=8, l=7, q=8380417</div>
                <div>Secret Vector: s1 in S_eta^l, s2 in S_eta^k with infinity norm bound eta=2</div>
                <div>Address Scheme: gxq1q[hex_digest_dilithium5_poly_ring]</div>
              </div>
              <p>
                Peer-to-peer transport layers and validator gossip channels are encrypted with <strong>CRYSTALS-Kyber-1024</strong> (NIST FIPS 203) Key Encapsulation Mechanisms (KEM), preventing retrospective decryption attacks ("Harvest Now, Decrypt Later").
              </p>
            </div>
          </GlassCard>

          {/* Section 4 */}
          <GlassCard id="tokenomics" level={3} glow="blue" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Rocket className="w-4 h-4" /> SECTION 4
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              4. Tokenomics & Ethereum Price Parity Model
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                The native token of the network is <strong>GXQ</strong>. GXQ tokenomics are modeled to closely align with Ethereum's supply dynamics and spot valuation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5">
                  <span className="text-[10px] text-[#66717D] font-tech uppercase">TARGET PRICE</span>
                  <div className="text-xl font-tech font-bold text-[#F5F7FA] mt-0.5">ETH Parity (~$3,465)</div>
                  <div className="text-[10px] text-[#00A8FF] mt-1">Automated Arbitrage Anchor</div>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5">
                  <span className="text-[10px] text-[#66717D] font-tech uppercase">TOTAL SUPPLY</span>
                  <div className="text-xl font-tech font-bold text-[#F5F7FA] mt-0.5">120,450,000 GXQ</div>
                  <div className="text-[10px] text-[#66717D] mt-1">Matched to ETH circulating supply</div>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5">
                  <span className="text-[10px] text-[#66717D] font-tech uppercase">ANNUAL REWARD</span>
                  <div className="text-xl font-tech font-bold text-emerald-400 mt-0.5">2.5 GXQ / Block</div>
                  <div className="text-[10px] text-[#66717D] mt-1">Proof-of-Quantum-Work yield</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-tech font-bold text-xs text-[#F5F7FA]">Token Allocation Breakdown:</div>
                <div className="space-y-1.5 text-xs font-tech">
                  <div className="flex justify-between">
                    <span className="text-[#9AA6B2]">45% PoQW Mining & Validator Staking Consensus</span>
                    <span className="font-bold text-[#00A8FF]">54,202,500 GXQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA6B2]">25% Ecosystem Expansion & Developer Grants</span>
                    <span className="font-bold text-[#00A8FF]">30,112,500 GXQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA6B2]">15% Multi-Chain Bridge Liquidity & USDC Arbitrage Reserves</span>
                    <span className="font-bold text-[#00A8FF]">18,067,500 GXQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA6B2]">10% Enterprise Treasury & Institutional Reserve</span>
                    <span className="font-bold text-[#00A8FF]">12,045,000 GXQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA6B2]">5% Core Engineering & Foundation (48-Month Linear Vesting)</span>
                    <span className="font-bold text-[#00A8FF]">6,022,500 GXQ</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 5 */}
          <GlassCard id="multichain-bridge" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <GitFork className="w-4 h-4" /> SECTION 5
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              5. Universal Multichain Bridging & USDC Ingress Architecture
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                To provide seamless onboarding, Shard-3 manages a decentralized multi-chain gateway. Users can bridge <strong>USDC</strong> from Ethereum, Arbitrum One, Solana, Polygon, and BNB Chain directly into GXQ Network.
              </p>
              <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2 text-xs">
                <span className="font-tech font-bold text-emerald-400">4-Step Cryptographic Verification:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-[#F5F7FA] font-tech">
                  <li><strong>Source Escrow Lock:</strong> Assets locked in audited smart contracts on source network (e.g. Ethereum).</li>
                  <li><strong>Relayer Quorum Attestation:</strong> 7 out of 7 independent relayer nodes observe and cryptographically sign event log.</li>
                  <li><strong>Post-Quantum Merkle Proof:</strong> Shard-3 verifies Dilithium-5 multi-signature threshold proof against source block root.</li>
                  <li><strong>Atomic Target Mint:</strong> Bridged tokens minted directly to user's post-quantum quantum address on Shard-1 or Shard-0.</li>
                </ol>
              </div>
            </div>
          </GlassCard>

          {/* Section 6 */}
          <GlassCard id="smart-contracts" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Layers className="w-4 h-4" /> SECTION 6
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              6. Q-WASM Virtual Machine & Developer Framework
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                The GXQ Virtual Machine (<strong>Q-WASM</strong>) executes sandboxed WebAssembly bytecode with formal memory safety checks. It natively interprets Solidity contracts via the LLVM/Q-WASM compiler backend.
              </p>
              <p>
                All contracts feature built-in reentrancy locks, deterministic gas execution bounds, and Dilithium authorization modifiers, preventing classic flash-loan exploits and integer overflow bugs.
              </p>
            </div>
          </GlassCard>

          {/* Section 7 */}
          <GlassCard id="launchpad" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Rocket className="w-4 h-4" /> SECTION 7
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              7. Tokens Launchpad — Exclusive Enterprise Edition
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                The GXQ Launchpad is an institutional-grade platform enabling enterprises to deploy new QRC-20 tokens with fair-launch vesting, automated USDC subscription vaults, and automated Dilithium smart contract verification. Over $303M in total funding has been securely processed.
              </p>
            </div>
          </GlassCard>

          {/* Section 8 */}
          <GlassCard id="enterprise-suite" level={3} glow="orange" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#FF7A00]">
              <Lock className="w-4 h-4" /> SECTION 8
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              8. Exclusive Enterprise Edition Architecture
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                Designed for financial institutions, defense networks, and healthcare consortia, the <strong>Exclusive Enterprise Edition</strong> offers sovereign private subnet provisioning, dedicated validator nodes, hardware security module (HSM/KMS) integrations, and 99.99% uptime Service Level Agreements (SLAs).
              </p>
            </div>
          </GlassCard>

          {/* Section 9 */}
          <GlassCard id="api-cache" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Database className="w-4 h-4" /> SECTION 9
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              9. Developer API SDK & High-Speed DB Caching Strategy
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#9AA6B2] leading-relaxed">
              <p>
                To provide instantaneous query response times across the Block Explorer and Administration Control Plane without overwhelming on-chain validator gossip meshes, GXQ implements a multi-tier caching architecture:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-tech">
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-bold text-[#00A8FF]">L1 In-Memory LRU Cache</span>
                  <p className="text-[11px] text-[#9AA6B2]">Ultra-fast in-memory cache for recent blocks, hot tickers, and mempool entries (&lt; 3ms latency, 97.1% hit ratio).</p>
                </div>
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                  <span className="font-bold text-[#00A8FF]">L2 Persistent State Trie Buffer</span>
                  <p className="text-[11px] text-[#9AA6B2]">Disk-backed indexed trie for historical address balances, Dilithium key proofs, and contract states.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 10 */}
          <GlassCard id="roadmap" level={3} className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-[#00A8FF]">
              <Calendar className="w-4 h-4" /> SECTION 10
            </div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
              10. Development Roadmap
            </h2>
            <div className="space-y-3 font-tech text-xs">
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-[#F5F7FA]">Phase 1: Quantum Genesis & Core 4-Shard Mesh (Completed)</div>
                  <div className="text-[11px] text-[#9AA6B2]">Deployment of Dilithium-5 lattice cryptography, PoQW mining loop, and ETH price parity oracle.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-[#F5F7FA]">Phase 2: AMM DEX & Universal USDC Multi-Chain Bridge (Live)</div>
                  <div className="text-[11px] text-[#9AA6B2]">Deployment of Shard-1 high-frequency DEX and 7/7 relayer gateway for Ethereum, Arbitrum, Solana, Polygon, and BSC.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-[#00A8FF] flex items-center justify-center text-[#030507] font-bold text-[10px] mt-0.5 shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-[#00A8FF]">Phase 3: Enterprise Private Subnets & Sovereign HSM (Q4 2026)</div>
                  <div className="text-[11px] text-[#9AA6B2]">Institutional private rollups, dedicated validator clusters, and ISO 27001 / SOC 2 compliance certifications.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[#9AA6B2] font-bold text-[10px] mt-0.5 shrink-0">
                  4
                </div>
                <div>
                  <div className="font-bold text-[#F5F7FA]">Phase 4: Autonomous AI Multi-Agent Network Governance (2027)</div>
                  <div className="text-[11px] text-[#9AA6B2]">Integration of Gemini Omni AI agents for autonomous shard rebalancing and formal mathematical proof synthesis.</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 11 */}
          <GlassCard id="legal" level={2} className="p-6 space-y-3 font-tech text-xs">
            <h3 className="font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              11. Security Audit & Legal Disclaimers
            </h3>
            <p className="text-[#9AA6B2] leading-relaxed">
              GXQ Network is open-source, non-custodial decentralized software. Cryptographic implementations conform to NIST Special Publication 800-208 and FIPS 204 draft standards. This document is provided for technical informational purposes only and does not constitute financial, investment, or legal advice.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
