import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import {
  ArrowDownUp,
  Settings,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Droplets,
  Layers
} from 'lucide-react';
import { blockchain } from '../../services/blockchainService';
import { telemetry } from '../../services/telemetryService';

export const SwapView: React.FC = () => {
  const { wallet, market, triggerFlash, addToast } = useGXQ();

  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>('swap');
  const [fromAsset, setFromAsset] = useState<string>('USDC');
  const [toAsset, setToAsset] = useState<string>('GXQ');
  const [fromAmount, setFromAmount] = useState<string>('1000');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Liquidity state
  const [poolA, setPoolA] = useState('GXQ');
  const [poolB, setPoolB] = useState('USDC');
  const [amountPoolA, setAmountPoolA] = useState('1.5');
  const [amountPoolB, setAmountPoolB] = useState('5198.70');
  const [isAddingLiq, setIsAddingLiq] = useState(false);

  const tokenList = ['GXQ', 'USDC', 'ETH', 'BTC', 'SOL'];

  const getPrice = (sym: string): number => {
    if (sym === 'GXQ') return market.tickers.GXQ?.price || 3465.80;
    if (sym === 'ETH') return market.tickers.ETH?.price || 3465.80;
    if (sym === 'USDC') return 1.00;
    if (sym === 'BTC') return market.tickers.BTC?.price || 94820.00;
    if (sym === 'SOL') return market.tickers.SOL?.price || 198.40;
    return 1.00;
  };

  const fromPrice = getPrice(fromAsset);
  const toPrice = getPrice(toAsset);

  const numFromAmount = parseFloat(fromAmount) || 0;
  const rawToAmount = toPrice > 0 ? (numFromAmount * fromPrice) / toPrice : 0;
  const feeRate = 0.003; // 0.3% LP fee
  const estimatedReceived = rawToAmount * (1 - feeRate);
  const minimumReceived = estimatedReceived * (1 - slippage / 100);
  const priceImpact = Math.min(2.5, +(numFromAmount > 5000 ? (numFromAmount / 50000) * 1.2 : 0.04).toFixed(3));

  const handleSwitchAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleExecuteSwap = async () => {
    if (numFromAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid swap quantity.', 'warn');
      return;
    }

    const currentBalance = wallet.balances[fromAsset]?.balance || 0;
    if (currentBalance < numFromAmount) {
      addToast('Insufficient Funds', `Available: ${currentBalance.toFixed(4)} ${fromAsset}`, 'error');
      return;
    }

    setIsSwapping(true);
    triggerFlash('ORANGE_FLASH');

    try {
      // Simulate quantum execution step
      await new Promise(r => setTimeout(r, 900));

      blockchain.debitAsset(fromAsset, numFromAmount);
      blockchain.creditAsset(toAsset, estimatedReceived);

      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Quantum Swap Executed',
        `Swapped ${numFromAmount} ${fromAsset} for ${estimatedReceived.toFixed(4)} ${toAsset} on Shard-1 AMM.`,
        'success'
      );

      await telemetry.record(
        'DEX_SWAP',
        wallet.address,
        `Executed AMM swap: ${numFromAmount} ${fromAsset} -> ${estimatedReceived.toFixed(4)} ${toAsset} at rate 1 ${fromAsset} = ${(fromPrice / toPrice).toFixed(6)} ${toAsset}`,
        'SUCCESS'
      );
    } catch (err: any) {
      addToast('Swap Failed', err?.message || 'Transaction could not be confirmed.', 'error');
    } finally {
      setIsSwapping(false);
    }
  };

  const handleAddLiquidity = async () => {
    const valA = parseFloat(amountPoolA) || 0;
    const valB = parseFloat(amountPoolB) || 0;
    if (valA <= 0 || valB <= 0) {
      addToast('Invalid Liquidity', 'Amounts must be greater than zero.', 'warn');
      return;
    }

    setIsAddingLiq(true);
    triggerFlash('BLUE_FLASH');

    try {
      await new Promise(r => setTimeout(r, 1000));
      blockchain.debitAsset(poolA, valA);
      blockchain.debitAsset(poolB, valB);

      addToast(
        'Liquidity Deposited',
        `Added ${valA} ${poolA} + ${valB} ${poolB} to Shard-1 Quantum Pool. Received 24.8 QLP tokens.`,
        'success'
      );

      await telemetry.record(
        'LIQUIDITY_ADD',
        wallet.address,
        `Added ${valA} ${poolA} and ${valB} ${poolB} to AMM pool. Share of pool: 0.14%.`,
        'SUCCESS'
      );
    } finally {
      setIsAddingLiq(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <ArrowDownUp className="w-7 h-7 text-[#00A8FF]" />
            Quantum DEX & AMM Swap
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Zero-slippage atomic routing on Shard-1 High-Frequency DeFi engine.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl glass-lvl-2 border border-white/10 font-tech text-xs">
          <button
            onClick={() => setActiveTab('swap')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'swap'
                ? 'bg-[#00A8FF] text-[#030507] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                : 'text-[#9AA6B2] hover:text-[#F5F7FA]'
            }`}
          >
            SWAP TOKENS
          </button>
          <button
            onClick={() => setActiveTab('liquidity')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'liquidity'
                ? 'bg-[#00A8FF] text-[#030507] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                : 'text-[#9AA6B2] hover:text-[#F5F7FA]'
            }`}
          >
            LIQUIDITY POOLS
          </button>
        </div>
      </div>

      {activeTab === 'swap' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Swap Card */}
          <div className="lg:col-span-7">
            <GlassCard level={3} glow="blue" className="p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-tech text-sm font-bold text-[#F5F7FA] tracking-wide flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00A8FF]" /> Quantum Route Optimization
                </span>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors"
                  aria-label="Slippage settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Slippage Settings Panel */}
              {showSettings && (
                <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-2 text-xs font-tech animate-in fade-in">
                  <div className="text-[#9AA6B2]">SLIPPAGE TOLERANCE:</div>
                  <div className="flex items-center gap-2">
                    {[0.1, 0.5, 1.0, 2.0].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSlippage(val)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          slippage === val
                            ? 'bg-[#00A8FF] text-[#030507]'
                            : 'bg-white/5 text-[#9AA6B2] hover:text-[#F5F7FA]'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* From Box */}
              <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech">
                  <span>YOU PAY</span>
                  <span>
                    Balance: {(wallet.balances[fromAsset]?.balance || 0).toFixed(4)} {fromAsset}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-bold font-tech text-[#F5F7FA] focus:outline-none"
                  />
                  <select
                    value={fromAsset}
                    onChange={(e) => setFromAsset(e.target.value)}
                    className="bg-[#030507] border border-white/10 rounded-xl px-3 py-2 text-sm font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF] cursor-pointer"
                  >
                    {tokenList.map((t) => (
                      <option key={t} value={t} disabled={t === toAsset}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right text-[11px] text-[#9AA6B2]">
                  ≈ ${(numFromAmount * fromPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
              </div>

              {/* Switch Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  onClick={handleSwitchAssets}
                  className="p-2.5 rounded-full glass-lvl-3 border border-[#00A8FF]/40 hover:border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)] transition-all hover:scale-110 cursor-pointer"
                  aria-label="Invert swap assets"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
              </div>

              {/* To Box */}
              <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9AA6B2] font-tech">
                  <span>YOU RECEIVE (ESTIMATED)</span>
                  <span>
                    Balance: {(wallet.balances[toAsset]?.balance || 0).toFixed(4)} {toAsset}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    readOnly
                    value={estimatedReceived.toFixed(6)}
                    className="w-full bg-transparent text-2xl font-bold font-tech text-[#00A8FF] focus:outline-none cursor-default"
                  />
                  <select
                    value={toAsset}
                    onChange={(e) => setToAsset(e.target.value)}
                    className="bg-[#030507] border border-white/10 rounded-xl px-3 py-2 text-sm font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF] cursor-pointer"
                  >
                    {tokenList.map((t) => (
                      <option key={t} value={t} disabled={t === fromAsset}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right text-[11px] text-[#9AA6B2]">
                  ≈ ${(estimatedReceived * toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
              </div>

              {/* Execution Details */}
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1.5 text-xs font-tech">
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>Exchange Rate</span>
                  <span className="text-[#F5F7FA]">
                    1 {fromAsset} = {(fromPrice / toPrice).toFixed(6)} {toAsset}
                  </span>
                </div>
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>Minimum Received ({slippage}% max slip)</span>
                  <span className="text-[#F5F7FA] font-mono">{minimumReceived.toFixed(6)} {toAsset}</span>
                </div>
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>Price Impact</span>
                  <span className="text-emerald-400">{priceImpact}%</span>
                </div>
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>LP Routing Fee</span>
                  <span className="text-[#F5F7FA]">0.30% (Shard-1 Liquidity Providers)</span>
                </div>
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>Dilithium Security</span>
                  <span className="text-[#00A8FF] flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3 h-3 text-[#00A8FF]" /> NIST Level 5
                  </span>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleExecuteSwap}
                disabled={isSwapping}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-tech font-bold text-base hover:brightness-110 shadow-[0_0_25px_rgba(0,168,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Executing Quantum Swap on Shard-1...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    SWAP {fromAsset} FOR {toAsset}
                  </>
                )}
              </button>
            </GlassCard>
          </div>

          {/* Side Info & Pool Depths */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard level={2} className="space-y-3">
              <h3 className="font-tech font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#00A8FF]" />
                Shard-1 AMM Active Pools
              </h3>

              <div className="space-y-2 text-xs font-tech">
                <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#F5F7FA]">GXQ / USDC Pool</div>
                    <div className="text-[10px] text-[#9AA6B2]">TVL: $48,250,000</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">14.8% APR</span>
                    <div className="text-[10px] text-[#66717D]">Volume: $12.4M (24h)</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#F5F7FA]">GXQ / ETH Parity Pool</div>
                    <div className="text-[10px] text-[#9AA6B2]">TVL: $32,100,000</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">11.2% APR</span>
                    <div className="text-[10px] text-[#66717D]">1:1 Arbitrage Track</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard level={2} className="space-y-3 text-xs font-tech">
              <h3 className="font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF7A00]" />
                Why GXQ DEX is Unique
              </h3>
              <p className="text-[#9AA6B2] leading-relaxed">
                GXQ Shard-1 features a high-throughput deterministic order routing mesh. 
                Unlike standard EVM swaps vulnerable to quantum Grover's or Shor's algorithms, 
                every state modification is secured by NIST PQC lattice verification, eliminating front-running and MEV sandwich attacks.
              </p>
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Liquidity Provision View */
        <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold font-tech text-[#F5F7FA] flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#00A8FF]" />
              Provide Liquidity & Earn Protocol Fees
            </h2>
            <p className="text-xs text-[#9AA6B2] mt-1">
              Deposit asset pairs into Shard-1 automated market maker pools to earn 0.3% of all swaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-xs text-[#9AA6B2] font-tech">FIRST ASSET</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amountPoolA}
                  onChange={(e) => setAmountPoolA(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold font-tech text-[#F5F7FA] focus:outline-none"
                />
                <span className="px-3 py-1.5 rounded-lg bg-[#00A8FF]/20 text-[#00A8FF] font-tech font-bold text-sm">
                  {poolA}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-lvl-1 border border-white/10 space-y-2">
              <div className="text-xs text-[#9AA6B2] font-tech">SECOND ASSET</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amountPoolB}
                  onChange={(e) => setAmountPoolB(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold font-tech text-[#F5F7FA] focus:outline-none"
                />
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-tech font-bold text-sm">
                  {poolB}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddLiquidity}
            disabled={isAddingLiq}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-tech font-bold text-base hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isAddingLiq ? 'Minting Quantum LP Tokens...' : 'SUPPLY LIQUIDITY TO POOL'}
          </button>
        </GlassCard>
      )}
    </div>
  );
};
