import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';

export const StakingDashboard: React.FC = () => {
  const [stakingAmount, setStakingAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  // Mock data
  const apr = 12.5;
  const progress = 65; // Percentage

  const handleStake = () => {
    setIsStaking(true);
    // Add staking logic here
  };

  return (
    <GlassCard level={3} glow="blue" className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">GXQ Staking Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-xs text-gray-400 uppercase">Estimated APR</p>
          <p className="text-2xl font-bold text-green-400">{apr}%</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-xs text-gray-400 uppercase">Locked GXQ</p>
          <p className="text-2xl font-bold text-yellow-400">1,250.00</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Staking Progress</span>
          <span className="text-white font-mono">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Enter GXQ amount"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleStake}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-colors"
        >
          {isStaking ? 'Staking...' : 'Stake GXQ'}
        </button>
      </div>
    </GlassCard>
  );
};
