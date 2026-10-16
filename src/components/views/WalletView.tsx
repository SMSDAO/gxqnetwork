import React, { useState } from 'react';
import { useGXQ } from '../../context/GXQContext';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Wallet,
  ShieldCheck,
  Send,
  Download,
  Key,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { WalletDashboard } from '../charts/WalletDashboard';
import { StakingDashboard } from '../charts/StakingDashboard';
import {
  generateQuantumMnemonic,
  deriveQuantumAddress,
  exportEncryptedKeystore,
  GeneratedWalletSession
} from '../../services/quantumCrypto';
import { blockchain } from '../../services/blockchainService';

export const WalletView: React.FC = () => {
  const {
    wallet,
    market,
    connectWallet,
    connectExternalWallet,
    disconnectWallet,
    triggerFlash,
    addToast
  } = useGXQ();

  // Send transfer form
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1.5');
  const [selectedAsset, setSelectedAsset] = useState('GXQ');
  const [isSending, setIsSending] = useState(false);

  // Key generator modal
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [generatedSession, setGeneratedSession] = useState<GeneratedWalletSession | null>(null);
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [keystorePassphrase, setKeystorePassphrase] = useState('');
  const [exportedKeystoreJson, setExportedKeystoreJson] = useState<string | null>(null);

  // UI state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast('Copied to Clipboard', label, 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendTransaction = async () => {
    const val = parseFloat(amount) || 0;
    if (!recipient || val <= 0) {
      addToast('Invalid Input', 'Specify valid recipient address and amount.', 'warn');
      return;
    }

    setIsSending(true);
    triggerFlash('ORANGE_FLASH');

    try {
      await new Promise(r => setTimeout(r, 800));

      const tx = await blockchain.submitTransaction({
        from: wallet.address,
        to: recipient,
        value: val,
        symbol: selectedAsset,
        shardId: 0,
      });

      triggerFlash('SUCCESS_FLASH');
      addToast(
        'Transaction Confirmed',
        `Sent ${val} ${selectedAsset} to ${recipient.slice(0, 10)}... Tx: ${tx.hash.slice(0, 14)}`,
        'success'
      );
      setRecipient('');
    } catch (err: any) {
      addToast('Transaction Failed', err?.message || 'Execution reverted.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleStartGenerateWallet = async () => {
    const mnemonic = generateQuantumMnemonic();
    const keyPair = await deriveQuantumAddress(mnemonic.join(' '));
    setGeneratedSession({
      mnemonic,
      keyPair,
      createdAt: Date.now(),
    });
    setHasBackedUp(false);
    setIsGenModalOpen(true);
  };

  const handleConfirmNewWallet = () => {
    if (!generatedSession) return;
    connectWallet(generatedSession.keyPair.address);
    setIsGenModalOpen(false);
    setGeneratedSession(null);
    addToast('Active Wallet Replaced', 'Switched to newly generated Dilithium-5 quantum address.', 'success');
  };

  const handleExportKeystore = async () => {
    if (!keystorePassphrase || keystorePassphrase.length < 8) {
      addToast('Weak Passphrase', 'Enter a passphrase with at least 8 characters.', 'warn');
      return;
    }

    const dummyPair = {
      address: wallet.address,
      publicKeyHex: '0xDLTH5_KEYSTORE_EXPORT_VALIDATED',
      algorithm: 'CRYSTALS-Dilithium-5' as const,
      latticeDimension: 1024,
      securityBits: 256 as const,
    };

    const json = await exportEncryptedKeystore(dummyPair, keystorePassphrase);
    setExportedKeystoreJson(json);
    addToast('Keystore Encrypted', 'Encrypted using PBKDF2 (100,000 rounds) + AES-256-GCM.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-[#F5F7FA] flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-[#00A8FF]" />
            Smart Quantum Key Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
            NIST Level 5 non-custodial Dilithium-5 lattice cryptographic custody.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartGenerateWallet}
            className="px-4 py-2 rounded-xl bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] font-tech font-bold text-xs hover:bg-[#00A8FF]/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" />
            GENERATE 24-WORD VAULT
          </button>
          <button
            onClick={connectExternalWallet}
            className="px-4 py-2 rounded-xl glass-lvl-2 border border-white/10 text-[#F5F7FA] font-tech font-bold text-xs hover:border-[#00A8FF]/40 transition-all cursor-pointer"
          >
            EXTERNAL EXTENSION
          </button>
        </div>
      </div>

      {/* Main Account Details Card */}
      <GlassCard level={3} glow="blue" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="text-xs text-[#9AA6B2] font-tech uppercase">CURRENT DILITHIUM-5 ACCOUNT</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold text-[#00A8FF] break-all">
                {wallet.address || 'gxq1q_no_wallet_connected'}
              </span>
              <button
                onClick={() => copyToClipboard(wallet.address, 'Quantum Address')}
                className="p-1.5 rounded-lg text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors shrink-0"
                aria-label="Copy address"
              >
                {copiedText === 'Quantum Address' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status="ACTIVE" label={wallet.algorithm || 'Dilithium-5'} />
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2 rounded-xl glass-lvl-1 border border-white/10 text-xs text-[#9AA6B2] hover:text-[#F5F7FA] flex items-center gap-1 font-tech"
            >
              <Download className="w-3.5 h-3.5" /> Export Keystore
            </button>
          </div>
        </div>

        {/* Balances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(wallet.balances).map((asset) => (
            <div key={asset.symbol} className="p-4 rounded-xl glass-lvl-1 border border-white/5 space-y-1">
              <div className="text-[11px] text-[#9AA6B2] font-tech flex items-center justify-between">
                <span>{asset.name}</span>
                <span className="text-[#00A8FF] font-bold">{asset.symbol}</span>
              </div>
              <div className="text-lg font-tech font-bold text-[#F5F7FA]">
                {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <div className="text-[11px] text-[#66717D]">
                ≈ ${(asset.balance * (asset.symbol === 'GXQ' ? (market.tickers.GXQ?.price || 3465.8) : asset.symbol === 'ETH' ? (market.tickers.ETH?.price || 3465.8) : 1)).toFixed(2)} USD
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Wallet Dashboard Visualization */}
      <WalletDashboard balances={wallet.balances} />
      <StakingDashboard />

      {/* Send & Receive Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Asset Card */}
        <GlassCard level={2} className="p-6 space-y-4">
          <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#00A8FF]" />
            Send Assets with Dilithium Authorization
          </h3>

          <div className="space-y-3 font-tech text-xs">
            <div className="space-y-1">
              <label className="text-[#9AA6B2]">DESTINATION QUANTUM OR EVM ADDRESS</label>
              <input
                type="text"
                placeholder="gxq1q... or 0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 font-mono text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#9AA6B2]">SELECT ASSET</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 font-bold text-[#00A8FF] focus:outline-none cursor-pointer"
                >
                  {Object.keys(wallet.balances).map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#9AA6B2]">
                  <span>AMOUNT</span>
                  <span>Max: {(wallet.balances[selectedAsset]?.balance || 0).toFixed(3)}</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030507] border border-white/10 text-sm font-bold text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl glass-lvl-1 border border-white/5 space-y-1 text-[#9AA6B2]">
              <div className="flex justify-between">
                <span>Estimated Gas:</span>
                <span className="text-[#F5F7FA] font-mono">0.00025 GXQ</span>
              </div>
              <div className="flex justify-between">
                <span>Signature Scheme:</span>
                <span className="text-[#00A8FF]">CRYSTALS-Dilithium-5 (256-bit PQC)</span>
              </div>
            </div>

            <button
              onClick={handleSendTransaction}
              disabled={isSending}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Signing with Dilithium Private Key...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SIGN & DISPATCH TRANSACTION
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* Receive Assets Card */}
        <GlassCard level={2} className="p-6 space-y-4">
          <h3 className="font-tech font-bold text-base text-[#F5F7FA] flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Receive Post-Quantum Assets
          </h3>

          <div className="p-6 rounded-xl glass-lvl-1 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            {/* Visual simulated QR block */}
            <div className="w-40 h-40 rounded-xl bg-white p-3 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              <div className="w-full h-full bg-[#030507] rounded-lg p-2 flex flex-col items-center justify-center border border-dashed border-[#00A8FF]">
                <ShieldCheck className="w-10 h-10 text-[#00A8FF] mb-1" />
                <span className="text-[10px] text-center font-mono text-[#00A8FF]">
                  GXQ-PQC-VAULT
                </span>
                <span className="text-[9px] text-[#66717D] mt-0.5">Dilithium-5</span>
              </div>
            </div>

            <div className="w-full space-y-1">
              <div className="text-xs text-[#9AA6B2] font-tech">YOUR RECEIVING ADDRESS</div>
              <div className="font-mono text-xs text-[#00A8FF] bg-[#030507] p-2.5 rounded-lg border border-white/5 break-all">
                {wallet.address}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(wallet.address, 'Receiving Address')}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00A8FF]/40 text-xs font-tech font-bold text-[#F5F7FA] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-[#00A8FF]" />
              COPY ADDRESS TO CLIPBOARD
            </button>
          </div>
        </GlassCard>
      </div>

      {/* 24-Word Mnemonic Generation Modal */}
      <Modal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        title="24-Word Quantum Recovery Seed Phrase"
        subtitle="Write down these words in exact order. Never reveal them to anyone."
      >
        {generatedSession && (
          <div className="space-y-5 text-xs font-tech">
            <div className="p-3.5 rounded-xl bg-[#FF304F]/10 border border-[#FF304F]/40 text-[#FF304F] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                SECURITY NOTICE: This mnemonic will never be shown again once you leave this screen.
              </span>
            </div>

            {/* 24 Words Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-[#030507]/90 p-4 rounded-xl border border-white/10 font-mono text-xs">
              {generatedSession.mnemonic.map((word, idx) => (
                <div key={idx} className="p-2 rounded bg-white/5 border border-white/5 flex items-center gap-1.5">
                  <span className="text-[#66717D] text-[10px] w-4">{idx + 1}.</span>
                  <span className="text-[#F5F7FA] font-bold">{word}</span>
                </div>
              ))}
            </div>

            {/* Derived Address Preview */}
            <div className="space-y-1">
              <div className="text-[#9AA6B2]">DERIVED DILITHIUM-5 ADDRESS:</div>
              <div className="font-mono text-[11px] text-[#00A8FF] bg-[#030507] p-2 rounded break-all">
                {generatedSession.keyPair.address}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="backupCheck"
                checked={hasBackedUp}
                onChange={(e) => setHasBackedUp(e.target.checked)}
                className="w-4 h-4 accent-[#00A8FF] cursor-pointer"
              />
              <label htmlFor="backupCheck" className="text-[#F5F7FA] cursor-pointer">
                I have securely written down and backed up this 24-word seed phrase offline.
              </label>
            </div>

            <button
              onClick={handleConfirmNewWallet}
              disabled={!hasBackedUp}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#008CFF] text-[#030507] font-bold text-sm hover:brightness-110 transition-all cursor-pointer disabled:opacity-40"
            >
              ACTIVATE NEW QUANTUM WALLET
            </button>
          </div>
        )}
      </Modal>

      {/* Export Encrypted Keystore Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportedKeystoreJson(null);
        }}
        title="Export Encrypted Keystore (JSON)"
        subtitle="Standard PBKDF2 + AES-GCM encrypted backup without exposing plaintext secrets"
      >
        <div className="space-y-4 text-xs font-tech">
          {!exportedKeystoreJson ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[#9AA6B2]">CREATE ENCRYPTION PASSPHRASE</label>
                <input
                  type="password"
                  placeholder="Min 8 characters..."
                  value={keystorePassphrase}
                  onChange={(e) => setKeystorePassphrase(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#030507] border border-white/10 text-sm font-mono text-[#F5F7FA] focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <button
                onClick={handleExportKeystore}
                className="w-full py-3.5 rounded-xl bg-[#00A8FF] text-[#030507] font-bold hover:brightness-110 cursor-pointer"
              >
                ENCRYPT & GENERATE KEYSTORE JSON
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Keystore JSON Ready
              </div>
              <textarea
                readOnly
                rows={10}
                value={exportedKeystoreJson}
                className="w-full p-3 rounded-xl bg-[#030507] border border-white/10 font-mono text-[11px] text-[#00A8FF] focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(exportedKeystoreJson, 'Keystore JSON')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F5F7FA] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#00A8FF]" /> Copy Keystore JSON
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
