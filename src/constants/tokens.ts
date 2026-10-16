import { ShardInfo, SmartContract } from '../types/blockchain';

export const GXQ_LOGO_URL = "/src/assets/images/gxq_network_logo_1792061534715.jpg";

export const THEME_TOKENS = {
  BACKGROUND_PRIMARY: '#030507',
  BACKGROUND_SECONDARY: '#070B12',
  SURFACE_GLASS: 'rgba(255,255,255,0.055)',
  BLUE_PRIMARY: '#00A8FF',
  BLUE_GLOW: '#008CFF',
  ORANGE_PRIMARY: '#FF7A00',
  ORANGE_GLOW: '#FF5500',
  RED_PRIMARY: '#FF304F',
  RED_GLOW: '#FF1744',
  YELLOW_PRIMARY: '#FFD400',
  TEXT_PRIMARY: '#F5F7FA',
  TEXT_SECONDARY: '#9AA6B2',
  TEXT_MUTED: '#66717D',
  BORDER_GLASS: 'rgba(255,255,255,0.10)',
};

export const NETWORK_METRICS = {
  CHAIN_ID: 'gxq-mainnet-1',
  NAME: 'GXQ Quantum Network',
  CONSENSUS: 'Proof-of-Quantum-Work + Lattice PBFT',
  SECURITY_STANDARD: 'NIST Level 5 (CRYSTALS-Dilithium-5 / Kyber-1024)',
  TARGET_BLOCK_TIME_SEC: 1.2,
  TOTAL_SUPPLY_GXQ: 120450000,
  CIRCULATING_SUPPLY_GXQ: 78210500,
  GENESIS_TIMESTAMP: 1718000000000,
  BASE_GAS_PRICE_NANO_GXQ: 12,
  MAX_BLOCK_GAS: 30000000,
};

export const INITIAL_SHARDS: ShardInfo[] = [
  {
    id: 0,
    name: 'Shard-0: Prime Settlement',
    description: 'Post-quantum global finality root & core state trie.',
    tps: 3120,
    capacityTps: 8000,
    loadPercent: 39,
    activeNodes: 32,
    status: 'NOMINAL',
    crossShardQueue: 14,
  },
  {
    id: 1,
    name: 'Shard-1: High-Frequency DeFi & DEX',
    description: 'Ultra-low latency automated market makers & atomic liquidity routing.',
    tps: 6840,
    capacityTps: 15000,
    loadPercent: 62,
    activeNodes: 48,
    status: 'HIGH_THROUGHPUT',
    crossShardQueue: 28,
  },
  {
    id: 2,
    name: 'Shard-2: Enterprise Data & Privacy',
    description: 'Confidential zero-knowledge compute & institutional audit chains.',
    tps: 2940,
    capacityTps: 8000,
    loadPercent: 34,
    activeNodes: 24,
    status: 'NOMINAL',
    crossShardQueue: 8,
  },
  {
    id: 3,
    name: 'Shard-3: Cross-Chain Gateway & Bridge',
    description: 'Decentralized cryptographic relayer mesh to Ethereum, Arbitrum & Solana.',
    tps: 2190,
    capacityTps: 6000,
    loadPercent: 48,
    activeNodes: 24,
    status: 'NOMINAL',
    crossShardQueue: 19,
  },
];

export const CONTRACT_TEMPLATES = [
  {
    id: 'qrc20',
    name: 'Quantum QRC-20 Standard Token',
    description: 'Fungible token standard with Dilithium post-quantum signature authorization.',
    code: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "@gxq/contracts/quantum/DilithiumSecured.sol";

contract QuantumToken is DilithiumSecured {
    string public name = "Quantum Synthetic Credit";
    string public symbol = "QSC";
    uint8 public decimals = 18;
    uint256 public totalSupply = 50000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event DilithiumSignatureVerified(bytes32 indexed hash, bytes signature);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}`,
    abi: [
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: 'success', type: 'bool' }],
        description: 'Transfers tokens with post-quantum Dilithium authorization verification.'
      },
      {
        name: 'balanceOf',
        type: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'balance', type: 'uint256' }],
        description: 'Returns the balance of specified quantum address.'
      },
      {
        name: 'totalSupply',
        type: 'view',
        inputs: [],
        outputs: [{ name: 'supply', type: 'uint256' }],
        description: 'Returns the total circulating supply of this QRC-20 token.'
      }
    ]
  },
  {
    id: 'escrow',
    name: 'Post-Quantum Multi-Sig Escrow',
    description: 'Time-locked vault requiring M-of-N post-quantum lattice signatures for release.',
    code: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

contract QuantumEscrow {
    address public arbiter;
    address public beneficiary;
    uint256 public unlockTimestamp;
    bool public isReleased;

    event FundsDeposited(address from, uint256 amount);
    event FundsReleased(address to, uint256 amount);

    constructor(address _beneficiary, uint256 _lockDuration) payable {
        arbiter = msg.sender;
        beneficiary = _beneficiary;
        unlockTimestamp = block.timestamp + _lockDuration;
    }

    function releaseFunds() external {
        require(msg.sender == arbiter, "Only arbiter with Dilithium key can release");
        require(block.timestamp >= unlockTimestamp, "Escrow still locked");
        require(!isReleased, "Already released");
        isReleased = true;
        payable(beneficiary).transfer(address(this).balance);
        emit FundsReleased(beneficiary, address(this).balance);
    }
}`,
    abi: [
      {
        name: 'releaseFunds',
        type: 'function',
        inputs: [],
        outputs: [{ name: 'success', type: 'bool' }],
        description: 'Releases locked escrow funds if quantum arbiter key signs and timer has elapsed.'
      },
      {
        name: 'isReleased',
        type: 'view',
        inputs: [],
        outputs: [{ name: 'status', type: 'bool' }],
        description: 'Checks whether the escrow balance has been paid out.'
      }
    ]
  },
  {
    id: 'staking',
    name: 'Quantum Lattice Staking Vault',
    description: 'Stake GXQ to secure validator shards and earn 14.8% APY PoQW block rewards.',
    code: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

contract QuantumStakingVault {
    mapping(address => uint256) public stakedBalance;
    uint256 public constant REWARD_RATE_BPS = 1480; // 14.80% APY

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function stake(uint256 amount) external {
        require(amount > 0, "Amount > 0");
        stakedBalance[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(stakedBalance[msg.sender] >= amount, "Exceeds stake");
        stakedBalance[msg.sender] -= amount;
        emit Withdrawn(msg.sender, amount);
    }
}`,
    abi: [
      {
        name: 'stake',
        type: 'function',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [{ name: 'success', type: 'bool' }],
        description: 'Locks GXQ into validator stake pool to earn consensus yield.'
      },
      {
        name: 'withdraw',
        type: 'function',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [{ name: 'success', type: 'bool' }],
        description: 'Unstakes GXQ and returns funds to sender balance.'
      },
      {
        name: 'stakedBalance',
        type: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: 'amount', type: 'uint256' }],
        description: 'Returns the currently staked GXQ amount for an address.'
      }
    ]
  }
];
