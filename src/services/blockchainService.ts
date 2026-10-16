import {
  QuantumBlock,
  QuantumTransaction,
  ShardInfo,
  ValidatorNode,
  SmartContract,
  LaunchpadToken,
  AssetBalance
} from '../types/blockchain';
import { INITIAL_SHARDS, CONTRACT_TEMPLATES } from '../constants/tokens';
import { computeSha256, computeQuantumLatticeRoot, signQuantumPayload } from './quantumCrypto';
import { telemetry } from './telemetryService';

class BlockchainEngine {
  private blocks: QuantumBlock[] = [];
  private transactions: QuantumTransaction[] = [];
  private mempool: QuantumTransaction[] = [];
  private shards: ShardInfo[] = [...INITIAL_SHARDS];
  private validators: ValidatorNode[] = [];
  private contracts: SmartContract[] = [];
  private launchpadTokens: LaunchpadToken[] = [];
  private userBalances: Record<string, AssetBalance> = {
    GXQ: {
      symbol: 'GXQ',
      name: 'GXQ Network Prime',
      balance: 14.850,
      usdValue: 14.850 * 3465.80,
      change24h: 2.45,
      isNative: true,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin (Bridged)',
      balance: 12500.00,
      usdValue: 12500.00,
      change24h: 0.01,
      isNative: false,
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum (Wrapped L1)',
      balance: 3.250,
      usdValue: 3.250 * 3465.80,
      change24h: 2.45,
      isNative: false,
    },
    BTC: {
      symbol: 'BTC',
      name: 'Quantum Bitcoin (qBTC)',
      balance: 0.420,
      usdValue: 0.420 * 94820.00,
      change24h: 1.82,
      isNative: false,
    },
    SOL: {
      symbol: 'SOL',
      name: 'Solana (Wormhole Bridge)',
      balance: 24.50,
      usdValue: 24.50 * 198.40,
      change24h: -0.65,
      isNative: false,
    },
  };

  private listeners: Set<() => void> = new Set();
  private blockInterval: any = null;

  constructor() {
    this.initGenesis();
    this.initValidators();
    this.initPrebuiltContracts();
    this.initLaunchpadTokens();
    this.startBlockProduction();
  }

  private async initGenesis(): Promise<void> {
    const genesisTime = Date.now() - 3600000;
    const genesisRoot = await computeQuantumLatticeRoot(['GENESIS_POST_QUANTUM_LATTICE_SEED', 'GXQ_NETWORK_SHARDS_4']);
    
    const genesisBlock: QuantumBlock = {
      height: 1048200,
      hash: '0xQ_GENESIS_89fa7b401e9c20a84d2f0914c67eb21',
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      shardId: 0,
      proposer: 'gxq1q9a8c7e2b1049385710f82937401928374a',
      timestamp: genesisTime,
      transactionsCount: 84,
      gasUsed: 4210000,
      gasLimit: 30000000,
      quantumNonce: '0xQN_88FA9120',
      dilithiumRoot: genesisRoot,
      stateRoot: '0xSR_LATTICE_0019A820E',
      rewardGXQ: 2.5,
    };

    this.blocks = [genesisBlock];

    // Seed realistic recent blocks
    for (let i = 1; i <= 8; i++) {
      const height = genesisBlock.height + i;
      const prev = this.blocks[this.blocks.length - 1];
      const shardId = i % 4;
      const bTime = genesisTime + i * 2500;
      const bHash = `0xQ_${await computeSha256(height.toString() + prev.hash)}`;
      const dilithium = await computeQuantumLatticeRoot([bHash, shardId.toString()]);

      const block: QuantumBlock = {
        height,
        hash: bHash.slice(0, 42),
        previousHash: prev.hash,
        shardId,
        proposer: `gxq1q${bHash.slice(10, 46)}`,
        timestamp: bTime,
        transactionsCount: Math.floor(Math.random() * 45) + 20,
        gasUsed: Math.floor(Math.random() * 8000000) + 3000000,
        gasLimit: 30000000,
        quantumNonce: `0xQN_${Math.floor(Math.random() * 1000000).toString(16)}`,
        dilithiumRoot: dilithium.slice(0, 36),
        stateRoot: `0xSR_${bHash.slice(12, 34)}`,
        rewardGXQ: 2.5,
      };
      this.blocks.unshift(block); // Latest first
    }

    // Seed recent transactions
    this.seedRecentTransactions();
  }

  private seedRecentTransactions(): void {
    const symbols = ['GXQ', 'USDC', 'ETH'];
    for (let i = 0; i < 12; i++) {
      const sym = symbols[i % symbols.length];
      const val = sym === 'GXQ' ? +(Math.random() * 4 + 0.5).toFixed(3) : sym === 'USDC' ? +(Math.random() * 2500 + 100).toFixed(2) : +(Math.random() * 1.5 + 0.1).toFixed(3);
      const isCross = i % 3 === 0;
      
      this.transactions.push({
        hash: `0xTX_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`.toUpperCase(),
        blockHeight: this.blocks[0].height - (i % 5),
        timestamp: Date.now() - (i * 35000),
        from: `gxq1q${Math.random().toString(36).slice(2, 14)}`,
        to: `gxq1q${Math.random().toString(36).slice(2, 14)}`,
        value: val,
        symbol: sym,
        gasFee: 0.00018,
        shardId: i % 4,
        targetShardId: isCross ? (i + 1) % 4 : undefined,
        status: 'SUCCESS',
        quantumSignature: `DLTH5_SIG_${Math.random().toString(36).slice(2, 14)}`,
        signatureType: 'DILITHIUM-5',
        isCrossShard: isCross,
      });
    }
  }

  private initValidators(): void {
    const names = [
      'Apex Quantum Sentinel Alpha',
      'Helios Dilithium Validator Node',
      'CyberLattice Global Node 01',
      'Orion Shard-1 High-Freq Proposer',
      'Chronos Zero-Knowledge Staker',
      'Valkyrie Cross-Chain Relayer',
      'Vortex Quantum Shard Guardian',
      'Titan Dilithium Staking Node'
    ];

    this.validators = names.map((name, idx) => ({
      id: `VAL-${idx + 1}`,
      address: `gxq1q${Math.random().toString(36).slice(2, 18)}9482`,
      name,
      shardId: idx % 4,
      stakedGXQ: Math.floor(Math.random() * 45000) + 12000,
      uptimePercent: +(99.8 + Math.random() * 0.19).toFixed(2),
      latencyMs: Math.floor(Math.random() * 35) + 12,
      totalBlocksProposed: Math.floor(Math.random() * 12000) + 4000,
      slashingEvents: 0,
      status: 'ACTIVE',
      quantumKeyVerified: true,
    }));
  }

  private initPrebuiltContracts(): void {
    CONTRACT_TEMPLATES.forEach((tmpl, idx) => {
      this.contracts.push({
        address: `0xQC_${Math.random().toString(36).slice(2, 12)}${idx}`.toUpperCase(),
        name: tmpl.name,
        shardId: idx % 4,
        creator: 'gxq1q_core_foundation_deployer_001',
        deployedAtBlock: 1048200,
        deployedAtTime: Date.now() - 1200000,
        bytecode: `608060405234801561001057600080fd5b50604051610${idx}80380380610${idx}...[QWASM_DILITHIUM]`,
        abi: tmpl.abi as any,
        verified: true,
        dilithiumSecured: true,
        state: {
          totalSupply: '50,000,000 QSC',
          isReleased: false,
          totalStaked: '1,420,800 GXQ'
        }
      });
    });
  }

  private initLaunchpadTokens(): void {
    this.launchpadTokens = [
      {
        id: 'token-gxq',
        name: 'GXQ Network Prime Token',
        symbol: 'GXQ',
        description: 'Native L1 token matching Ethereum total supply and pricing benchmark with post-quantum Dilithium-5 security.',
        totalSupply: 120450000,
        circulatingSupply: 78210500,
        initialPriceUsd: 3465.80,
        hardCapUsd: 417450000000,
        raisedUsd: 270905000000,
        status: 'AUDITED',
        kycVerified: true,
        dilithiumAudited: true,
        creator: 'gxq1q_quantum_governance_multisig',
        contractAddress: '0xQC_NATIVE_GXQ_PROTOCOL_PRIME',
        startDate: '2024-06-01',
        endDate: '2030-12-31',
        tags: ['L1 Native', 'Proof-of-Quantum-Work', 'Dilithium-5', 'ETH-Parity']
      },
      {
        id: 'token-usdc',
        name: 'USD Coin (GXQ Quantum Bridge)',
        symbol: 'USDC',
        description: 'Institutional dollar stablecoin with multi-chain bridge support across Ethereum, Solana, Arbitrum, and GXQ Shards.',
        totalSupply: 45000000000,
        circulatingSupply: 32000000000,
        initialPriceUsd: 1.00,
        hardCapUsd: 45000000000,
        raisedUsd: 32000000000,
        status: 'AUDITED',
        kycVerified: true,
        dilithiumAudited: true,
        creator: 'gxq1q_circle_cross_chain_gateway',
        contractAddress: '0xQC_USDC_DILITHIUM_STABLE_VAULT',
        startDate: '2024-01-15',
        endDate: '2032-12-31',
        tags: ['Stablecoin', 'Cross-Chain Bridge', 'Liquidity Peg']
      },
      {
        id: 'token-qcompute',
        name: 'Quantum Compute Synthetic Token',
        symbol: 'QCP',
        description: 'Decentralized post-quantum computing lattice power credits for AI inference and zero-knowledge proofs.',
        totalSupply: 100000000,
        circulatingSupply: 42000000,
        initialPriceUsd: 14.50,
        hardCapUsd: 1450000000,
        raisedUsd: 820000000,
        status: 'ACTIVE',
        kycVerified: true,
        dilithiumAudited: true,
        creator: 'gxq1q_lattice_compute_consortium',
        contractAddress: '0xQC_QCOMPUTE_SYNTHETIC_POOL',
        startDate: '2025-01-10',
        endDate: '2025-12-31',
        tags: ['AI Compute', 'ZKP Shard', 'Enterprise']
      },
      {
        id: 'token-zenith',
        name: 'Zenith Quantum AMM Governance',
        symbol: 'ZNTH',
        description: 'Governance and fee-sharing token for Shard-1 high-frequency decentralized exchange.',
        totalSupply: 25000000,
        circulatingSupply: 11500000,
        initialPriceUsd: 8.25,
        hardCapUsd: 206250000,
        raisedUsd: 142000000,
        status: 'ACTIVE',
        kycVerified: true,
        dilithiumAudited: true,
        creator: 'gxq1q_zenith_dex_dao',
        contractAddress: '0xQC_ZENITH_DEX_AMM_GOV',
        startDate: '2025-02-01',
        endDate: '2026-06-30',
        tags: ['DEX', 'AMM', 'DeFi Governance']
      }
    ];
  }

  private startBlockProduction(): void {
    if (this.blockInterval) return;
    this.blockInterval = setInterval(async () => {
      await this.produceBlock();
    }, 3800);
  }

  public async produceBlock(customMinedTxCount = 0): Promise<QuantumBlock> {
    const prev = this.blocks[0];
    const newHeight = prev.height + 1;
    const shardId = (newHeight % 4);
    const proposer = this.validators[newHeight % this.validators.length]?.address || 'gxq1q_validator_node_alpha';
    const bHash = `0xQ_${await computeSha256(newHeight.toString() + prev.hash + Date.now().toString())}`;
    const dilithium = await computeQuantumLatticeRoot([bHash, shardId.toString(), proposer]);

    const txsCount = customMinedTxCount > 0 ? customMinedTxCount : Math.floor(Math.random() * 32) + 12;
    const gasUsed = txsCount * 42000;

    const newBlock: QuantumBlock = {
      height: newHeight,
      hash: bHash.slice(0, 42),
      previousHash: prev.hash,
      shardId,
      proposer,
      timestamp: Date.now(),
      transactionsCount: txsCount,
      gasUsed,
      gasLimit: 30000000,
      quantumNonce: `0xQN_${Math.floor(Math.random() * 10000000).toString(16)}`,
      dilithiumRoot: dilithium.slice(0, 36),
      stateRoot: `0xSR_${bHash.slice(10, 32)}`,
      rewardGXQ: 2.5,
    };

    this.blocks = [newBlock, ...this.blocks.slice(0, 49)]; // Keep latest 50 blocks
    
    // Update shard load and TPS
    this.shards = this.shards.map(s => {
      if (s.id === shardId) {
        return {
          ...s,
          tps: Math.min(s.capacityTps, s.tps + Math.floor((Math.random() - 0.48) * 120)),
          loadPercent: Math.min(95, Math.max(20, s.loadPercent + Math.floor((Math.random() - 0.48) * 5))),
        };
      }
      return s;
    });

    this.notify();
    return newBlock;
  }

  public async submitTransaction(tx: {
    from: string;
    to: string;
    value: number;
    symbol: string;
    shardId: number;
    targetShardId?: number;
    dataPayload?: string;
  }): Promise<QuantumTransaction> {
    const fee = 0.00025;
    const txHash = `0xTX_${await computeSha256(tx.from + tx.to + Date.now().toString())}`.slice(0, 42);
    const signature = await signQuantumPayload(txHash, tx.from);

    // Balance check & deduction
    const currentAsset = this.userBalances[tx.symbol];
    if (currentAsset && currentAsset.balance < tx.value) {
      throw new Error(`Insufficient ${tx.symbol} balance: Available ${currentAsset.balance.toFixed(4)}, Required ${tx.value}`);
    }

    if (currentAsset) {
      currentAsset.balance -= tx.value;
      if (tx.symbol === 'GXQ') {
        currentAsset.balance -= fee;
      } else if (this.userBalances.GXQ) {
        this.userBalances.GXQ.balance -= fee;
      }
    }

    const newTx: QuantumTransaction = {
      hash: txHash,
      blockHeight: this.blocks[0]?.height || 1048201,
      timestamp: Date.now(),
      from: tx.from,
      to: tx.to,
      value: tx.value,
      symbol: tx.symbol,
      gasFee: fee,
      shardId: tx.shardId,
      targetShardId: tx.targetShardId,
      status: 'SUCCESS',
      quantumSignature: signature,
      signatureType: 'DILITHIUM-5',
      isCrossShard: tx.targetShardId !== undefined && tx.targetShardId !== tx.shardId,
      dataPayload: tx.dataPayload,
    };

    this.transactions = [newTx, ...this.transactions.slice(0, 99)];
    
    await telemetry.record(
      'TRANSACTION_SUBMIT',
      tx.from,
      `Executed ${tx.value} ${tx.symbol} transfer to ${tx.to} with Dilithium signature.`,
      'SUCCESS'
    );

    this.notify();
    return newTx;
  }

  public async deploySmartContract(params: {
    name: string;
    shardId: number;
    creator: string;
    bytecode: string;
    abi: any[];
  }): Promise<SmartContract> {
    const contractHash = await computeSha256(params.creator + params.name + Date.now().toString());
    const address = `0xQC_${contractHash.slice(0, 36)}`.toUpperCase();

    const newContract: SmartContract = {
      address,
      name: params.name,
      shardId: params.shardId,
      creator: params.creator,
      deployedAtBlock: this.blocks[0]?.height || 1048201,
      deployedAtTime: Date.now(),
      bytecode: params.bytecode,
      abi: params.abi,
      verified: true,
      dilithiumSecured: true,
      state: {},
    };

    this.contracts = [newContract, ...this.contracts];

    await telemetry.record(
      'CONTRACT_DEPLOY',
      params.creator,
      `Deployed contract '${params.name}' to Shard-${params.shardId} at address ${address}.`,
      'SUCCESS'
    );

    this.notify();
    return newContract;
  }

  public async executeContractMethod(
    contractAddress: string,
    methodName: string,
    args: Record<string, any>,
    callerAddress: string
  ): Promise<{ success: boolean; result: any; txHash: string }> {
    const contract = this.contracts.find(c => c.address === contractAddress);
    if (!contract) throw new Error('Contract not found on GXQ shards');

    const txHash = `0xTX_EXEC_${await computeSha256(contractAddress + methodName + Date.now().toString())}`.slice(0, 42);

    // Update contract state deterministically
    contract.state = {
      ...contract.state,
      [methodName]: args,
      lastCaller: callerAddress,
      lastInvokedAt: new Date().toISOString()
    };

    await telemetry.record(
      'CONTRACT_EXEC',
      callerAddress,
      `Invoked method ${methodName}() on ${contract.name} (${contractAddress}) with args: ${JSON.stringify(args)}`,
      'SUCCESS'
    );

    this.notify();
    return {
      success: true,
      result: `Execution of ${methodName}() successful with Dilithium proof.`,
      txHash,
    };
  }

  public creditMiningReward(amountGXQ: number, minerAddress: string): void {
    if (this.userBalances.GXQ) {
      this.userBalances.GXQ.balance += amountGXQ;
    }
    telemetry.record(
      'MINING_REWARD_CLAIM',
      minerAddress,
      `Claimed ${amountGXQ.toFixed(4)} GXQ PoQW lattice mining reward.`,
      'SUCCESS'
    );
    this.notify();
  }

  public creditAsset(symbol: string, amount: number): void {
    if (this.userBalances[symbol]) {
      this.userBalances[symbol].balance += amount;
    }
    this.notify();
  }

  public debitAsset(symbol: string, amount: number): void {
    if (this.userBalances[symbol]) {
      this.userBalances[symbol].balance = Math.max(0, this.userBalances[symbol].balance - amount);
    }
    this.notify();
  }

  public createLaunchpadToken(token: Omit<LaunchpadToken, 'id' | 'raisedUsd' | 'status' | 'contractAddress'>): LaunchpadToken {
    const id = `token-${Date.now()}`;
    const contractAddress = `0xQC_LAUNCHPAD_${token.symbol}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    
    const newToken: LaunchpadToken = {
      ...token,
      id,
      raisedUsd: 0,
      status: 'ACTIVE',
      contractAddress,
    };

    this.launchpadTokens = [newToken, ...this.launchpadTokens];
    telemetry.record(
      'TOKEN_LAUNCHPAD_CREATE',
      token.creator,
      `Created launchpad project: ${token.name} ($${token.symbol}) with hard cap $${token.hardCapUsd.toLocaleString()}`,
      'SUCCESS'
    );
    this.notify();
    return newToken;
  }

  public investInLaunchpadToken(tokenId: string, amountUsd: number, investorAddress: string): void {
    const token = this.launchpadTokens.find(t => t.id === tokenId);
    if (!token) throw new Error('Token project not found');

    // Deduct USDC
    const usdcAsset = this.userBalances.USDC;
    if (!usdcAsset || usdcAsset.balance < amountUsd) {
      throw new Error(`Insufficient USDC balance. Required: $${amountUsd}`);
    }

    usdcAsset.balance -= amountUsd;
    token.raisedUsd += amountUsd;

    // Credit project token to user
    const tokenAlloc = amountUsd / token.initialPriceUsd;
    if (!this.userBalances[token.symbol]) {
      this.userBalances[token.symbol] = {
        symbol: token.symbol,
        name: token.name,
        balance: tokenAlloc,
        usdValue: amountUsd,
        change24h: 0,
        isNative: false,
      };
    } else {
      this.userBalances[token.symbol].balance += tokenAlloc;
    }

    telemetry.record(
      'LAUNCHPAD_INVEST',
      investorAddress,
      `Invested $${amountUsd.toLocaleString()} USDC into ${token.name} (${token.symbol}). Received ${tokenAlloc.toFixed(2)} ${token.symbol}.`,
      'SUCCESS'
    );
    this.notify();
  }

  public getBlocks(): QuantumBlock[] {
    return this.blocks;
  }

  public getTransactions(): QuantumTransaction[] {
    return this.transactions;
  }

  public getMempool(): QuantumTransaction[] {
    return this.mempool;
  }

  public getShards(): ShardInfo[] {
    return this.shards;
  }

  public getValidators(): ValidatorNode[] {
    return this.validators;
  }

  public getContracts(): SmartContract[] {
    return this.contracts;
  }

  public getLaunchpadTokens(): LaunchpadToken[] {
    return this.launchpadTokens;
  }

  public getUserBalances(): Record<string, AssetBalance> {
    return this.userBalances;
  }

  public updateUserBalance(symbol: string, delta: number): void {
    if (this.userBalances[symbol]) {
      this.userBalances[symbol].balance = Math.max(0, this.userBalances[symbol].balance + delta);
      this.userBalances[symbol].usdValue = this.userBalances[symbol].balance * (symbol === 'GXQ' ? 3465.80 : 1.0);
    } else if (delta > 0) {
      this.userBalances[symbol] = {
        symbol,
        name: symbol,
        balance: delta,
        usdValue: delta * 3465.80,
        change24h: 0,
        isNative: false,
      };
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const blockchain = new BlockchainEngine();
