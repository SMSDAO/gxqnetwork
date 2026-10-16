import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ShieldCheck,
  Lock,
  Download,
  AlertTriangle,
  Key,
  CheckCircle2,
  FileText,
  Search
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const { auditEvents, wallet, addToast } = useGXQ();

  const [searchFilter, setSearchFilter] = useState('');

  const filteredLogs = auditEvents.filter(
    (e) =>
      e.eventType.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.correlationId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.details.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gxq_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Audit Log Exported', 'Downloaded complete cryptographic audit trail JSON.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#00A8FF]" />
            Post-Quantum Security Center & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            NIST Level 5 cryptographic verification, active Dilithium keys, and immutable event correlation.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2 rounded-xl glass-lvl-2 border border-white/10 hover:border-[#00A8FF]/40 text-xs font-tech font-bold text-[#F5F7FA] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#00A8FF]" />
          EXPORT AUDIT LOG (.JSON)
        </button>
      </div>

      {/* NIST PQC Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard level={3} glow="blue" className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Signature Scheme</span>
            <span className="text-[#00A8FF] font-bold">ACTIVE</span>
          </div>
          <div className="text-xl font-tech font-bold text-[#F5F7FA]">CRYSTALS-Dilithium-5</div>
          <p className="text-xs text-[#9AA6B2]">
            Standardized by NIST for 256-bit quantum security against Grover and Shor attacks.
          </p>
          <div className="pt-2 text-[10px] text-emerald-400 font-mono">
            Status: Fully Enforced Across All Shards
          </div>
        </GlassCard>

        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Key Encapsulation</span>
            <span className="text-[#00A8FF] font-bold">READY</span>
          </div>
          <div className="text-xl font-tech font-bold text-[#F5F7FA]">CRYSTALS-Kyber-1024</div>
          <p className="text-xs text-[#9AA6B2]">
            Lattice-based key exchange securing peer-to-peer gossip communication between validators.
          </p>
          <div className="pt-2 text-[10px] text-emerald-400 font-mono">
            Status: TLS 1.3 Post-Quantum Handshake
          </div>
        </GlassCard>

        <GlassCard level={2} className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#9AA6B2] font-tech uppercase">
            <span>Zero-Knowledge Shard</span>
            <span className="text-[#00A8FF] font-bold">ACTIVE</span>
          </div>
          <div className="text-xl font-tech font-bold text-[#F5F7FA]">Post-Quantum STARKs</div>
          <p className="text-xs text-[#9AA6B2]">
            Transparent hash-based zero-knowledge proofs without trusted setup ceremonies.
          </p>
          <div className="pt-2 text-[10px] text-emerald-400 font-mono">
            Status: Shard-2 Privacy Enabled
          </div>
        </GlassCard>
      </div>

      {/* Non-Custodial Security Contract */}
      <GlassCard level={2} className="p-6 space-y-3 font-tech text-xs">
        <h3 className="font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Strict Non-Custodial Key Guarantee
        </h3>
        <p className="text-[#9AA6B2] leading-relaxed">
          GXQ Network follows strict zero-trust principles. Private keys and seed phrases are generated exclusively inside your browser using audited Web Cryptography platform PRNGs. Plaintext secrets are never stored in localStorage, never transmitted over API endpoints, and never written to telemetry logs.
        </p>
      </GlassCard>

      {/* Immutable Audit Log Table */}
      <GlassCard level={2} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00A8FF]" />
            <h3 className="font-tech font-bold text-sm sm:text-base text-[#F5F7FA]">
              Verifiable Cryptographic Event Stream ({auditEvents.length})
            </h3>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-[#9AA6B2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter audit events..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#030507] border border-white/10 text-xs font-tech text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-tech">
            <thead className="bg-[#030507]/60 text-[#9AA6B2] border-b border-white/10 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Correlation ID</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 text-[#66717D] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#00A8FF]">{log.correlationId}</td>
                  <td className="py-2.5 px-3 font-bold text-[#F5F7FA]">{log.eventType}</td>
                  <td className="py-2.5 px-3 font-mono text-[#9AA6B2]">{log.actor}</td>
                  <td className="py-2.5 px-3 text-[#F5F7FA] max-w-xs truncate">{log.details}</td>
                  <td className="py-2.5 px-3 font-mono text-[#66717D] text-right">
                    {log.verificationHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
