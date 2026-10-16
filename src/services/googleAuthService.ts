import { GoogleUser, TopUser, StakingPool, WhaleActivity } from '../types/blockchain';
import { computeSha256 } from './quantumCrypto';
import { telemetry } from './telemetryService';

const ADMIN_EMAIL = 'gxqstudio@gmail.com';
const STORAGE_KEY = 'gxq_google_auth_user_v2';

export const INITIAL_TOP_USERS: TopUser[] = [
  {
    rank: 1,
    name: 'Satoshi Quantum Labs',
    emailMasked: 'sat***@quantumlabs.org',
    address: 'gxq1q88a91c0b2df7e44a1b023910ff9821a7cd91',
    tier: 'QUANTUM_WHALE',
    totalStakedGXQ: 425000,
    volume30dUsd: 18450000,
    yieldApyPercent: 24.8,
    txCount: 3840,
    reputationScore: 99.4,
    shardAffinity: 0,
    isOnline: true,
  },
  {
    rank: 2,
    name: 'Aethelgard Capital',
    emailMasked: 'aeth***@institutions.ch',
    address: 'gxq1q92f33b1e847cd9910ae2839b1a03918f4e22',
    tier: 'QUANTUM_WHALE',
    totalStakedGXQ: 310000,
    volume30dUsd: 14200000,
    yieldApyPercent: 23.2,
    txCount: 2910,
    reputationScore: 98.9,
    shardAffinity: 1,
    isOnline: true,
  },
  {
    rank: 3,
    name: 'Dilithium Prime Validator',
    emailMasked: 'node***@dilithium.network',
    address: 'gxq1q38cc910fe2847ba1192834b910248fa7102e',
    tier: 'DIAMOND_VALIDATOR',
    totalStakedGXQ: 198000,
    volume30dUsd: 8900000,
    yieldApyPercent: 21.5,
    txCount: 4290,
    reputationScore: 99.8,
    shardAffinity: 0,
    isOnline: true,
  },
  {
    rank: 4,
    name: 'Hyperion Liquidity DAO',
    emailMasked: 'treasury***@hyperiondao.eth',
    address: 'gxq1q77ba01f82e741cc9910ae3382910fa9821bc',
    tier: 'DIAMOND_VALIDATOR',
    totalStakedGXQ: 145000,
    volume30dUsd: 11200000,
    yieldApyPercent: 22.1,
    txCount: 5120,
    reputationScore: 97.6,
    shardAffinity: 1,
    isOnline: false,
  },
  {
    rank: 5,
    name: 'CyberNomad.eth',
    emailMasked: 'cyb***@gmail.com',
    address: 'gxq1q55fe8210ba947192834cd9910283fa7101bb',
    tier: 'CYBER_TRADER',
    totalStakedGXQ: 68000,
    volume30dUsd: 6400000,
    yieldApyPercent: 19.4,
    txCount: 1840,
    reputationScore: 95.8,
    shardAffinity: 2,
    isOnline: true,
  },
  {
    rank: 6,
    name: 'Vortex Shard Arbitrageur',
    emailMasked: 'vort***@quant-alpha.io',
    address: 'gxq1q44ae10ba9283741cc8810293847fa10928cd',
    tier: 'CYBER_TRADER',
    totalStakedGXQ: 42000,
    volume30dUsd: 4900000,
    yieldApyPercent: 18.9,
    txCount: 3410,
    reputationScore: 94.2,
    shardAffinity: 1,
    isOnline: true,
  },
  {
    rank: 7,
    name: 'ZeroKnowledge Guild',
    emailMasked: 'dev***@zk-guild.org',
    address: 'gxq1q11aa29384710ba98210fe83471029384710a',
    tier: 'PRO_BUILDER',
    totalStakedGXQ: 25000,
    volume30dUsd: 2100000,
    yieldApyPercent: 17.5,
    txCount: 920,
    reputationScore: 96.5,
    shardAffinity: 2,
    isOnline: true,
  },
];

export const INITIAL_WHALE_ACTIVITY: WhaleActivity[] = [
  {
    id: 'wh-01',
    timestamp: Date.now() - 140000,
    txHash: '0xQWH_98f10ae82310ba9921',
    from: 'gxq1q88a91c0b2df7e44a1b023910ff9821a7cd91',
    fromTag: 'Satoshi Quantum Labs',
    to: 'gxq1q_shard1_amm_pool_gxq_usdc',
    toTag: 'DEX AMM Pool #1',
    amountGXQ: 1250,
    usdValue: 4331250,
    shardId: 1,
    intent: 'DEX_SWAP',
  },
  {
    id: 'wh-02',
    timestamp: Date.now() - 480000,
    txHash: '0xQWH_77ba9102834fe81928',
    from: 'gxq1q92f33b1e847cd9910ae2839b1a03918f4e22',
    fromTag: 'Aethelgard Capital',
    to: 'gxq1q_lattice_validator_stake_root',
    toTag: 'PoQW Consensus Staking',
    amountGXQ: 5000,
    usdValue: 17325000,
    shardId: 0,
    intent: 'STAKE',
  },
  {
    id: 'wh-03',
    timestamp: Date.now() - 920000,
    txHash: '0xQWH_5510293847fe819028',
    from: 'gxq1q_bridge_custody_eth_mainnet',
    fromTag: 'Ethereum Bridge Vault',
    to: 'gxq1q38cc910fe2847ba1192834b910248fa7102e',
    toTag: 'Dilithium Prime Validator',
    amountGXQ: 850,
    usdValue: 2945250,
    shardId: 3,
    intent: 'BRIDGE_IN',
  },
  {
    id: 'wh-04',
    timestamp: Date.now() - 1500000,
    txHash: '0xQWH_3320192847ba910283',
    from: 'gxq1q_master_treasury_cold_storage',
    fromTag: 'GXQ Protocol Treasury',
    to: 'gxq1q_cross_shard_relayer_buffer',
    toTag: 'Cross-Shard Relayer Buffer',
    amountGXQ: 10000,
    usdValue: 34650000,
    shardId: 0,
    intent: 'TREASURY_MINT',
  },
];

export const INITIAL_STAKING_POOLS: StakingPool[] = [
  {
    id: 'pool-shard0-consensus',
    name: 'Shard-0 Prime Settlement Staking',
    shardId: 0,
    aprPercent: 24.8,
    totalStakedGXQ: 1250000,
    lockPeriodDays: 14,
    rewardsCurrency: 'GXQ',
    quantumShieldLevel: 'Lattice Shield Level 5',
    minStake: 1.0,
  },
  {
    id: 'pool-shard1-liquidity',
    name: 'Shard-1 High-Frequency DEX AMM Staking',
    shardId: 1,
    aprPercent: 28.4,
    totalStakedGXQ: 890000,
    lockPeriodDays: 7,
    rewardsCurrency: 'GXQ',
    quantumShieldLevel: 'Automated Slippage Shield',
    minStake: 0.5,
  },
  {
    id: 'pool-shard2-zkp',
    name: 'Shard-2 Enterprise Privacy & ZKP Relayer Pool',
    shardId: 2,
    aprPercent: 19.6,
    totalStakedGXQ: 640000,
    lockPeriodDays: 30,
    rewardsCurrency: 'USDC',
    quantumShieldLevel: 'Zero-Knowledge Cryptographic Gate',
    minStake: 2.0,
  },
  {
    id: 'pool-shard3-bridge',
    name: 'Shard-3 Cross-Chain Multi-Sig Bridge Insurance',
    shardId: 3,
    aprPercent: 21.2,
    totalStakedGXQ: 470000,
    lockPeriodDays: 21,
    rewardsCurrency: 'GXQ',
    quantumShieldLevel: 'Post-Quantum Threshold Multi-Sig',
    minStake: 1.0,
  },
];

class GoogleAuthService {
  private currentUser: GoogleUser | null = null;
  private listeners: Set<(user: GoogleUser | null) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load Google User from localStorage:', e);
    }
  }

  public subscribe(cb: (user: GoogleUser | null) => void): () => void {
    this.listeners.add(cb);
    cb(this.currentUser);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public getCurrentUser(): GoogleUser | null {
    return this.currentUser;
  }

  public getAdminEmail(): string {
    return ADMIN_EMAIL;
  }

  public isSuperAdmin(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
  }

  /**
   * Deterministically derive a Post-Quantum Dilithium Smart Address from any email.
   * Format: gxq1q + [40 hex chars]
   */
  public async deriveSmartWalletFromEmail(email: string): Promise<{
    address: string;
    publicKeyHex: string;
    mnemonicWords: string[];
    derivationSalt: string;
  }> {
    const cleanEmail = email.toLowerCase().trim();
    const derivationSalt = 'GXQ_QUANTUM_SMART_WALLET_SALT_V2026';
    const hash1 = await computeSha256(`${cleanEmail}_${derivationSalt}_STAGE1`);
    const hash2 = await computeSha256(`${hash1}_STAGE2_LATTICE_POLYNOMIAL_RING`);
    const hash3 = await computeSha256(`${hash2}_STAGE3_DILITHIUM5_CHECKSUM`);

    const shortAddress = `gxq1q${hash2.slice(0, 36)}${hash3.slice(0, 4)}`;
    const publicKeyHex = `0xDLTH5_${hash1.slice(0, 32)}${hash2.slice(0, 32)}`;

    // Deterministic 12-word mnemonic sequence representation for recovery
    const bipWords = [
      'quantum', 'lattice', 'dilithium', 'shard', 'consensus',
      'settlement', 'bridge', 'atomic', 'validator', 'encryption',
      'entropy', 'signature', 'matrix', 'polynomial', 'shield'
    ];
    const mnemonicWords: string[] = [];
    for (let i = 0; i < 12; i++) {
      const charCode = hash2.charCodeAt(i % hash2.length);
      mnemonicWords.push(bipWords[charCode % bipWords.length]);
    }

    return {
      address: shortAddress,
      publicKeyHex,
      mnemonicWords,
      derivationSalt,
    };
  }

  /**
   * Execute Google Login
   * If email is not specified, defaults to gxqstudio@gmail.com or lets caller pass any user email
   */
  public async loginWithGoogle(
    email: string = ADMIN_EMAIL,
    name?: string,
    picture?: string
  ): Promise<GoogleUser> {
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    const smartWallet = await this.deriveSmartWalletFromEmail(cleanEmail);

    const displayName = name || (
      isAdmin
        ? 'GXQ Master Administrator'
        : `${cleanEmail.split('@')[0].toUpperCase()} Quantum Trader`
    );

    const avatarUrl = picture || (
      isAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}&backgroundColor=070b12`
    );

    const tier: GoogleUser['tier'] = isAdmin
      ? 'TITANIUM_SUPERADMIN'
      : cleanEmail.includes('whale')
      ? 'QUANTUM_WHALE'
      : 'CYBER_TRADER';

    const user: GoogleUser = {
      email: cleanEmail,
      name: displayName,
      picture: avatarUrl,
      isAdmin,
      quantumAddress: smartWallet.address,
      publicKeyHex: smartWallet.publicKeyHex,
      mnemonicWords: smartWallet.mnemonicWords,
      derivationSalt: smartWallet.derivationSalt,
      authTimestamp: Date.now(),
      tier,
      p2pTransfersCount: 0,
      referralCode: `GXQ-${cleanEmail.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referralEarningsGXQ: isAdmin ? 125.4 : 12.5,
    };

    this.currentUser = user;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user session to localStorage', e);
    }

    telemetry.track(
      isAdmin ? 'admin_login_success' : 'google_wallet_generated',
      cleanEmail,
      `Linked Google ID to Quantum Smart Address: ${smartWallet.address}. Admin: ${isAdmin}`,
      'SUCCESS'
    );

    this.notify();
    return user;
  }

  /**
   * Logout current Google user
   */
  public logout() {
    const previousEmail = this.currentUser?.email || 'unknown';
    this.currentUser = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove user session from localStorage', e);
    }

    telemetry.track(
      'google_logout',
      previousEmail,
      'User logged out of Google SSO & Smart Wallet session unlinked',
      'SUCCESS'
    );

    this.notify();
  }
}

export const googleAuth = new GoogleAuthService();
