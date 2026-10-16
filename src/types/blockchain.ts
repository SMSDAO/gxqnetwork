export type NetworkStatus = 'LIVE' | 'DELAYED' | 'SYNCING' | 'OFFLINE';

export type FlashType = 
  | 'BLUE_FLASH'
  | 'ORANGE_FLASH'
  | 'RED_FLASH'
  | 'YELLOW_FLASH'
  | 'SUCCESS_FLASH'
  | 'ERROR_FLASH'
  | 'WALLET_FLASH'
  | 'LIVE_UPDATE_FLASH'
  | 'AI_INSIGHT_FLASH';

export type GlassLevel = 1 | 2 | 3 | 4;

export interface AssetBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon?: string;
  isNative?: boolean;
  address?: string;
}

export interface MarketTicker {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  bid: number;
  ask: number;
  volume24h: number;
  change24h: number;
  timestamp: string;
  source: string;
  status: NetworkStatus;
  totalSupply?: string;
  circulatingSupply?: string;
}

export interface QuantumBlock {
  height: number;
  hash: string;
  previousHash: string;
  shardId: number;
  proposer: string;
  timestamp: number;
  transactionsCount: number;
  gasUsed: number;
  gasLimit: number;
  quantumNonce: string;
  dilithiumRoot: string;
  stateRoot: string;
  rewardGXQ: number;
}

export interface QuantumTransaction {
  hash: string;
  blockHeight: number;
  timestamp: number;
  from: string;
  to: string;
  value: number;
  symbol: string;
  gasFee: number;
  shardId: number;
  targetShardId?: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  quantumSignature: string;
  signatureType: 'DILITHIUM-5' | 'FALCON-512' | 'SPHINCS+';
  isCrossShard?: boolean;
  dataPayload?: string;
}

export interface ShardInfo {
  id: number;
  name: string;
  description: string;
  tps: number;
  capacityTps: number;
  loadPercent: number;
  activeNodes: number;
  status: 'NOMINAL' | 'HIGH_THROUGHPUT' | 'MAINTENANCE';
  crossShardQueue: number;
}

export interface ValidatorNode {
  id: string;
  address: string;
  name: string;
  shardId: number;
  stakedGXQ: number;
  uptimePercent: number;
  latencyMs: number;
  totalBlocksProposed: number;
  slashingEvents: number;
  status: 'ACTIVE' | 'SYNCING' | 'JAILED';
  quantumKeyVerified: boolean;
}

export interface SmartContract {
  address: string;
  name: string;
  shardId: number;
  creator: string;
  deployedAtBlock: number;
  deployedAtTime: number;
  bytecode: string;
  abi: ContractAbiMethod[];
  verified: boolean;
  dilithiumSecured: boolean;
  state: Record<string, any>;
}

export interface ContractAbiMethod {
  name: string;
  type: 'function' | 'view';
  inputs: { name: string; type: string }[];
  outputs?: { name: string; type: string }[];
  description: string;
}

export interface BridgeTransfer {
  id: string;
  sourceChain: string;
  targetChain: string;
  sender: string;
  recipient: string;
  asset: string;
  amount: number;
  fee: number;
  status: 'INITIATED' | 'ATTESTED' | 'VERIFIED' | 'COMPLETED' | 'FAILED';
  step: 1 | 2 | 3 | 4;
  txHashSource: string;
  txHashTarget?: string;
  multisigAttestations: number;
  requiredAttestations: number;
  timestamp: number;
}

export interface LaunchpadToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  circulatingSupply: number;
  initialPriceUsd: number;
  hardCapUsd: number;
  raisedUsd: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'AUDITED';
  kycVerified: boolean;
  dilithiumAudited: boolean;
  creator: string;
  contractAddress: string;
  startDate: string;
  endDate: string;
  tags: string[];
}

export interface AISignal {
  id: string;
  type: 'market' | 'portfolio' | 'risk' | 'contract' | 'shard';
  insight: string;
  confidence: number;
  dataSources: string[];
  timestamp: string;
  reasoningSummary: string;
  actionAdvice: string;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  score: number;
}

export interface AuditEvent {
  id: string;
  correlationId: string;
  timestamp: string;
  eventType: string;
  actor: string;
  details: string;
  verificationHash: string;
  status: 'SUCCESS' | 'WARN' | 'CRITICAL';
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
  quantumAddress: string;
  publicKeyHex: string;
  mnemonicWords?: string[];
  derivationSalt: string;
  authTimestamp: number;
  tier: 'TITANIUM_SUPERADMIN' | 'QUANTUM_WHALE' | 'DIAMOND_VALIDATOR' | 'CYBER_TRADER' | 'PRO_BUILDER';
  p2pTransfersCount: number;
  referralCode: string;
  referralEarningsGXQ: number;
}

export interface TopUser {
  rank: number;
  name: string;
  emailMasked: string;
  address: string;
  tier: 'QUANTUM_WHALE' | 'DIAMOND_VALIDATOR' | 'CYBER_TRADER' | 'PRO_BUILDER';
  totalStakedGXQ: number;
  volume30dUsd: number;
  yieldApyPercent: number;
  txCount: number;
  reputationScore: number;
  shardAffinity: number;
  isOnline: boolean;
}

export interface WhaleActivity {
  id: string;
  timestamp: number;
  txHash: string;
  from: string;
  fromTag?: string;
  to: string;
  toTag?: string;
  amountGXQ: number;
  usdValue: number;
  shardId: number;
  intent: 'STAKE' | 'DEX_SWAP' | 'BRIDGE_OUT' | 'BRIDGE_IN' | 'TREASURY_MINT';
}

export interface StakingPool {
  id: string;
  name: string;
  shardId: number;
  aprPercent: number;
  totalStakedGXQ: number;
  lockPeriodDays: number;
  rewardsCurrency: 'GXQ' | 'USDC';
  quantumShieldLevel: string;
  minStake: number;
}

