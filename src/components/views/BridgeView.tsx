import React, { useState, useEffect } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  GitFork,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Layers,
  ArrowLeftRight,
  Clock
} from 'lucide-react';
import {
  bridgeService,
  SUPPORTED_CHAINS,
  BRIDGEABLE_ASSETS
} from '../../services/bridgeService';
import { BridgeTransfer } from '../../types/blockchain';

export const BridgeView: React.FC = () => {
  const { wallet, triggerFlash, addToast } = useGXQ();

  const [sourceChain, setSourceChain] = useState<string>('Ethereum Mainnet (L1)');
  const [targetChain, setTargetChain] = useState<string>('GXQ Shard-0 (Prime Settlement)');
  const [asset, setAsset] = useState<string>('USDC');
  const [amount, setAmount] = useState<string>('500');
  const [recipient, setRecipient] = useState<string>(wallet.address);
  const [isBridging, setIsBridging] = useState<boolean>(false);
  const [activeTransfer, setActiveTransfer] = useState<BridgeTransfer | null>(null);
  const [transfers, setTransfers] = useState<BridgeTransfer[]>(bridgeService.getTransfers());

  useEffect(() => {
    const unsub = bridgeService.subscribe(() => {
      setTransfers([...bridgeService.getTransfers()]);
    });
    return unsub;
  }, []);

  const handleSwitchChains = () => {
    const temp = sourceChain;
    setSourceChain(targetChain);
    setTargetChain(temp);
  };

  const handleExecuteBridge = async () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) {
      addToast('Invalid Amount', 'Please specify a valid transfer amount.', 'warn');
      return;
    }

    setIsBridging(true);
    triggerFlash('BLUE_FLASH');

    try {
      const transfer = await bridgeService.initiateBridge({
        sourceChain,
        targetChain,
        sender: wallet.address,
        recipient,
        asset,
        amount: numAmount,
        onProgress: (t) => {
          setActiveTransfer({ ...t });
        },
      });

      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Bridge Transfer Verified',
        `Transferred ${numAmount} ${asset} from ${sourceChain} to ${targetChain}. Verified with 7/7 relayer quorum.`,
        'success'
      );
    } catch (err: any) {
      addToast('Bridge Reverted', err?.message || 'Transfer failed.', 'error');
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <GitFork className="w-7 h-7 text-[#00A8FF]" />
            Multi-Chain & Cross-Shard Bridge
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Universal asset transfers with post-quantum multi-sig relayer attestation.
          </p>
        </div>

        <StatusBadge status="ACTIVE" label="7/7 RELAYERS ONLINE" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bridge Configuration Card */}
        <div className="lg:col-span-7">
          <GlassCard level={3} glow="blue" className="p-5 sm:p-7 space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <span className="font-tech text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00A8FF]" /> Cross-Network Route
              </span>
              <span className="text-xs text-[#00A8FF] font-tech font-bold">
                USDC & GXQ INSTANT BRIDGE
              </span>
            </div>

            {/* Source Chain Selector */}
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-xs text-[#9AA6B2] font-tech">SOURCE NETWORK</div>
              <select
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value)}
                className="w-full bg-[#030507] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF] cursor-pointer"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.name} disabled={c.name === targetChain}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch Direction */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwitchChains}
                className="p-2.5 rounded-full glass-lvl-3 border border-[#00A8FF]/40 hover:border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)] transition-all hover:scale-110 cursor-pointer"
                aria-label="Invert bridge direction"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Target Chain Selector */}
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-xs text-[#9AA6B2] font-tech">TARGET DESTINATION NETWORK</div>
              <select
                value={targetChain}
                onChange={(e) => setTargetChain(e.target.value)}
                className="w-full bg-[#030507] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF] cursor-pointer"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.name} disabled={c.name === sourceChain}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Asset & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-1">
                <label className="text-xs text-[#9AA6B2] font-tech">ASSET</label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full bg-[#030507] border border-white/10 rounded-xl px-3 py-2 text-xs font-tech font-bold text-[#00A8FF] focus:outline-none"
                >
                  {BRIDGEABLE_ASSETS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-1">
                <div className="flex justify-between text-xs text-[#9AA6B2] font-tech">
                  <span>AMOUNT</span>
                  <span>Bal: {(wallet.balances[asset]?.balance || 0).toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold font-tech text-[#F5F7FA] focus:outline-none"
                />
              </div>
            </div>

            {/* Recipient Address */}
            <div className="space-y-1">
              <label className="text-xs text-[#9AA6B2] font-tech">RECIPIENT ADDRESS ON DESTINATION</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 font-mono text-xs text-[#00A8FF] focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            {/* Fee summary */}
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1 text-xs font-tech">
              <div className="flex justify-between text-[#9AA6B2]">
                <span>Relayer Gas Overhead</span>
                <span className="text-[#F5F7FA]">2.50 USDC / 0.001 GXQ</span>
              </div>
              <div className="flex justify-between text-[#9AA6B2]">
                <span>Estimated Finality Time</span>
                <span className="text-emerald-400 font-bold">&lt; 3.5 Seconds</span>
              </div>
              <div className="flex justify-between text-[#9AA6B2]">
                <span>Cryptographic Proof</span>
                <span className="text-[#00A8FF]">Dilithium Merkle Attestation</span>
              </div>
            </div>

            {/* Bridge Action Button */}
            <button
              onClick={handleExecuteBridge}
              disabled={isBridging}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-tech font-bold text-base hover:brightness-110 shadow-[0_0_25px_rgba(0,168,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isBridging ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying Cross-Chain Relayer Proofs...
                </>
              ) : (
                <>
                  <GitFork className="w-5 h-5" />
                  EXECUTE CROSS-CHAIN BRIDGE
                </>
              )}
            </button>
          </GlassCard>
        </div>

        {/* Live Transfer Status & Relayer Mesh */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Progress Stepper */}
          {activeTransfer && (
            <GlassCard level={3} glow="blue" className="space-y-4">
              <h3 className="font-tech font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#00A8FF] animate-spin" />
                Live Transfer #{activeTransfer.id}
              </h3>

              <div className="space-y-3 font-tech text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${activeTransfer.step >= 1 ? 'bg-[#00A8FF] text-[#030507]' : 'bg-white/10 text-[#66717D]'}`}>
                    1
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Lock on {activeTransfer.sourceChain}</div>
                    <div className="text-[10px] text-[#9AA6B2]">Deposit verified into protocol escrow</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${activeTransfer.step >= 2 ? 'bg-[#00A8FF] text-[#030507]' : 'bg-white/10 text-[#66717D]'}`}>
                    2
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Relayer Attestation Quorum</div>
                    <div className="text-[10px] text-[#00A8FF]">
                      {activeTransfer.multisigAttestations}/{activeTransfer.requiredAttestations} signatures gathered
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${activeTransfer.step >= 3 ? 'bg-[#00A8FF] text-[#030507]' : 'bg-white/10 text-[#66717D]'}`}>
                    3
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Post-Quantum Lattice Verification</div>
                    <div className="text-[10px] text-[#9AA6B2]">Dilithium-5 state root checked</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${activeTransfer.step >= 4 ? 'bg-emerald-500 text-[#030507]' : 'bg-white/10 text-[#66717D]'}`}>
                    4
                  </div>
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Release / Mint on {activeTransfer.targetChain}</div>
                    <div className="text-[10px] text-emerald-400">
                      {activeTransfer.step === 4 ? 'Complete! Funds credited.' : 'Finalizing atomic transfer'}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Historical Transfers */}
          <GlassCard level={2} className="space-y-3">
            <h3 className="font-tech font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00A8FF]" />
              Recent Bridge Transfers
            </h3>

            <div className="space-y-2 text-xs font-tech">
              {transfers.slice(0, 5).map((tr) => (
                <div
                  key={tr.id}
                  className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00A8FF]">{tr.id}</span>
                    <StatusBadge status="SUCCESS" label={tr.status} />
                  </div>
                  <div className="text-[#F5F7FA] font-bold">
                    {tr.amount} {tr.asset}
                  </div>
                  <div className="text-[11px] text-[#9AA6B2] flex items-center gap-1 truncate">
                    <span>{tr.sourceChain.split(' ')[0]}</span>
                    <span>→</span>
                    <span>{tr.targetChain.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
