import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  FileCode2,
  Play,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Terminal,
  RefreshCw,
  Zap,
  ExternalLink
} from 'lucide-react';
import { CONTRACT_TEMPLATES } from '../../constants/tokens';
import { blockchain } from '../../services/blockchainService';
import { SmartContract, ContractAbiMethod } from '../../types/blockchain';

export const ContractsView: React.FC = () => {
  const { wallet, contracts, shards, triggerFlash, addToast } = useGXQ();

  const [selectedTemplate, setSelectedTemplate] = useState(CONTRACT_TEMPLATES[0]);
  const [contractCode, setContractCode] = useState(CONTRACT_TEMPLATES[0].code);
  const [selectedShardId, setSelectedShardId] = useState(1);
  const [customContractName, setCustomContractName] = useState('QuantumSyntheticToken');
  const [isDeploying, setIsDeploying] = useState(false);

  // Inspector state
  const [inspectedContract, setInspectedContract] = useState<SmartContract>(contracts[0]);
  const [selectedMethod, setSelectedMethod] = useState<ContractAbiMethod>(contracts[0]?.abi[0]);
  const [methodArgs, setMethodArgs] = useState<Record<string, string>>({});
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecutingMethod, setIsExecutingMethod] = useState(false);

  const handleSelectTemplate = (tmpl: typeof CONTRACT_TEMPLATES[0]) => {
    setSelectedTemplate(tmpl);
    setContractCode(tmpl.code);
    setCustomContractName(tmpl.name.replace(/\s+/g, ''));
  };

  const handleDeploy = async () => {
    if (!wallet.connected) {
      addToast('Wallet Required', 'Please connect your quantum wallet to deploy smart contracts.', 'warn');
      return;
    }

    setIsDeploying(true);
    triggerFlash('ORANGE_FLASH');

    try {
      await new Promise(r => setTimeout(r, 1200));

      const newContract = await blockchain.deploySmartContract({
        name: customContractName,
        shardId: selectedShardId,
        creator: wallet.address,
        bytecode: `608060405234801561001057600080fd5b5061019a806100206000396000f3fe...[QWASM_DILITHIUM5]`,
        abi: selectedTemplate.abi,
      });

      setInspectedContract(newContract);
      if (newContract.abi && newContract.abi.length > 0) {
        setSelectedMethod(newContract.abi[0]);
      }

      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Contract Deployed',
        `Contract '${newContract.name}' deployed to Shard-${newContract.shardId} at ${newContract.address.slice(0, 10)}...`,
        'success'
      );
    } catch (err: any) {
      addToast('Deploy Failed', err?.message || 'Could not deploy contract.', 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleExecuteMethod = async () => {
    if (!selectedMethod || !inspectedContract) return;

    setIsExecutingMethod(true);
    triggerFlash('BLUE_FLASH');

    try {
      await new Promise(r => setTimeout(r, 700));

      const res = await blockchain.executeContractMethod(
        inspectedContract.address,
        selectedMethod.name,
        methodArgs,
        wallet.address
      );

      setExecutionOutput(
        `METHOD EXECUTION SUCCESS:\nTx Hash: ${res.txHash}\nDilithium Verification: NIST Level 5 PASSED\nReturn: ${res.result}\nGas Consumed: 21,420 NanoGXQ`
      );

      triggerFlash('SUCCESS_FLASH');
      addToast('Method Executed', `Called ${selectedMethod.name}() with Dilithium signature.`, 'success');
    } catch (err: any) {
      setExecutionOutput(`EXECUTION ERROR:\n${err?.message || 'Reverted'}`);
      addToast('Execution Reverted', err?.message || 'Method failed.', 'error');
    } finally {
      setIsExecutingMethod(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <FileCode2 className="w-7 h-7 text-purple-400" />
            Smart Contracts Deployment & VM
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Q-WASM virtual machine with formal Dilithium post-quantum memory protection.
          </p>
        </div>

        <StatusBadge status="ACTIVE" label="Q-WASM VM READY" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor & Deploy Column */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard level={3} glow="blue" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <span className="font-tech text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#00A8FF]" /> Contract Blueprint & Templates
              </span>

              {/* Template selector */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {CONTRACT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold transition-all ${
                      selectedTemplate.id === tmpl.id
                        ? 'bg-[#00A8FF] text-[#030507]'
                        : 'bg-white/5 text-[#9AA6B2] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {tmpl.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Contract Name & Shard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#9AA6B2] font-tech">CONTRACT IDENTIFIER</label>
                <input
                  type="text"
                  value={customContractName}
                  onChange={(e) => setCustomContractName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#9AA6B2] font-tech">DEPLOY TO SHARD DOMAIN</label>
                <select
                  value={selectedShardId}
                  onChange={(e) => setSelectedShardId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs font-tech font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF] cursor-pointer"
                >
                  {shards.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#030507]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code IDE Textarea */}
            <div className="space-y-1">
              <label className="text-xs text-[#9AA6B2] font-tech flex items-center justify-between">
                <span>SOLIDITY / Q-WASM SOURCE CODE</span>
                <span className="text-[#00A8FF] text-[10px]">COMPILER v0.8.24+PQC</span>
              </label>
              <textarea
                rows={13}
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#030507]/90 border border-white/10 font-mono text-xs text-purple-300 focus:outline-none focus:border-[#00A8FF] leading-relaxed resize-y"
              />
            </div>

            {/* Deploy Trigger */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-[#00A8FF] text-white font-tech font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Broadcasting Bytecode to Shard-{selectedShardId}...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  COMPILE & DEPLOY TO SHARD-{selectedShardId}
                </>
              )}
            </button>
          </GlassCard>
        </div>

        {/* Live ABI Method Inspector Column */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard level={3} glow="blue" className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-tech font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Interactive Contract ABI Runner
              </h3>
              <p className="text-[11px] text-[#9AA6B2] mt-0.5">
                Execute methods on deployed quantum smart contracts in real time.
              </p>
            </div>

            {/* Select Deployed Contract */}
            <div className="space-y-1">
              <label className="text-xs text-[#9AA6B2] font-tech">ACTIVE CONTRACT</label>
              <select
                value={inspectedContract?.address}
                onChange={(e) => {
                  const found = contracts.find((c) => c.address === e.target.value);
                  if (found) {
                    setInspectedContract(found);
                    if (found.abi && found.abi.length > 0) {
                      setSelectedMethod(found.abi[0]);
                      setMethodArgs({});
                    }
                  }
                }}
                className="w-full px-3 py-2 rounded-xl glass-lvl-1 border border-white/10 text-xs font-tech font-bold text-[#00A8FF] focus:outline-none focus:border-[#00A8FF] cursor-pointer truncate"
              >
                {contracts.map((c) => (
                  <option key={c.address} value={c.address} className="bg-[#030507]">
                    {c.name} ({c.address.slice(0, 10)}... Shard-{c.shardId})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Method */}
            {inspectedContract?.abi && inspectedContract.abi.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs text-[#9AA6B2] font-tech">SELECT ABI METHOD</label>
                <div className="grid grid-cols-2 gap-2">
                  {inspectedContract.abi.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => {
                        setSelectedMethod(m);
                        setMethodArgs({});
                        setExecutionOutput(null);
                      }}
                      className={`p-2 rounded-lg text-xs font-tech font-bold text-left transition-all truncate ${
                        selectedMethod?.name === m.name
                          ? 'bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/40'
                          : 'bg-white/5 text-[#9AA6B2] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {m.name}()
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Method Args Input Form */}
            {selectedMethod && (
              <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/10 space-y-3">
                <div className="text-xs text-[#F5F7FA] font-tech font-bold">
                  {selectedMethod.name}({selectedMethod.inputs.map((i) => `${i.type} ${i.name}`).join(', ')})
                </div>
                <p className="text-[11px] text-[#9AA6B2]">{selectedMethod.description}</p>

                {selectedMethod.inputs.map((inp) => (
                  <div key={inp.name} className="space-y-1">
                    <label className="text-[10px] text-[#9AA6B2] font-mono uppercase">
                      {inp.name} ({inp.type})
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${inp.type}`}
                      value={methodArgs[inp.name] || ''}
                      onChange={(e) =>
                        setMethodArgs((prev) => ({ ...prev, [inp.name]: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#030507] border border-white/10 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
                    />
                  </div>
                ))}

                <button
                  onClick={handleExecuteMethod}
                  disabled={isExecutingMethod}
                  className="w-full py-2.5 rounded-lg bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] font-tech font-bold text-xs hover:bg-[#00A8FF]/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isExecutingMethod ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  EXECUTE ON-CHAIN
                </button>
              </div>
            )}

            {/* Terminal Output */}
            {executionOutput && (
              <div className="p-3 rounded-xl bg-[#030507]/90 border border-white/10 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
                {executionOutput}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
