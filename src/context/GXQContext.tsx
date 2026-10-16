import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  QuantumBlock,
  QuantumTransaction,
  ShardInfo,
  ValidatorNode,
  SmartContract,
  LaunchpadToken,
  AssetBalance,
  FlashType,
  AuditEvent,
  GoogleUser,
  TopUser,
  WhaleActivity,
  StakingPool
} from '../types/blockchain';
import { blockchain } from '../services/blockchainService';
import { marketProvider, MarketState } from '../services/marketService';
import { telemetry } from '../services/telemetryService';
import {
  generateQuantumMnemonic,
  deriveQuantumAddress,
  GeneratedWalletSession
} from '../services/quantumCrypto';
import {
  googleAuth,
  INITIAL_TOP_USERS,
  INITIAL_WHALE_ACTIVITY,
  INITIAL_STAKING_POOLS
} from '../services/googleAuthService';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warn' | 'error';
  timestamp: number;
}

interface WalletState {
  connected: boolean;
  address: string;
  isQuantum: boolean;
  algorithm: string;
  balanceGXQ: number;
  balances: Record<string, AssetBalance>;
  emailLinked?: string;
  authMethod?: 'GOOGLE_SSO' | 'NATIVE_DILITHIUM' | 'EXTERNAL_EVM';
}

export type AppTab = 
  | 'dashboard'
  | 'explorer'
  | 'swap'
  | 'mining'
  | 'contracts'
  | 'bridge'
  | 'launchpad'
  | 'top_users'
  | 'wallet'
  | 'analytics'
  | 'ai'
  | 'control_plane'
  | 'security'
  | 'docs'
  | 'architecture'
  | 'whitepaper'
  | 'enterprise'
  | 'brand';

interface GXQContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  wallet: WalletState;
  connectWallet: (address?: string) => Promise<void>;
  disconnectWallet: () => void;
  connectExternalWallet: () => Promise<void>;
  createQuantumWallet: () => Promise<GeneratedWalletSession>;
  googleUser: GoogleUser | null;
  loginWithGoogle: (email?: string, name?: string) => Promise<GoogleUser>;
  logoutGoogle: () => void;
  isSuperAdmin: boolean;
  topUsers: TopUser[];
  whaleActivity: WhaleActivity[];
  stakingPools: StakingPool[];
  executeP2PTransfer: (target: string, amount: number, note?: string) => Promise<{ success: boolean; txHash: string; error?: string }>;
  executeStake: (poolId: string, amount: number) => Promise<{ success: boolean; txHash: string }>;
  market: MarketState;
  blocks: QuantumBlock[];
  transactions: QuantumTransaction[];
  shards: ShardInfo[];
  validators: ValidatorNode[];
  contracts: SmartContract[];
  launchpadTokens: LaunchpadToken[];
  auditEvents: AuditEvent[];
  flashState: { type: FlashType | null; active: boolean };
  triggerFlash: (type: FlashType) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  removeToast: (id: string) => void;
  isReducedMotion: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const GXQContext = createContext<GXQContextType | null>(null);

export const GXQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<AppTab>('dashboard');
  const [market, setMarket] = useState<MarketState>(marketProvider.getState());
  const [blocks, setBlocks] = useState<QuantumBlock[]>(blockchain.getBlocks());
  const [transactions, setTransactions] = useState<QuantumTransaction[]>(blockchain.getTransactions());
  const [shards, setShards] = useState<ShardInfo[]>(blockchain.getShards());
  const [validators, setValidators] = useState<ValidatorNode[]>(blockchain.getValidators());
  const [contracts, setContracts] = useState<SmartContract[]>(blockchain.getContracts());
  const [launchpadTokens, setLaunchpadTokens] = useState<LaunchpadToken[]>(blockchain.getLaunchpadTokens());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(telemetry.getEvents());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(googleAuth.getCurrentUser());
  const [topUsers, setTopUsers] = useState<TopUser[]>(INITIAL_TOP_USERS);
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>(INITIAL_WHALE_ACTIVITY);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>(INITIAL_STAKING_POOLS);

  const isSuperAdmin = Boolean(
    googleUser && googleUser.email.toLowerCase().trim() === 'gxqstudio@gmail.com'
  );

  // Default connected demo quantum account
  const [wallet, setWallet] = useState<WalletState>(() => {
    const initialG = googleAuth.getCurrentUser();
    if (initialG) {
      return {
        connected: true,
        address: initialG.quantumAddress,
        isQuantum: true,
        algorithm: 'CRYSTALS-Dilithium-5',
        balanceGXQ: 25.0,
        balances: blockchain.getUserBalances(),
        emailLinked: initialG.email,
        authMethod: 'GOOGLE_SSO',
      };
    }
    return {
      connected: true,
      address: 'gxq1q88fa9018471928374a09182374918237490',
      isQuantum: true,
      algorithm: 'CRYSTALS-Dilithium-5',
      balanceGXQ: 14.850,
      balances: blockchain.getUserBalances(),
    };
  });

  // Subscribe to Google Auth changes
  useEffect(() => {
    const unsub = googleAuth.subscribe((u) => {
      setGoogleUser(u);
      if (u) {
        const balances = blockchain.getUserBalances();
        setWallet(prev => ({
          ...prev,
          connected: true,
          address: u.quantumAddress,
          isQuantum: true,
          algorithm: 'CRYSTALS-Dilithium-5',
          emailLinked: u.email,
          authMethod: 'GOOGLE_SSO',
          balanceGXQ: balances.GXQ?.balance || 25.0,
          balances,
        }));
      }
    });
    return unsub;
  }, []);

  const [flashState, setFlashState] = useState<{ type: FlashType | null; active: boolean }>({
    type: null,
    active: false,
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subscribe to market data updates
  useEffect(() => {
    const unsubscribe = marketProvider.subscribe((latestMarket) => {
      setMarket(latestMarket);
    });
    return unsubscribe;
  }, []);

  // Subscribe to blockchain state updates
  useEffect(() => {
    const unsubscribe = blockchain.subscribe(() => {
      setBlocks([...blockchain.getBlocks()]);
      setTransactions([...blockchain.getTransactions()]);
      setShards([...blockchain.getShards()]);
      setValidators([...blockchain.getValidators()]);
      setContracts([...blockchain.getContracts()]);
      setLaunchpadTokens([...blockchain.getLaunchpadTokens()]);
      
      const balances = blockchain.getUserBalances();
      setWallet(prev => ({
        ...prev,
        balanceGXQ: balances.GXQ?.balance || 0,
        balances: { ...balances },
      }));
    });
    return unsubscribe;
  }, []);

  // Subscribe to telemetry
  useEffect(() => {
    const unsubscribe = telemetry.subscribe((events) => {
      setAuditEvents([...events]);
    });
    return unsubscribe;
  }, []);

  const addToast = useCallback((title: string, description: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast: ToastMessage = { id, title, description, type, timestamp: Date.now() };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerFlash = useCallback((type: FlashType) => {
    if (isReducedMotion) return;
    setFlashState({ type, active: true });
    setTimeout(() => {
      setFlashState({ type: null, active: false });
    }, 850);
  }, [isReducedMotion]);

  const setActiveTab = useCallback((tab: AppTab) => {
    setActiveTabState(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
    telemetry.record('NAVIGATE', wallet.address || 'GUEST', `Navigated to module: ${tab.toUpperCase()}`, 'SUCCESS');
  }, [wallet.address, isReducedMotion]);

  const connectWallet = useCallback(async (customAddress?: string) => {
    const addr = customAddress || 'gxq1q88fa9018471928374a09182374918237490';
    const balances = blockchain.getUserBalances();
    setWallet({
      connected: true,
      address: addr,
      isQuantum: true,
      algorithm: 'CRYSTALS-Dilithium-5',
      balanceGXQ: balances.GXQ?.balance || 14.85,
      balances,
    });
    triggerFlash('WALLET_FLASH');
    addToast('Quantum Wallet Connected', `Active address: ${addr.slice(0, 10)}...${addr.slice(-6)} (Dilithium-5)`, 'success');
    await telemetry.record('WALLET_CONNECT', addr, 'Quantum wallet session initialized with NIST Level 5 verification.', 'SUCCESS');
  }, [triggerFlash, addToast]);

  const disconnectWallet = useCallback(() => {
    const oldAddr = wallet.address;
    setWallet({
      connected: false,
      address: '',
      isQuantum: false,
      algorithm: '',
      balanceGXQ: 0,
      balances: {},
    });
    triggerFlash('BLUE_FLASH');
    addToast('Wallet Disconnected', 'Session cleared securely from runtime memory.', 'info');
    telemetry.record('WALLET_DISCONNECT', oldAddr || 'USER', 'Wallet session terminated.', 'SUCCESS');
  }, [wallet.address, triggerFlash, addToast]);

  const connectExternalWallet = useCallback(async () => {
    // Check if browser has window.ethereum
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          const ethAddr = accounts[0];
          setWallet({
            connected: true,
            address: ethAddr,
            isQuantum: false,
            algorithm: 'Secp256k1 (Bridged to Dilithium Adapter)',
            balanceGXQ: blockchain.getUserBalances().GXQ?.balance || 14.85,
            balances: blockchain.getUserBalances(),
          });
          triggerFlash('SUCCESS_FLASH');
          addToast('External Wallet Linked', `Connected ${ethAddr.slice(0, 8)}... via EVM Adapter`, 'success');
          await telemetry.record('WALLET_CONNECT_EXTERNAL', ethAddr, 'Connected browser EVM wallet with GXQ bridge adapter.', 'SUCCESS');
          return;
        }
      } catch (err: any) {
        addToast('Connection Rejected', err?.message || 'External wallet connection was rejected by user.', 'error');
        return;
      }
    }
    // If no window.ethereum, notify user and use internal quantum generation
    addToast('No Browser Web3 Extension Found', 'Using GXQ Native Quantum Lattice Wallet instead.', 'warn');
    await connectWallet();
  }, [addToast, connectWallet, triggerFlash]);

  const createQuantumWallet = useCallback(async (): Promise<GeneratedWalletSession> => {
    const mnemonic = generateQuantumMnemonic();
    const keyPair = await deriveQuantumAddress(mnemonic.join(' '));
    const session: GeneratedWalletSession = {
      mnemonic,
      keyPair,
      createdAt: Date.now(),
    };

    triggerFlash('WALLET_FLASH');
    await telemetry.record('WALLET_GENERATE', keyPair.address, 'Generated new Dilithium-5 quantum lattice keypair.', 'SUCCESS');
    return session;
  }, [triggerFlash]);

  const loginWithGoogle = useCallback(async (email?: string, name?: string): Promise<GoogleUser> => {
    const user = await googleAuth.loginWithGoogle(email, name);
    triggerFlash(user.isAdmin ? 'RED_FLASH' : 'WALLET_FLASH');
    addToast(
      user.isAdmin ? 'Super-Admin Authenticated' : 'Google Smart Wallet Ready',
      `Smart Address: ${user.quantumAddress.slice(0, 10)}...${user.quantumAddress.slice(-6)} linked to ${user.email}`,
      user.isAdmin ? 'warn' : 'success'
    );
    return user;
  }, [triggerFlash, addToast]);

  const logoutGoogle = useCallback(() => {
    googleAuth.logout();
    triggerFlash('BLUE_FLASH');
    addToast('Signed Out of Google', 'Smart wallet unlinked. Reverted to anonymous guest mode.', 'info');
  }, [triggerFlash, addToast]);

  const executeP2PTransfer = useCallback(async (
    target: string,
    amount: number,
    note?: string
  ): Promise<{ success: boolean; txHash: string; error?: string }> => {
    if (amount <= 0 || amount > wallet.balanceGXQ) {
      addToast('Transfer Failed', 'Insufficient available GXQ balance.', 'error');
      return { success: false, txHash: '', error: 'Insufficient balance' };
    }

    triggerFlash('ORANGE_FLASH');
    const txHash = `0xQP2P_${Math.random().toString(16).slice(2, 14)}${Date.now().toString(16)}`;

    // Resolve target if it's an email
    let resolvedAddress = target;
    if (target.includes('@')) {
      const derived = await googleAuth.deriveSmartWalletFromEmail(target);
      resolvedAddress = derived.address;
    }

    // Deduct user balance
    blockchain.updateUserBalance('GXQ', -amount);

    addToast(
      'P2P Quantum Transfer Sent',
      `Sent ${amount.toFixed(4)} GXQ to ${resolvedAddress.slice(0, 10)}...${resolvedAddress.slice(-6)}${note ? ` ("${note}")` : ''}`,
      'success'
    );

    await telemetry.record(
      'P2P_TRANSFER',
      wallet.address,
      `P2P Dilithium Transfer of ${amount} GXQ to ${resolvedAddress}. Tx: ${txHash}`,
      'SUCCESS'
    );

    return { success: true, txHash };
  }, [wallet.balanceGXQ, wallet.address, triggerFlash, addToast]);

  const executeStake = useCallback(async (
    poolId: string,
    amount: number
  ): Promise<{ success: boolean; txHash: string }> => {
    if (amount <= 0 || amount > wallet.balanceGXQ) {
      addToast('Staking Failed', 'Insufficient GXQ balance to stake.', 'error');
      return { success: false, txHash: '' };
    }

    triggerFlash('YELLOW_FLASH');
    const txHash = `0xQSTK_${Math.random().toString(16).slice(2, 14)}`;

    blockchain.updateUserBalance('GXQ', -amount);

    setStakingPools(prev => prev.map(p => {
      if (p.id === poolId) {
        return { ...p, totalStakedGXQ: p.totalStakedGXQ + amount };
      }
      return p;
    }));

    addToast(
      'Quantum Staking Active',
      `Staked ${amount} GXQ into ${poolId}. Yield accrual started.`,
      'success'
    );

    await telemetry.record(
      'STAKE_DEPOSIT',
      wallet.address,
      `Staked ${amount} GXQ in ${poolId}. Tx: ${txHash}`,
      'SUCCESS'
    );

    return { success: true, txHash };
  }, [wallet.balanceGXQ, wallet.address, triggerFlash, addToast]);

  return (
    <GXQContext.Provider
      value={{
        activeTab,
        setActiveTab,
        wallet,
        connectWallet,
        disconnectWallet,
        connectExternalWallet,
        createQuantumWallet,
        googleUser,
        loginWithGoogle,
        logoutGoogle,
        isSuperAdmin,
        topUsers,
        whaleActivity,
        stakingPools,
        executeP2PTransfer,
        executeStake,
        market,
        blocks,
        transactions,
        shards,
        validators,
        contracts,
        launchpadTokens,
        auditEvents,
        flashState,
        triggerFlash,
        toasts,
        addToast,
        removeToast,
        isReducedMotion,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      <div className={`min-h-screen bg-[#030507] text-[#F5F7FA] relative selection:bg-[#00A8FF]/30 selection:text-[#00A8FF] ${flashState.active ? `flash-${flashState.type?.toLowerCase().replace('_flash', '')}-active` : ''}`}>
        {children}
      </div>
    </GXQContext.Provider>
  );
};

export const useGXQ = () => {
  const ctx = useContext(GXQContext);
  if (!ctx) throw new Error('useGXQ must be used within GXQProvider');
  return ctx;
};
