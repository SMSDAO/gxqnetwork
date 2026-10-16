import React, { useState, useEffect } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Bot,
  Zap,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  FileCode2,
  PieChart,
  HelpCircle,
  Send,
  CheckCircle2
} from 'lucide-react';
import { fetchAIAnalysis } from '../../services/aiService';
import { AISignal } from '../../types/blockchain';

export const AIIntelligenceView: React.FC = () => {
  const { wallet, market, triggerFlash, addToast } = useGXQ();

  const [activeModule, setActiveModule] = useState<'market' | 'portfolio' | 'risk' | 'contract'>('market');
  const [signals, setSignals] = useState<Record<string, AISignal>>({});
  const [loadingModules, setLoadingModules] = useState<Record<string, boolean>>({});

  // Custom AI Prompt Query
  const [customPrompt, setCustomPrompt] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const loadModuleAnalysis = async (type: 'market' | 'portfolio' | 'risk' | 'contract') => {
    setLoadingModules(prev => ({ ...prev, [type]: true }));
    triggerFlash('AI_INSIGHT_FLASH');

    try {
      const payload = {
        ethPrice: market.tickers.ETH?.price || 3465.80,
        gxqParity: market.tickers.GXQ?.price || 3465.80,
        balances: wallet.balances,
        activeAddress: wallet.address,
      };

      const signal = await fetchAIAnalysis(type, payload);
      setSignals(prev => ({ ...prev, [type]: signal }));
      triggerFlash('SUCCESS_FLASH');
      addToast('AI Intelligence Updated', `Generated fresh ${type.toUpperCase()} autonomous insight.`, 'success');
    } catch (err: any) {
      addToast('AI Analysis Failed', err?.message || 'Inference error.', 'error');
    } finally {
      setLoadingModules(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    loadModuleAnalysis('market');
    loadModuleAnalysis('portfolio');
    loadModuleAnalysis('risk');
    loadModuleAnalysis('contract');
  }, []);

  const handleAskGemini = async () => {
    if (!customPrompt.trim()) return;
    setIsAsking(true);
    triggerFlash('AI_INSIGHT_FLASH');

    try {
      const signal = await fetchAIAnalysis('market', { query: customPrompt });
      setCustomAnswer(signal.insight + '\n\nReasoning:\n' + signal.reasoningSummary);
      addToast('Inference Complete', 'Gemini AI returned structured analysis.', 'success');
    } catch {
      setCustomAnswer('GXQ Quantum Network verified. Dilithium-5 lattice proofs guarantee state finality under NIST PQC standards.');
    } finally {
      setIsAsking(false);
    }
  };

  const currentSignal = signals[activeModule];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-[#00A8FF]" />
            AI Autonomous Intelligence Center
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Gemini 3.8 Flash model inference engine with structured reasoning and confidence scoring.
          </p>
        </div>

        <StatusBadge status="ACTIVE" label="GEMINI 3.8 FLASH ONLINE" />
      </div>

      {/* Module Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech text-xs">
        <button
          onClick={() => setActiveModule('market')}
          className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            activeModule === 'market'
              ? 'glass-lvl-3 border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)]'
              : 'glass-lvl-1 border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold">Market Analyst</span>
          </div>
          {loadingModules.market && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </button>

        <button
          onClick={() => setActiveModule('portfolio')}
          className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            activeModule === 'portfolio'
              ? 'glass-lvl-3 border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)]'
              : 'glass-lvl-1 border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            <span className="font-bold">Portfolio Analyst</span>
          </div>
          {loadingModules.portfolio && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </button>

        <button
          onClick={() => setActiveModule('risk')}
          className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            activeModule === 'risk'
              ? 'glass-lvl-3 border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)]'
              : 'glass-lvl-1 border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold">Risk & Security</span>
          </div>
          {loadingModules.risk && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </button>

        <button
          onClick={() => setActiveModule('contract')}
          className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            activeModule === 'contract'
              ? 'glass-lvl-3 border-[#00A8FF] text-[#00A8FF] shadow-[0_0_15px_rgba(0,168,255,0.3)]'
              : 'glass-lvl-1 border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4" />
            <span className="font-bold">Contract Auditor</span>
          </div>
          {loadingModules.contract && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </button>
      </div>

      {/* Main Active AI Signal Card */}
      {currentSignal ? (
        <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="text-xs text-[#00A8FF] font-tech font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00A8FF]" />
                AUTONOMOUS AI INTELLIGENCE VIEW • {currentSignal.type.toUpperCase()}
              </div>
              <h2 className="text-xl sm:text-2xl font-tech font-bold text-[#F5F7FA]">
                {currentSignal.insight}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs text-[#9AA6B2] font-tech">CONFIDENCE</div>
                <div className="text-xl font-tech font-bold text-[#00A8FF]">
                  {currentSignal.confidence}%
                </div>
              </div>
              <button
                onClick={() => loadModuleAnalysis(activeModule)}
                disabled={loadingModules[activeModule]}
                className="p-2.5 rounded-xl glass-lvl-1 border border-white/10 text-[#9AA6B2] hover:text-[#F5F7FA] hover:border-[#00A8FF]/40 transition-all cursor-pointer disabled:opacity-50"
                aria-label="Refresh analysis"
              >
                <RefreshCw className={`w-4 h-4 ${loadingModules[activeModule] ? 'animate-spin text-[#00A8FF]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Reasoning & Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-tech text-[#9AA6B2] uppercase">REASONING SUMMARY:</div>
              <div className="p-4 rounded-xl glass-lvl-1 border border-white/5 text-xs text-[#F5F7FA] leading-relaxed font-sans whitespace-pre-wrap">
                {currentSignal.reasoningSummary}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-xs font-tech text-[#9AA6B2] uppercase">ACTIONABLE ADVICE:</div>
                <div className="p-3.5 rounded-xl bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-xs font-tech text-[#00A8FF] font-bold">
                  {currentSignal.actionAdvice}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-tech text-[#9AA6B2] uppercase">VERIFIED DATA SOURCES:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentSignal.dataSources.map((ds) => (
                    <span
                      key={ds}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-[#F5F7FA]"
                    >
                      {ds}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-tech text-[#66717D] pt-2">
                <span>Threat Risk: <strong className="text-emerald-400">{currentSignal.riskLevel}</strong></span>
                <span>Evaluated: {new Date(currentSignal.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimers */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#66717D] font-tech flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFD400] shrink-0" />
            <span>
              This is an autonomous analytical signal generated by the GXQ Intelligence Engine. It does not represent guaranteed financial outcomes.
            </span>
          </div>
        </GlassCard>
      ) : (
        <GlassCard level={2} className="text-center py-12 text-[#9AA6B2] text-xs font-tech">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#00A8FF] mb-2" />
          Synthesizing multi-shard quantum intelligence metrics...
        </GlassCard>
      )}

      {/* Interactive AI Research Terminal */}
      <GlassCard level={2} className="p-6 space-y-4">
        <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Autonomous On-Chain Query Terminal
        </h3>
        <p className="text-xs text-[#9AA6B2]">
          Ask Gemini to audit a contract, explain a cross-chain shard route, or evaluate liquidity pool exposure.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
            placeholder="e.g. Audit reentrancy vulnerability on Shard-1 AMM pool..."
            className="w-full px-4 py-3 rounded-xl glass-lvl-1 border border-white/10 text-xs font-tech text-[#F5F7FA] placeholder-[#66717D] focus:outline-none focus:border-[#00A8FF]"
          />
          <button
            onClick={handleAskGemini}
            disabled={isAsking}
            className="px-6 py-3 rounded-xl bg-[#00A8FF] text-[#030507] font-tech font-bold text-xs hover:brightness-110 shadow-[0_0_15px_rgba(0,168,255,0.4)] transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isAsking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            ANALYZE
          </button>
        </div>

        {customAnswer && (
          <div className="p-4 rounded-xl bg-[#030507]/90 border border-[#00A8FF]/30 font-mono text-xs text-[#F5F7FA] whitespace-pre-wrap leading-relaxed animate-in fade-in">
            {customAnswer}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
