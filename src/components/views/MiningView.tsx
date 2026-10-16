import React, { useState, useEffect, useRef } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Pickaxe,
  Cpu,
  Zap,
  Play,
  Square,
  Award,
  ShieldCheck,
  Activity,
  Boxes,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { computeSha256 } from '../../services/quantumCrypto';
import { blockchain } from '../../services/blockchainService';
import { telemetry } from '../../services/telemetryService';
import { HashRateRadar } from '../charts/HashRateRadar';

interface MinedBlockLog {
  id: string;
  height: number;
  nonce: string;
  hash: string;
  rewardGXQ: number;
  timestamp: number;
}

export const MiningView: React.FC = () => {
  const { wallet, triggerFlash, addToast } = useGXQ();

  const [isMining, setIsMining] = useState<boolean>(false);
  const [quBits, setQuBits] = useState<number>(32);
  const [threads, setThreads] = useState<number>(4);
  const [hashRate, setHashRate] = useState<number>(0);
  const [totalHashes, setTotalHashes] = useState<number>(0);
  const [blocksMinedCount, setBlocksMinedCount] = useState<number>(0);
  const [earnedRewardsGXQ, setEarnedRewardsGXQ] = useState<number>(0);
  const [currentNonce, setCurrentNonce] = useState<number>(100000);
  const [minedLogs, setMinedLogs] = useState<MinedBlockLog[]>([]);

  const miningTimerRef = useRef<any>(null);
  const hashRateTimerRef = useRef<any>(null);

  // Stop mining on unmount
  useEffect(() => {
    return () => {
      if (miningTimerRef.current) clearInterval(miningTimerRef.current);
      if (hashRateTimerRef.current) clearInterval(hashRateTimerRef.current);
    };
  }, []);

  const startMining = () => {
    if (!wallet.connected) {
      addToast('Wallet Required', 'Connect your quantum wallet to receive PoQW mining rewards.', 'warn');
      return;
    }

    setIsMining(true);
    triggerFlash('ORANGE_FLASH');
    addToast('Lattice Miner Started', `Allocated ${quBits} QuBits across ${threads} quantum worker threads.`, 'info');
    
    telemetry.record(
      'MINER_START',
      wallet.address,
      `Started Proof-of-Quantum-Work miner: ${quBits} QuBits, ${threads} threads.`,
      'SUCCESS'
    );

    // Compute loop
    const baseRate = quBits * threads * 1420;
    setHashRate(baseRate);

    // Fluctuate hashrate realistically
    hashRateTimerRef.current = setInterval(() => {
      const jitter = (Math.random() - 0.48) * (baseRate * 0.08);
      setHashRate(Math.floor(baseRate + jitter));
    }, 1500);

    // Block solve loop
    miningTimerRef.current = setInterval(async () => {
      setTotalHashes(prev => prev + 1850);
      setCurrentNonce(prev => prev + Math.floor(Math.random() * 450) + 120);

      // Chance of finding a valid lattice solution
      const hit = Math.random() < 0.22;
      if (hit) {
        const reward = 2.5;
        const newBlock = await blockchain.produceBlock(36);
        const solvedHash = `0xQ_SOLVED_${await computeSha256(newBlock.height.toString() + currentNonce.toString())}`.slice(0, 36);

        blockchain.creditMiningReward(reward, wallet.address);
        setBlocksMinedCount(prev => prev + 1);
        setEarnedRewardsGXQ(prev => +(prev + reward).toFixed(4));

        const log: MinedBlockLog = {
          id: `MN-${Date.now()}`,
          height: newBlock.height,
          nonce: `0xQN_${currentNonce.toString(16)}`,
          hash: solvedHash,
          rewardGXQ: reward,
          timestamp: Date.now(),
        };

        setMinedLogs(prev => [log, ...prev.slice(0, 19)]);
        triggerFlash('SUCCESS_FLASH');
        addToast(
          'Block Solved!',
          `Mined Quantum Block #${newBlock.height.toLocaleString()} • Credited +${reward} GXQ to wallet`,
          'success'
        );
      }
    }, 2800);
  };

  const stopMining = () => {
    setIsMining(false);
    if (miningTimerRef.current) clearInterval(miningTimerRef.current);
    if (hashRateTimerRef.current) clearInterval(hashRateTimerRef.current);
    setHashRate(0);
    triggerFlash('BLUE_FLASH');
    addToast('Miner Stopped', 'Quantum worker threads suspended.', 'info');
    telemetry.record('MINER_STOP', wallet.address, 'Proof-of-Quantum-Work worker suspended.', 'SUCCESS');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mining Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Pickaxe className="w-7 h-7 text-[#FF7A00]" />
            Proof-of-Quantum Mining Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Lattice-sieving cryptographic consensus securing GXQ Shards with Dilithium proofs.
          </p>
        </div>

        <StatusBadge
          status={isMining ? 'ACTIVE' : 'OFFLINE'}
          label={isMining ? 'MINING LIVE' : 'MINER IDLE'}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard level={3} glow={isMining ? 'orange' : 'none'}>
          <div className="text-xs text-[#9AA6B2] font-tech uppercase flex items-center justify-between">
            <span>Lattice Hashrate</span>
            <Activity className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#F5F7FA]">
            {isMining ? (hashRate / 1000).toFixed(2) : '0.00'}{' '}
            <span className="text-sm font-normal text-[#9AA6B2]">kH/s</span>
          </div>
          <div className="mt-2 text-xs text-[#9AA6B2]">
            Total Lattice Solves: <span className="font-mono text-[#F5F7FA]">{totalHashes.toLocaleString()}</span>
          </div>
        </GlassCard>

        <GlassCard level={2}>
          <div className="text-xs text-[#9AA6B2] font-tech uppercase flex items-center justify-between">
            <span>Mined Blocks</span>
            <Boxes className="w-4 h-4 text-[#00A8FF]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-[#00A8FF]">
            {blocksMinedCount}
          </div>
          <div className="mt-2 text-xs text-[#9AA6B2]">
            Target Difficulty: <span className="font-mono text-emerald-400">0x0000Q_LATTICE</span>
          </div>
        </GlassCard>

        <GlassCard level={2} glow="blue">
          <div className="text-xs text-[#9AA6B2] font-tech uppercase flex items-center justify-between">
            <span>Earned Mining Yield</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-tech font-bold text-emerald-400">
            +{earnedRewardsGXQ.toFixed(2)} GXQ
          </div>
          <div className="mt-2 text-xs text-[#9AA6B2]">
            Per Block Reward: <span className="font-mono text-[#F5F7FA]">2.500 GXQ</span>
          </div>
        </GlassCard>

        <GlassCard level={2}>
          <div className="text-xs text-[#9AA6B2] font-tech uppercase flex items-center justify-between">
            <span>Quantum Security</span>
            <ShieldCheck className="w-4 h-4 text-[#00A8FF]" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-tech font-bold text-[#F5F7FA]">
            NIST LEVEL 5
          </div>
          <div className="mt-2 text-xs text-[#9AA6B2]">
            Algorithm: <span className="text-[#00A8FF]">CRYSTALS-Dilithium</span>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard level={3}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-[#00A8FF]" /> Hashrate Distribution Across Shards
          </h3>
          <HashRateRadar data={[
            { shard: 'Alpha', hashrate: 85 },
            { shard: 'Beta', hashrate: 72 },
            { shard: 'Gamma', hashrate: 91 },
            { shard: 'Delta', hashrate: 65 },
            { shard: 'Epsilon', hashrate: 78 },
          ]} />
        </GlassCard>
      </div>

      {/* Main Mining Control Rig */}
      <GlassCard level={3} glow="orange" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold font-tech text-[#F5F7FA] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#FF7A00]" />
              Interactive Quantum Lattice Rig Controller
            </h2>
            <p className="text-xs text-[#9AA6B2] mt-1">
              Adjust QuBits depth and multi-threaded sieving workers in real time.
            </p>
          </div>

          {/* Start / Stop Toggle Button */}
          {isMining ? (
            <button
              onClick={stopMining}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF304F] text-white font-tech font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,48,79,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              STOP MINING RIG
            </button>
          ) : (
            <button
              onClick={startMining}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-tech font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,122,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              LAUNCH MINING RIG
            </button>
          )}
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QuBits Slider */}
          <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-3">
            <div className="flex justify-between text-xs font-tech">
              <span className="text-[#9AA6B2]">QUANTUM QUBITS ALLOCATION</span>
              <span className="text-[#FF7A00] font-bold text-sm">{quBits} QuBits</span>
            </div>
            <input
              type="range"
              min={16}
              max={128}
              step={16}
              disabled={isMining}
              value={quBits}
              onChange={(e) => setQuBits(parseInt(e.target.value))}
              className="w-full accent-[#FF7A00] cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-[#66717D] font-mono">
              <span>16 QuBits</span>
              <span>64 QuBits</span>
              <span>128 QuBits (High Heat)</span>
            </div>
          </div>

          {/* Threads Slider */}
          <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-3">
            <div className="flex justify-between text-xs font-tech">
              <span className="text-[#9AA6B2]">LATTICE WORKER THREADS</span>
              <span className="text-[#00A8FF] font-bold text-sm">{threads} Threads</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              step={1}
              disabled={isMining}
              value={threads}
              onChange={(e) => setThreads(parseInt(e.target.value))}
              className="w-full accent-[#00A8FF] cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-[#66717D] font-mono">
              <span>1 Thread</span>
              <span>8 Threads</span>
              <span>16 Threads</span>
            </div>
          </div>
        </div>

        {/* Quantum Entropy Stream Box */}
        <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-tech text-[#9AA6B2]">
            <span className="flex items-center gap-1.5">
              <Flame className={`w-3.5 h-3.5 ${isMining ? 'text-[#FF7A00] animate-bounce' : 'text-[#66717D]'}`} />
              Active Nonce Iteration & Entropy Channel
            </span>
            <span className="font-mono text-[#F5F7FA]">
              Nonce: 0x{currentNonce.toString(16).toUpperCase()}
            </span>
          </div>

          <div className="h-10 bg-[#030507]/90 rounded-lg p-2.5 font-mono text-xs flex items-center overflow-hidden border border-white/5">
            {isMining ? (
              <span className="text-emerald-400 animate-pulse tracking-widest truncate">
                SOLVING_LATTICE: 0xQ_{currentNonce}_DILITHIUM5_POLYNOMIAL_RING_DEGREE_1024_ITER_{totalHashes}
              </span>
            ) : (
              <span className="text-[#66717D]">
                Quantum sieving idle. Click 'LAUNCH MINING RIG' to begin Proof-of-Quantum-Work solving.
              </span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Mined Blocks Log */}
      <GlassCard level={2} className="space-y-4">
        <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Recent Blocks Solved By Your Rig
        </h3>

        {minedLogs.length === 0 ? (
          <div className="text-center py-8 text-[#9AA6B2] text-xs font-tech">
            No blocks solved in this session yet. Start the miner above to discover blocks.
          </div>
        ) : (
          <div className="space-y-2.5">
            {minedLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 flex items-center justify-between text-xs font-tech"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    #{log.height.toString().slice(-3)}
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Block #{log.height.toLocaleString()}</div>
                    <div className="text-[11px] font-mono text-[#9AA6B2]">
                      Nonce: {log.nonce} • Hash: {log.hash}...
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">+{log.rewardGXQ} GXQ</div>
                  <div className="text-[10px] text-[#66717D]">
                    {Math.max(1, Math.floor((Date.now() - log.timestamp) / 1000))}s ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
