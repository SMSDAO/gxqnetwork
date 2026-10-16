import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ShieldCheck,
  Server,
  Lock,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  FileCheck,
  Sliders,
  DollarSign,
  Headphones,
  Check,
  ChevronRight
} from 'lucide-react';
import { useGXQ } from '../../context/GXQContext';
import { Modal } from '../ui/Modal';

export const EnterpriseView: React.FC = () => {
  const { wallet, addToast, triggerFlash } = useGXQ();

  const [selectedTier, setSelectedTier] = useState<'growth' | 'prime' | 'sovereign'>('prime');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [subnetName, setSubnetName] = useState('Apex-Institutional-Subnet-01');
  const [validatorNodesCount, setValidatorNodesCount] = useState(16);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const tiers = [
    {
      id: 'growth',
      name: 'Tier 1: Growth Enterprise',
      price: '$4,500 / month',
      nodes: 4,
      sla: '99.90% Uptime',
      features: [
        'Dedicated Shard Partition',
        '4 High-Availability Validator Nodes',
        'NIST Level 5 Dilithium HSM Support',
        'Priority Mempool Queue Execution',
        'Business Hours Technical Support (8x5)'
      ]
    },
    {
      id: 'prime',
      name: 'Tier 2: Institutional Prime',
      badge: 'MOST POPULAR',
      price: '$12,000 / month',
      nodes: 16,
      sla: '99.99% Uptime SLA',
      features: [
        'Dedicated Private Subnet with Custom Chain ID',
        '16 Geographically Distributed Validator Nodes',
        'Zero-Gas Internal Consortium Transfers',
        'Dedicated Multichain Relayer Bridge Cluster',
        '24/7 Dedicated Devops & Security Hotline',
        'Automated SOC2 / ISO 27001 Audit Logs'
      ]
    },
    {
      id: 'sovereign',
      name: 'Tier 3: Sovereign Consortium',
      price: '$28,000 / month',
      nodes: 64,
      sla: '99.999% Fault-Tolerant SLA',
      features: [
        'Fully Isolated Sovereign Quantum Subnet',
        '64 Bare-Metal Quantum-Hardened Nodes',
        'Hardware Security Enclaves (AWS Nitro / SGX)',
        'Zero-Knowledge Confidential Financial State',
        'Custom Smart Contract Formal Verification',
        'Direct Access to GXQ Protocol Core Engineers'
      ]
    }
  ];

  const handleProvisionSubnet = async () => {
    setIsProvisioning(true);
    triggerFlash('ORANGE_FLASH');

    try {
      await new Promise(r => setTimeout(r, 1400));
      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Enterprise Subnet Provisioned',
        `Successfully initialized '${subnetName}' with ${validatorNodesCount} dedicated Dilithium validator nodes.`,
        'success'
      );
      setIsProvisionModalOpen(false);
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Lock className="w-7 h-7 text-[#FF7A00]" />
            Exclusive Enterprise Edition
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            Private subnets, dedicated validator clusters, hardware HSM integration, and institutional 99.99% SLAs.
          </p>
        </div>

        <button
          onClick={() => setIsProvisionModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Server className="w-4 h-4" />
          PROVISION PRIVATE SUBNET
        </button>
      </div>

      {/* Enterprise SLA Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isSelected = selectedTier === t.id;
          return (
            <GlassCard
              key={t.id}
              level={isSelected ? 3 : 2}
              glow={isSelected ? 'orange' : 'none'}
              className={`p-6 sm:p-7 space-y-5 flex flex-col justify-between transition-all ${
                isSelected ? 'border-[#FF7A00]/60 shadow-[0_0_25px_rgba(255,122,0,0.2)]' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-tech font-bold text-sm text-[#F5F7FA]">{t.name}</span>
                  {t.badge && (
                    <span className="text-[9px] font-tech font-bold px-2 py-0.5 rounded bg-[#FF7A00] text-[#030507]">
                      {t.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-tech font-bold text-[#F5F7FA]">
                    {t.price}
                  </div>
                  <div className="text-xs text-emerald-400 font-tech font-bold mt-1">
                    {t.sla}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {t.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-tech text-[#9AA6B2]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTier(t.id as any);
                  setIsProvisionModalOpen(true);
                }}
                className={`w-full py-3 rounded-xl font-tech font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] hover:brightness-110 shadow-[0_0_15px_rgba(255,122,0,0.3)]'
                    : 'glass-lvl-1 border border-white/10 text-[#F5F7FA] hover:bg-white/5'
                }`}
              >
                SELECT {t.name.split(':')[0]}
              </button>
            </GlassCard>
          );
        })}
      </div>

      {/* Enterprise Architecture & Compliance Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard level={2} className="p-6 space-y-4">
          <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00A8FF]" />
            Private Subnet Isolation Guarantee
          </h3>
          <p className="text-xs text-[#9AA6B2] leading-relaxed">
            Enterprise subnets run sovereign state machines with permissioned validator clusters. Transactions within your private subnet remain fully confidential while retaining the option to settle cryptographic roots back to GXQ Shard-0 for tamper-proof public notarization.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-tech pt-2">
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <span className="text-[#66717D]">GAS ARCHITECTURE:</span>
              <div className="font-bold text-[#F5F7FA]">Zero Gas Subsidies</div>
            </div>
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <span className="text-[#66717D]">CONSENSUS LATENCY:</span>
              <div className="font-bold text-emerald-400">Sub-300ms Blocks</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard level={2} className="p-6 space-y-4">
          <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Hardware Security Module (HSM) Integration
          </h3>
          <p className="text-xs text-[#9AA6B2] leading-relaxed">
            Direct turnkey integration with AWS CloudHSM, Google Cloud KMS, and Azure Key Vault. Enterprise validator nodes sign state blocks without ever exposing Dilithium private key vectors in plaintext server memory.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-tech pt-2">
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <span className="text-[#66717D]">COMPLIANCE:</span>
              <div className="font-bold text-[#F5F7FA]">SOC2 Type II / ISO 27001</div>
            </div>
            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <span className="text-[#66717D]">AUDITABILITY:</span>
              <div className="font-bold text-[#00A8FF]">Real-Time SIEM Stream</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Subnet Provisioning Modal */}
      <Modal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        title="Deploy Institutional Private Subnet"
        subtitle="Provision dedicated quantum validator cluster with customizable parameters"
      >
        <div className="space-y-4 text-xs font-tech">
          <div className="space-y-1">
            <label className="text-[#9AA6B2]">ENTERPRISE SUBNET IDENTIFIER</label>
            <input
              type="text"
              value={subnetName}
              onChange={(e) => setSubnetName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#F5F7FA] focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">VALIDATOR NODES CLUSTER</label>
              <select
                value={validatorNodesCount}
                onChange={(e) => setValidatorNodesCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#FF7A00] focus:outline-none"
              >
                <option value={4}>4 Nodes (Growth)</option>
                <option value={16}>16 Nodes (Prime)</option>
                <option value={64}>64 Nodes (Sovereign)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#9AA6B2]">TARGET SETTLEMENT SHARD</label>
              <select className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#00A8FF] focus:outline-none">
                <option>Shard-0 (Prime Root)</option>
                <option>Shard-2 (Zero-Knowledge Privacy)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
            <div className="flex justify-between text-[#9AA6B2]">
              <span>Hardware Encryption Standard:</span>
              <span className="font-bold text-emerald-400">NIST Dilithium-5 + KMS Enclave</span>
            </div>
            <div className="flex justify-between text-[#9AA6B2]">
              <span>SLA Guarantee:</span>
              <span className="font-bold text-[#F5F7FA]">99.99% Fault-Tolerant Uptime</span>
            </div>
          </div>

          <button
            onClick={handleProvisionSubnet}
            disabled={isProvisioning}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#030507] font-bold text-sm hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isProvisioning ? 'Provisioning Sovereign Enclaves...' : 'CONFIRM ENTERPRISE SUBNET DEPLOYMENT'}
          </button>
        </div>
      </Modal>
    </div>
  );
};
