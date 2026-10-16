import { BridgeTransfer } from '../types/blockchain';
import { blockchain } from './blockchainService';
import { computeSha256 } from './quantumCrypto';
import { telemetry } from './telemetryService';

export const SUPPORTED_CHAINS = [
  { id: 'gxq-shard-0', name: 'GXQ Shard-0 (Prime Settlement)', isGXQ: true },
  { id: 'gxq-shard-1', name: 'GXQ Shard-1 (High-Freq DeFi)', isGXQ: true },
  { id: 'gxq-shard-2', name: 'GXQ Shard-2 (Enterprise Privacy)', isGXQ: true },
  { id: 'ethereum', name: 'Ethereum Mainnet (L1)', isGXQ: false },
  { id: 'arbitrum', name: 'Arbitrum One (L2 Rollup)', isGXQ: false },
  { id: 'solana', name: 'Solana (SVM)', isGXQ: false },
  { id: 'polygon', name: 'Polygon PoS', isGXQ: false },
  { id: 'bsc', name: 'BNB Smart Chain', isGXQ: false },
];

export const BRIDGEABLE_ASSETS = ['USDC', 'GXQ', 'ETH', 'BTC'];

class BridgeService {
  private transfers: BridgeTransfer[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.seedHistoricalTransfers();
  }

  private seedHistoricalTransfers(): void {
    this.transfers = [
      {
        id: 'BRG-10948',
        sourceChain: 'Ethereum Mainnet (L1)',
        targetChain: 'GXQ Shard-0 (Prime Settlement)',
        sender: '0x71C...4982',
        recipient: 'gxq1q88fa9018471928374a',
        asset: 'USDC',
        amount: 25000,
        fee: 4.5,
        status: 'COMPLETED',
        step: 4,
        txHashSource: '0xETH_88FA9123847192847192837491823749',
        txHashTarget: '0xTX_GXQ_BRIDGED_USDC_998124',
        multisigAttestations: 7,
        requiredAttestations: 7,
        timestamp: Date.now() - 4800000,
      },
      {
        id: 'BRG-10949',
        sourceChain: 'Arbitrum One (L2 Rollup)',
        targetChain: 'GXQ Shard-1 (High-Freq DeFi)',
        sender: '0x32A...1842',
        recipient: 'gxq1q482019482019482019482019',
        asset: 'GXQ',
        amount: 8.5,
        fee: 0.0012,
        status: 'COMPLETED',
        step: 4,
        txHashSource: '0xARB_19847102938471029384710',
        txHashTarget: '0xTX_GXQ_BRIDGED_GXQ_112049',
        multisigAttestations: 7,
        requiredAttestations: 7,
        timestamp: Date.now() - 1800000,
      },
    ];
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getTransfers(): BridgeTransfer[] {
    return this.transfers;
  }

  public async initiateBridge(params: {
    sourceChain: string;
    targetChain: string;
    sender: string;
    recipient: string;
    asset: string;
    amount: number;
    onProgress?: (transfer: BridgeTransfer) => void;
  }): Promise<BridgeTransfer> {
    const fee = params.asset === 'USDC' ? 2.5 : 0.001;
    const totalRequired = params.amount + (params.asset === 'USDC' ? fee : 0);

    // Verify balance if initiating from GXQ or local wallet
    const balances = blockchain.getUserBalances();
    const userAsset = balances[params.asset];
    if (userAsset && userAsset.balance < totalRequired) {
      throw new Error(`Insufficient ${params.asset} balance. Required: ${totalRequired}, Available: ${userAsset.balance.toFixed(4)}`);
    }

    if (userAsset) {
      blockchain.debitAsset(params.asset, params.amount);
      if (params.asset === 'GXQ') {
        blockchain.debitAsset('GXQ', fee);
      }
    }

    const id = `BRG-${Math.floor(Math.random() * 90000) + 10000}`;
    const txHashSource = `0xSRC_${await computeSha256(params.sourceChain + id + Date.now().toString())}`.slice(0, 42);

    const transfer: BridgeTransfer = {
      id,
      sourceChain: params.sourceChain,
      targetChain: params.targetChain,
      sender: params.sender,
      recipient: params.recipient,
      asset: params.asset,
      amount: params.amount,
      fee,
      status: 'INITIATED',
      step: 1,
      txHashSource,
      multisigAttestations: 1,
      requiredAttestations: 7,
      timestamp: Date.now(),
    };

    this.transfers = [transfer, ...this.transfers];
    this.notify();
    params.onProgress?.(transfer);

    await telemetry.record(
      'BRIDGE_INITIATED',
      params.sender,
      `Initiated cross-chain bridge transfer of ${params.amount} ${params.asset} from ${params.sourceChain} to ${params.targetChain}.`,
      'SUCCESS'
    );

    // Step 2: Relayer Attestation simulation
    await new Promise(r => setTimeout(r, 1200));
    transfer.step = 2;
    transfer.status = 'ATTESTED';
    transfer.multisigAttestations = 5;
    this.notify();
    params.onProgress?.(transfer);

    // Step 3: Dilithium Merkle Proof Verification
    await new Promise(r => setTimeout(r, 1200));
    transfer.step = 3;
    transfer.status = 'VERIFIED';
    transfer.multisigAttestations = 7;
    this.notify();
    params.onProgress?.(transfer);

    // Step 4: Mint / Release on Target
    await new Promise(r => setTimeout(r, 1000));
    const txHashTarget = `0xTGT_${await computeSha256(params.targetChain + id + Date.now().toString())}`.slice(0, 42);
    transfer.step = 4;
    transfer.status = 'COMPLETED';
    transfer.txHashTarget = txHashTarget;

    // If target is GXQ network, credit recipient
    if (params.targetChain.includes('GXQ')) {
      blockchain.creditAsset(params.asset, params.amount);
    }

    await telemetry.record(
      'BRIDGE_COMPLETED',
      params.recipient,
      `Bridge transfer ${id} verified and completed on ${params.targetChain}. TX: ${txHashTarget}`,
      'SUCCESS'
    );

    this.notify();
    params.onProgress?.(transfer);
    return transfer;
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const bridgeService = new BridgeService();
