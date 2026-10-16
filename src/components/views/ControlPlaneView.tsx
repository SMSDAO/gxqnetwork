import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Sliders,
  Server,
  Layers,
  Terminal,
  Database,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  Code2,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  Search,
  KeyRound,
  ExternalLink,
  Power,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ControlPlaneView: React.FC = () => {
  const {
    shards,
    validators,
    wallet,
    googleUser,
    loginWithGoogle,
    logoutGoogle,
    isSuperAdmin,
    auditEvents,
    addToast,
    triggerFlash
  } = useGXQ();

  // Control tabs
  const [activeAdminTab, setActiveAdminTab] = useState<'SHARDS' | 'VALIDATORS' | 'TREASURY' | 'USERS_REGISTRY' | 'API_SDK_CACHE' | 'RED_TEAM'>('SHARDS');

  // Emergency States
  const [isNetworkPaused, setIsNetworkPaused] = useState(false);
  const [pausedShards, setPausedShards] = useState<Record<number, boolean>>({});
  
  // Treasury Minter
  const [mintAmount, setMintAmount] = useState('1000');
  const [mintTargetShard, setMintTargetShard] = useState('0');
  const [isMinting, setIsMinting] = useState(false);

  // Gas Controls
  const [baseFee, setBaseFee] = useState('12');
  const [gasLimit, setGasLimit] = useState('30000000');
  const [cacheTtlSeconds, setCacheTtlSeconds] = useState('4');

  // API SDK states
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/control-plane/telemetry');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [sdkLanguage, setSdkLanguage] = useState<'typescript' | 'python' | 'go' | 'curl'>('typescript');
  const [copiedCode, setCopiedCode] = useState(false);

  // Red Team penetration simulation
  const [isRunningRedTeam, setIsRunningRedTeam] = useState(false);
  const [redTeamResults, setRedTeamResults] = useState<{
    status: 'IDLE' | 'PASS' | 'FAIL';
    timestamp: number;
    tests: { name: string; result: 'PASSED' | 'FAILED'; latency: string }[];
  }>({
    status: 'IDLE',
    timestamp: Date.now(),
    tests: []
  });

  // Toggle single shard pause
  const toggleShardPause = (shardId: number) => {
    setPausedShards(prev => {
      const updated = { ...prev, [shardId]: !prev[shardId] };
      triggerFlash(updated[shardId] ? 'RED_FLASH' : 'SUCCESS_FLASH');
      addToast(
        updated[shardId] ? `Shard-${shardId} Paused` : `Shard-${shardId} Resumed`,
        `Super-admin updated circuit breaker for partition ${shardId}.`,
        updated[shardId] ? 'warn' : 'success'
      );
      return updated;
    });
  };

  // Toggle global emergency pause
  const toggleGlobalPause = () => {
    const nextState = !isNetworkPaused;
    setIsNetworkPaused(nextState);
    triggerFlash(nextState ? 'RED_FLASH' : 'SUCCESS_FLASH');
    addToast(
      nextState ? 'GLOBAL PROTOCOL CIRCUIT BREAKER ACTIVE' : 'GLOBAL PROTOCOL RESUMED',
      nextState ? 'All shard transactions temporarily queued.' : 'Block production and DEX swaps restored.',
      nextState ? 'error' : 'success'
    );
  };

  // Handle Treasury Mint
  const handleMintTreasury = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(mintAmount);
    if (isNaN(val) || val <= 0) {
      addToast('Invalid Mint Amount', 'Please specify a positive GXQ amount.', 'warn');
      return;
    }
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Treasury Reserve Minted',
        `Successfully allocated ${val} GXQ to Shard-${mintTargetShard} Liquidity Reserve.`,
        'success'
      );
    }, 900);
  };

  // Run Red Team Penetration Testing
  const runRedTeamAudit = () => {
    setIsRunningRedTeam(true);
    triggerFlash('YELLOW_FLASH');
    addToast('Red Team Audit Initiated', 'Simulating Shor quantum attack, replay injection, and orphan state attack...', 'info');

    setTimeout(() => {
      setIsRunningRedTeam(false);
      setRedTeamResults({
        status: 'PASS',
        timestamp: Date.now(),
        tests: [
          { name: 'Shor 4096-bit Polynomial Lattice Attack', result: 'PASSED', latency: '240ms' },
          { name: 'Cross-Shard Replay Signature Poisoning', result: 'PASSED', latency: '120ms' },
          { name: 'Orphaned Block Merkle Root Injection', result: 'PASSED', latency: '95ms' },
          { name: 'Dilithium-5 Signature Tamper Resistance', result: 'PASSED', latency: '180ms' },
          { name: 'API Rate Limiting & Denial-of-Wallet Guard', result: 'PASSED', latency: '65ms' },
        ]
      });
      triggerFlash('SUCCESS_FLASH');
      addToast('Red Team Audit Succeeded', 'All 5 attack vectors neutralized. NIST Level 5 compliance confirmed.', 'success');
    }, 2200);
  };

  const handleTestApi = async () => {
    setIsLoadingApi(true);
    try {
      const res = await fetch(selectedEndpoint);
      const json = await res.json();
      setApiResponse(JSON.stringify(json, null, 2));
      addToast('API Executed', `200 OK from ${selectedEndpoint}`, 'success');
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err?.message || 'Network request failed' }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  const sdkSnippets: Record<string, string> = {
    typescript: `import { GXQAdminClient, DilithiumSuperKey } from "@gxq/admin-sdk";

// Initialize Super-Admin Control Plane Client
const admin = new GXQAdminClient({
  rpcEndpoint: "https://rpc.gxq.network",
  adminEmail: "gxqstudio@gmail.com",
  pqcLevel: "DILITHIUM_5",
  authToken: process.env.GXQ_ADMIN_TOKEN,
});

async function main() {
  // Query Real-time Shard Telemetry
  const shards = await admin.getShardsTelemetry();
  console.log("Active Shards TPS:", shards.map(s => s.tps));

  // Emergency Circuit Breaker Rebalance
  await admin.rebalanceShardPartitions({
    sourceShard: 1,
    targetShard: 0,
    maxCrossShardTps: 5000,
  });
}
main();`,
    python: `from gxq_admin import GXQAdminClient

admin = GXQAdminClient(
    rpc_url="https://rpc.gxq.network",
    admin_email="gxqstudio@gmail.com"
)

# Inspect Validator Slashing Status
validators = admin.get_validators()
for val in validators:
    if val.uptime < 99.0:
        print(f"Warning: Node {val.id} degraded uptime: {val.uptime}%")`,
    go: `package main

import (
	"context"
	"fmt"
	"github.com/gxq-network/gxq-admin-sdk"
)

func main() {
	client := gxq.NewAdminClient("https://rpc.gxq.network", "gxqstudio@gmail.com")
	health, err := client.GetConsensusHealth(context.Background())
	if err != nil {
		panic(err)
	}
	fmt.Printf("Consensus Quorum: %v\\n", health.QuorumPercent)
}`,
    curl: `curl -X GET "https://ais-dev-ashrov2jfxr4etv2ywc234-58325421054.us-east5.run.app/api/control-plane/telemetry" \\
  -H "Accept: application/json" \\
  -H "X-GXQ-Admin-Identity: gxqstudio@gmail.com"`
  };

  // If user is NOT super admin, render the isolated security perimeter lockdown!
  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-center">
        <GlassCard level={4} glow="red" className="p-8 sm:p-12 space-y-6 border-[#FF304F]/40 shadow-[0_0_50px_rgba(255,48,79,0.3)]">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FF304F]/10 border border-[#FF304F]/40 flex items-center justify-center text-[#FF304F] shadow-[0_0_30px_rgba(255,48,79,0.4)]">
            <Lock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF304F]/20 border border-[#FF304F]/40 text-[#FF304F] text-xs font-tech font-bold tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" /> ZERO-TRUST ISOLATION PERIMETER
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-tech text-[#F5F7FA]">
              Control Plane Access Restricted
            </h1>
            <p className="text-sm text-[#9AA6B2] max-w-xl mx-auto leading-relaxed">
              The GXQ Network Administration Control Plane is strictly isolated from standard user privileges. Access is protected by quantum cryptographic gates and requires Google Authentication matching the designated Master Administrator:
            </p>
            <div className="inline-block p-2 rounded-xl bg-black/60 border border-[#FF304F]/50 font-mono text-sm text-[#FF304F] font-bold">
              gxqstudio@gmail.com
            </div>
          </div>

          {/* Current session info */}
          {googleUser ? (
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 max-w-md mx-auto text-left text-xs font-tech space-y-2">
              <div className="text-[#66717D]">CURRENT GOOGLE SESSION:</div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F5F7FA]">{googleUser.email}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">
                  STANDARD USER
                </span>
              </div>
              <p className="text-[11px] text-[#9AA6B2]">
                Your account does not have Super-Admin privileges. You may use all public decentralized features (Explorer, DEX Swap, Mining, Contracts, Bridge, Launchpad, Top Users).
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 max-w-md mx-auto text-xs font-tech text-[#9AA6B2]">
              You are currently browsing in Guest mode. Please authenticate using the master admin Google account below.
            </div>
          )}

          {/* Action to log in as admin */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => loginWithGoogle('gxqstudio@gmail.com', 'GXQ Studio Master Admin')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF304F] to-[#FF7A00] text-white font-tech font-bold text-sm hover:brightness-110 shadow-[0_0_25px_rgba(255,48,79,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              AUTHENTICATE AS GXQSTUDIO@GMAIL.COM
            </button>

            {googleUser && (
              <button
                onClick={() => logoutGoogle()}
                className="w-full sm:w-auto px-4 py-3 rounded-xl glass-lvl-1 border border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA] font-tech text-xs transition-colors cursor-pointer"
              >
                Sign Out Current Session
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  // SUPER-ADMIN VIEW (When authenticated as gxqstudio@gmail.com)
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Super-Admin Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl glass-lvl-3 border border-[#FF304F]/40 shadow-[0_0_35px_rgba(255,48,79,0.25)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-tech font-bold px-2.5 py-0.5 rounded bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,48,79,0.3)]">
              <ShieldAlert className="w-3.5 h-3.5" /> SUPER-ADMIN PRIVILEGES ACTIVE
            </span>
            <span className="text-xs font-tech text-[#9AA6B2]">PROTOCOL LEVEL 5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] mt-1">
            Master Control Plane & Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-0.5 font-mono">
            Authenticated Super-Admin: <span className="text-[#FF304F] font-bold">gxqstudio@gmail.com</span> • Dilithium Session: <span className="text-[#00A8FF]">{wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}</span>
          </p>
        </div>

        {/* Global Circuit Breaker Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={toggleGlobalPause}
            className={`px-4 py-2.5 rounded-xl font-tech font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              isNetworkPaused
                ? 'bg-emerald-500 text-[#030507] hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-[#FF304F] text-white hover:brightness-110 shadow-[0_0_20px_rgba(255,48,79,0.4)]'
            }`}
          >
            <Power className="w-4 h-4" />
            {isNetworkPaused ? 'RESUME GLOBAL NETWORK' : 'GLOBAL CIRCUIT BREAKER (HALT)'}
          </button>

          <button
            onClick={() => logoutGoogle()}
            className="px-3.5 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA] font-tech text-xs transition-colors cursor-pointer"
          >
            Lock & Exit
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar font-tech text-xs sm:text-sm">
        {[
          { id: 'SHARDS', label: 'Shard Partitions & Circuit Breakers', icon: Layers },
          { id: 'VALIDATORS', label: 'Validator Slashing & Quorum', icon: Server },
          { id: 'TREASURY', label: 'Treasury & Reserve Operations', icon: HardDrive },
          { id: 'USERS_REGISTRY', label: 'Google Smart Wallet Registry', icon: Users },
          { id: 'API_SDK_CACHE', label: 'API SDK & DB Caching Engine', icon: Database },
          { id: 'RED_TEAM', label: 'Red Team Penetration Testing', icon: Flame },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/40 shadow-[0_0_12px_rgba(255,48,79,0.3)] font-bold'
                  : 'text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SHARDS MANAGEMENT */}
      {activeAdminTab === 'SHARDS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shards.map((s) => {
              const isPaused = pausedShards[s.id] || isNetworkPaused;
              return (
                <GlassCard
                  key={s.id}
                  level={3}
                  glow={isPaused ? 'red' : 'blue'}
                  className={`p-5 space-y-4 border ${isPaused ? 'border-[#FF304F]/50 bg-[#FF304F]/5' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00A8FF]">
                      PARTITION {s.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPaused ? 'bg-[#FF304F]/20 text-[#FF304F]' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isPaused ? 'HALTED' : 'ACTIVE'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold font-tech text-base text-[#F5F7FA]">{s.name}</h3>
                    <p className="text-xs text-[#9AA6B2] mt-1">{s.description}</p>
                  </div>

                  <div className="space-y-1.5 text-xs font-tech text-[#9AA6B2]">
                    <div className="flex justify-between">
                      <span>Throughput:</span>
                      <span className="text-[#F5F7FA] font-bold">{s.tps.toLocaleString()} TPS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="text-[#F5F7FA]">{s.capacityTps.toLocaleString()} TPS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shard Load:</span>
                      <span className={s.loadPercent > 70 ? 'text-[#FFD400]' : 'text-emerald-400'}>
                        {s.loadPercent}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleShardPause(s.id)}
                    className={`w-full py-2 rounded-xl font-tech font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPaused
                        ? 'bg-emerald-500 text-[#030507] hover:brightness-110 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-[#FF304F]/20 text-[#FF304F] hover:bg-[#FF304F] hover:text-white border border-[#FF304F]/40'
                    }`}
                  >
                    {isPaused ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {isPaused ? 'RESUME SHARD' : 'EMERGENCY PAUSE SHARD'}
                  </button>
                </GlassCard>
              );
            })}
          </div>

          {/* Gas & Fee Governance */}
          <GlassCard level={2} glow="yellow" className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FFD400]" />
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
                Consensus Gas & Finality Tuning
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-tech">
              <div className="space-y-1.5">
                <label className="text-[#9AA6B2] font-bold">BASE GAS PRICE (NANO-GXQ):</label>
                <input
                  type="number"
                  value={baseFee}
                  onChange={(e) => setBaseFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#9AA6B2] font-bold">MAX BLOCK GAS LIMIT:</label>
                <input
                  type="number"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#9AA6B2] font-bold">REDIS/CACHE TTL (SECONDS):</label>
                <input
                  type="number"
                  value={cacheTtlSeconds}
                  onChange={(e) => setCacheTtlSeconds(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#FFD400]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                triggerFlash('SUCCESS_FLASH');
                addToast('Parameters Updated', `Base Gas: ${baseFee} nano-GXQ | Block Gas: ${gasLimit} | TTL: ${cacheTtlSeconds}s`, 'success');
              }}
              className="px-4 py-2 rounded-xl bg-[#FFD400] text-[#030507] font-tech font-bold text-xs hover:brightness-110 shadow-[0_0_15px_rgba(255,212,0,0.3)] transition-all cursor-pointer"
            >
              BROADCAST CONSENSUS PARAMETERS
            </button>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: VALIDATORS MANAGEMENT */}
      {activeAdminTab === 'VALIDATORS' && (
        <GlassCard level={3} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
                Active Lattice Validator Nodes & Slashing Watchdog
              </h3>
              <p className="text-xs text-[#9AA6B2]">
                Inspect validator heartbeat, peer latency, and enforce immediate slashing penalties for Byzantine deviations.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {validators.filter(v => v.status === 'ACTIVE').length} / {validators.length} NODES HEALTHY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-tech">
              <thead>
                <tr className="border-b border-white/10 text-[#66717D] uppercase text-[10px]">
                  <th className="pb-3 px-3">Node ID</th>
                  <th className="pb-3 px-3">Validator Name</th>
                  <th className="pb-3 px-3">Shard</th>
                  <th className="pb-3 px-3 text-right">Staked GXQ</th>
                  <th className="pb-3 px-3 text-right">Uptime</th>
                  <th className="pb-3 px-3 text-right">Latency</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 px-3 text-center">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {validators.map((val) => (
                  <tr key={val.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono text-[#00A8FF]">{val.id}</td>
                    <td className="py-3 px-3 font-bold text-[#F5F7FA]">{val.name}</td>
                    <td className="py-3 px-3 text-[#9AA6B2]">Shard-{val.shardId}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#F5F7FA]">
                      {val.stakedGXQ.toLocaleString()} GXQ
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                      {val.uptimePercent}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#9AA6B2]">
                      {val.latencyMs} ms
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {val.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          triggerFlash('RED_FLASH');
                          addToast('Slashing Penalty Issued', `Issued 500 GXQ slashing deduction to ${val.id} for latency breach.`, 'warn');
                        }}
                        className="px-2.5 py-1 rounded bg-[#FF304F]/20 text-[#FF304F] hover:bg-[#FF304F] hover:text-white border border-[#FF304F]/30 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Slash Node
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 3: TREASURY & RESERVES */}
      {activeAdminTab === 'TREASURY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GlassCard level={3} glow="orange" className="lg:col-span-6 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
                Protocol Treasury Minting & Liquidity Injection
              </h3>
            </div>
            <p className="text-xs text-[#9AA6B2]">
              Super-Admin privilege to mint reserve backing tokens into dedicated shard AMM liquidity pools or the multichain relayer bridge.
            </p>

            <form onSubmit={handleMintTreasury} className="space-y-4 text-xs font-tech">
              <div>
                <label className="block text-[#9AA6B2] mb-1 font-bold">MINT AMOUNT (GXQ):</label>
                <input
                  type="number"
                  step="100"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-base font-bold text-[#F5F7FA] focus:outline-none focus:border-[#FF7A00]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA6B2] mb-1 font-bold">TARGET DESTINATION SHARD / VAULT:</label>
                <select
                  value={mintTargetShard}
                  onChange={(e) => setMintTargetShard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-lvl-1 border border-white/10 text-sm text-[#F5F7FA] bg-[#070B12] focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="0">Shard-0: Prime Settlement Cold Reserve</option>
                  <option value="1">Shard-1: DEX AMM Constant-Product Liquidity Pool</option>
                  <option value="2">Shard-2: ZKP Relayer Fee Buffer</option>
                  <option value="3">Shard-3: Multichain Bridge USDC Collateral Vault</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isMinting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-tech font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMinting ? 'EXECUTING DILITHIUM MINT...' : 'AUTHORIZE PROTOCOL MINT'}
              </button>
            </form>
          </GlassCard>

          <GlassCard level={2} className="lg:col-span-6 p-6 space-y-4">
            <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
              Treasury Reserve Balances
            </h3>
            <div className="space-y-3 text-xs font-tech">
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex justify-between items-center">
                <span>Shard-0 Prime Cold Storage:</span>
                <span className="font-bold text-[#F5F7FA] font-mono">14,250,000 GXQ (~$49.3M)</span>
              </div>
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex justify-between items-center">
                <span>Shard-1 DEX AMM Liquidity:</span>
                <span className="font-bold text-[#00A8FF] font-mono">8,400,000 GXQ + 29,100,000 USDC</span>
              </div>
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex justify-between items-center">
                <span>Multichain Bridge Escrow:</span>
                <span className="font-bold text-emerald-400 font-mono">42,500,000 USDC Collateral</span>
              </div>
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex justify-between items-center">
                <span>PoQW Mining Subsidy Pool:</span>
                <span className="font-bold text-[#FFD400] font-mono">19,589,500 GXQ Remaining</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 4: GOOGLE SMART WALLET REGISTRY */}
      {activeAdminTab === 'USERS_REGISTRY' && (
        <GlassCard level={3} glow="blue" className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
                Google-Linked Quantum Smart Wallets Registry
              </h3>
              <p className="text-xs text-[#9AA6B2]">
                Deterministic mapping between authenticated Google accounts and Dilithium-5 smart addresses.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#00A8FF]">
              REAL-TIME SYNCED REGISTRY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-tech">
              <thead>
                <tr className="border-b border-white/10 text-[#66717D] uppercase text-[10px]">
                  <th className="pb-3 px-3">Google Account</th>
                  <th className="pb-3 px-3">Quantum Smart Address</th>
                  <th className="pb-3 px-3">Dilithium Public Key</th>
                  <th className="pb-3 px-3 text-center">Role</th>
                  <th className="pb-3 px-3 text-right">Balance</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {/* Admin entry */}
                <tr className="bg-[#FF304F]/5">
                  <td className="py-3 px-3 text-[#F5F7FA] font-bold">
                    gxqstudio@gmail.com
                  </td>
                  <td className="py-3 px-3 text-[#FF304F]">
                    {wallet.address.slice(0, 16)}...{wallet.address.slice(-6)}
                  </td>
                  <td className="py-3 px-3 text-[#66717D] text-[10px]">
                    0xDLTH5_98f4e22b...
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-[#FF304F]/20 text-[#FF304F] font-bold text-[10px]">
                      SUPER_ADMIN
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#F5F7FA]">
                    {wallet.balanceGXQ.toFixed(2)} GXQ
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      VERIFIED
                    </span>
                  </td>
                </tr>

                {/* Simulated Google smart wallet registry entries */}
                {[
                  { email: 'alex.investor@gmail.com', addr: 'gxq1q88a91c0b2df7e44a1b023910ff9821a7cd91', bal: 142.5, role: 'CYBER_TRADER' },
                  { email: 'elena.node@gmail.com', addr: 'gxq1q38cc910fe2847ba1192834b910248fa7102e', bal: 2840.0, role: 'DIAMOND_VALIDATOR' },
                  { email: 'quantum.whale@gmail.com', addr: 'gxq1q92f33b1e847cd9910ae2839b1a03918f4e22', bal: 18500.0, role: 'QUANTUM_WHALE' },
                ].map((u) => (
                  <tr key={u.email} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-[#F5F7FA]">{u.email}</td>
                    <td className="py-3 px-3 text-[#00A8FF]">{u.addr.slice(0, 16)}...{u.addr.slice(-6)}</td>
                    <td className="py-3 px-3 text-[#66717D] text-[10px]">0xDLTH5_a710fe...</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[#9AA6B2] text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#F5F7FA]">{u.bal.toLocaleString()} GXQ</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 5: API SDK & DB CACHING */}
      {activeAdminTab === 'API_SDK_CACHE' && (
        <div className="space-y-6">
          <GlassCard level={3} className="p-6 space-y-4">
            <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
              Interactive RPC & REST API Test Console
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs font-mono text-[#F5F7FA]"
              />
              <button
                onClick={handleTestApi}
                disabled={isLoadingApi}
                className="px-4 py-2 rounded-xl bg-[#00A8FF] text-[#030507] font-tech font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                {isLoadingApi ? 'Calling...' : 'Execute Test'}
              </button>
            </div>

            {apiResponse && (
              <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto max-h-64">
                {apiResponse}
              </pre>
            )}
          </GlassCard>

          {/* SDK Snippets */}
          <GlassCard level={2} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA]">
                Official Client SDK Implementations
              </h3>
              <div className="flex gap-1.5 p-1 rounded-xl glass-lvl-1 border border-white/5 text-xs font-tech">
                {(['typescript', 'python', 'go', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSdkLanguage(lang)}
                    className={`px-3 py-1 rounded-lg uppercase ${sdkLanguage === lang ? 'bg-[#00A8FF] text-[#030507] font-bold' : 'text-[#9AA6B2]'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-[#00A8FF] overflow-x-auto">
              {sdkSnippets[sdkLanguage]}
            </pre>
          </GlassCard>
        </div>
      )}

      {/* TAB 6: RED TEAM AUDIT */}
      {activeAdminTab === 'RED_TEAM' && (
        <GlassCard level={3} glow="red" className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-tech text-[#F5F7FA] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF304F]" />
                Automated Red Team Adversarial Penetration Engine
              </h3>
              <p className="text-xs text-[#9AA6B2] mt-0.5">
                Simulate post-quantum attack vectors, lattice factorization, and cross-shard transaction replay.
              </p>
            </div>

            <button
              onClick={runRedTeamAudit}
              disabled={isRunningRedTeam}
              className="px-5 py-2.5 rounded-xl bg-[#FF304F] text-white font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,48,79,0.4)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {isRunningRedTeam ? 'EXECUTING ADVERSARIAL ATTACKS...' : 'TRIGGER RED TEAM AUDIT'}
            </button>
          </div>

          {redTeamResults.status === 'PASS' && (
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-tech text-emerald-400">
                <span className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> ALL 5 QUANTUM PENETRATION TESTS PASSED
                </span>
                <span className="font-mono">Audited at {new Date(redTeamResults.timestamp).toLocaleTimeString()}</span>
              </div>

              <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden glass-lvl-1">
                {redTeamResults.tests.map((t, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs font-tech">
                    <span className="text-[#F5F7FA]">{t.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#66717D] font-mono">{t.latency}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {t.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
