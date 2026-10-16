import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GXQ_LOGO_URL, THEME_TOKENS } from '../../constants/tokens';
import { GXQLogo } from '../ui/GXQLogo';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Palette,
  Type
} from 'lucide-react';
import { useGXQ } from '../../context/GXQContext';

export const BrandGuideView: React.FC = () => {
  const { addToast } = useGXQ();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyHex = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(hex);
    addToast('Copied Color Code', `${name}: ${hex}`, 'info');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorPalettes = [
    { name: 'BACKGROUND_PRIMARY', hex: THEME_TOKENS.BACKGROUND_PRIMARY, desc: 'Deep carbon foundation base' },
    { name: 'BACKGROUND_SECONDARY', hex: THEME_TOKENS.BACKGROUND_SECONDARY, desc: 'Secondary panel elevation' },
    { name: 'BLUE_PRIMARY', hex: THEME_TOKENS.BLUE_PRIMARY, desc: 'Electric blue quantum illumination' },
    { name: 'BLUE_GLOW', hex: THEME_TOKENS.BLUE_GLOW, desc: 'Neon edge lighting & energetic focus' },
    { name: 'ORANGE_PRIMARY', hex: THEME_TOKENS.ORANGE_PRIMARY, desc: 'High-visibility call-to-action highlight' },
    { name: 'ORANGE_GLOW', hex: THEME_TOKENS.ORANGE_GLOW, desc: 'Mining entropy and transaction active states' },
    { name: 'RED_PRIMARY', hex: THEME_TOKENS.RED_PRIMARY, desc: 'Critical alerts and error boundaries' },
    { name: 'YELLOW_PRIMARY', hex: THEME_TOKENS.YELLOW_PRIMARY, desc: 'Autonomous AI intelligence & attention' },
    { name: 'TEXT_PRIMARY', hex: THEME_TOKENS.TEXT_PRIMARY, desc: 'High-contrast white typography' },
    { name: 'TEXT_SECONDARY', hex: THEME_TOKENS.TEXT_SECONDARY, desc: 'Subtitles & metadata labels' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-tech font-bold px-2 py-0.5 rounded bg-[#00A8FF]/20 text-[#00A8FF] border border-[#00A8FF]/30">
              OFFICIAL BRAND ASSETS
            </span>
            <span className="text-xs font-tech text-[#9AA6B2]">STYLE GUIDE v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-tech text-[#F5F7FA] mt-1">
            GXQ Network Brand Identity Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-0.5">
            Logo specifications, quantum color system tokens, typography rules, and multi-platform visual assets.
          </p>
        </div>

        <a
          href={GXQ_LOGO_URL}
          download="gxq_network_official_logo.jpg"
          className="px-4 py-2.5 rounded-xl bg-[#00A8FF] text-[#030507] font-tech font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD LOGO (8K HD)
        </a>
      </div>

      {/* Primary Emblem Showcase */}
      <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-6">
        <div className="text-xs font-tech font-bold text-[#00A8FF] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> OFFICIAL PRIMARY LOGO EMBLEM
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <GXQLogo size="xl" className="group-hover:scale-105 transition-transform duration-300" />

          <div className="space-y-4 text-xs font-tech">
            <h2 className="text-2xl font-bold text-[#F5F7FA]">
              The Quantum Lattice Brand Mark
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA6B2] leading-relaxed font-sans">
              The GXQ Network insignia visually synthesizes the concepts of <strong>post-quantum lattice mathematics</strong>, <strong>high-throughput sharding</strong>, and <strong>decentralized multi-chain security</strong>. 
              The glowing neon electric blue cube represents the Dilithium cryptographic boundary, while orange circuit traces represent atomic liquidity routing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                <span className="text-[#66717D] text-[10px]">ASPECT RATIO:</span>
                <div className="font-bold text-[#F5F7FA]">1:1 Square (8K UHD)</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                <span className="text-[#66717D] text-[10px]">MINIMUM CLEARSPACE:</span>
                <div className="font-bold text-[#00A8FF]">16px (1rem buffer)</div>
              </div>
              <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
                <span className="text-[#66717D] text-[10px]">VECTOR CORE:</span>
                <div className="font-bold text-emerald-400">Post-Quantum Lattice</div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Multi-Platform Logo Variations */}
      <div className="space-y-4">
        <h3 className="font-tech font-bold text-lg text-[#F5F7FA] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00A8FF]" />
          Platform Logo Variations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Favicon & Social Icon */}
          <GlassCard level={2} className="p-5 space-y-3 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-[#00A8FF]/40 border border-[#00A8FF]">
              <img src={GXQ_LOGO_URL} alt="Favicon" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="font-tech font-bold text-sm text-[#F5F7FA]">Favicon & Social Avatar</div>
              <div className="text-[11px] text-[#9AA6B2] mt-0.5">32x32 / 64x64 / 512x512</div>
            </div>
          </GlassCard>

          {/* Horizontal Lockup */}
          <GlassCard level={2} className="p-5 space-y-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 p-3 rounded-xl glass-lvl-1 border border-white/10">
              <img src={GXQ_LOGO_URL} alt="Header" className="w-8 h-8 rounded-lg object-cover" />
              <div className="text-left font-tech">
                <div className="font-bold text-xs text-[#F5F7FA]">GXQ NETWORK</div>
                <div className="text-[9px] text-[#00A8FF]">QUANTUM BLOCKCHAIN</div>
              </div>
            </div>
            <div>
              <div className="font-tech font-bold text-sm text-[#F5F7FA]">Header Lockup</div>
              <div className="text-[11px] text-[#9AA6B2] mt-0.5">Navbar & Explorer Strip</div>
            </div>
          </GlassCard>

          {/* High-Contrast Vector */}
          <GlassCard level={2} className="p-5 space-y-3 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#030507] border border-[#00A8FF]/60 flex items-center justify-center text-[#00A8FF] font-tech font-bold text-lg shadow-[0_0_15px_rgba(0,168,255,0.3)]">
              GXQ
            </div>
            <div>
              <div className="font-tech font-bold text-sm text-[#F5F7FA]">Monochrome Vector Badge</div>
              <div className="text-[11px] text-[#9AA6B2] mt-0.5">Hardware & CLI Terminal</div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Official Color Tokens Palette */}
      <GlassCard level={2} className="p-6 space-y-4">
        <h3 className="font-tech font-bold text-lg text-[#F5F7FA] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#FF7A00]" />
          Design System Color Tokens
        </h3>
        <p className="text-xs text-[#9AA6B2]">
          Centralized design tokens powering the cyber-futuristic glass interface. Click any token to copy its hexadecimal code.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {colorPalettes.map((c) => (
            <button
              key={c.name}
              onClick={() => copyHex(c.hex, c.name)}
              className="p-3 rounded-xl glass-lvl-1 border border-white/10 hover:border-[#00A8FF]/50 transition-all text-left space-y-2 group cursor-pointer"
            >
              <div
                className="w-full h-8 rounded-lg border border-white/20 transition-transform group-hover:scale-105"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <div className="font-mono text-[10px] text-[#9AA6B2] truncate">{c.name}</div>
                <div className="font-mono font-bold text-xs text-[#F5F7FA] flex items-center justify-between">
                  <span>{c.hex}</span>
                  {copiedToken === c.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#00A8FF]" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Typography System */}
      <GlassCard level={2} className="p-6 space-y-4 font-tech">
        <h3 className="font-bold text-lg text-[#F5F7FA] flex items-center gap-2">
          <Type className="w-5 h-5 text-[#00A8FF]" />
          Typography Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl glass-lvl-1 border border-white/5 space-y-2">
            <span className="text-[#66717D] text-[10px] uppercase">HEADER / DISPLAY FONT</span>
            <div className="font-tech text-base font-bold text-[#F5F7FA]">Chakra Petch (Bold)</div>
            <p className="text-[11px] text-[#9AA6B2] font-sans">
              Used for titles, module headers, KPI statistics, and navigation badges.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-lvl-1 border border-white/5 space-y-2">
            <span className="text-[#66717D] text-[10px] uppercase">INTERFACE / BODY FONT</span>
            <div className="font-sans text-base font-bold text-[#F5F7FA]">Inter (Regular/Medium)</div>
            <p className="text-[11px] text-[#9AA6B2] font-sans">
              Clean, highly legible geometric sans-serif for descriptions and dialogues.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-lvl-1 border border-white/5 space-y-2">
            <span className="text-[#66717D] text-[10px] uppercase">CODE & CRYPTO HASHES</span>
            <div className="font-mono text-base font-bold text-[#00A8FF]">JetBrains Mono</div>
            <p className="text-[11px] text-[#9AA6B2] font-sans">
              Monospaced font for addresses, bytecode, Dilithium proofs, and SDK snippets.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Brand Usage Do's & Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-tech text-xs">
        <GlassCard level={2} className="p-5 space-y-3 border-emerald-500/20">
          <div className="font-bold text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Brand Usage: DO
          </div>
          <ul className="space-y-1.5 text-[#F5F7FA] list-disc list-inside">
            <li>Display the logo against deep black/carbon surfaces with glass elevation.</li>
            <li>Maintain minimum 16px padding around the emblem in all layouts.</li>
            <li>Use the neon electric blue glow highlight to emphasize quantum security.</li>
          </ul>
        </GlassCard>

        <GlassCard level={2} className="p-5 space-y-3 border-[#FF304F]/20">
          <div className="font-bold text-sm text-[#FF304F] flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Brand Usage: DON'T
          </div>
          <ul className="space-y-1.5 text-[#F5F7FA] list-disc list-inside">
            <li>Do not stretch, skew, or rotate the quantum lattice cube.</li>
            <li>Do not place the logo on bright non-cyber backgrounds without dark backing.</li>
            <li>Do not alter the official color tokens or substitute non-approved fonts.</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};
