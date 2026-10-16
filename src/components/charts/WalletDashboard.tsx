import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { GlassCard } from '../ui/GlassCard';

interface WalletDashboardProps {
  balances: Record<string, { symbol: string; balance: number }>;
}

const COLORS = ['#00A8FF', '#FF7A00', '#FFC107', '#FF304F'];

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ balances }) => {
  const allocationData = Object.entries(balances).map(([symbol, data]) => ({
    name: symbol,
    value: data.balance,
  }));

  const transactionData = [
    { time: '10:00', volume: 120 },
    { time: '12:00', volume: 250 },
    { time: '14:00', volume: 180 },
    { time: '16:00', volume: 400 },
    { time: '18:00', volume: 320 },
    { time: '20:00', volume: 550 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard level={3} className="p-6">
        <h3 className="text-lg font-tech font-bold text-[#F5F7FA] mb-4">Asset Allocation</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {allocationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0E192E', border: '1px solid #00A8FF', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard level={3} className="p-6">
        <h3 className="text-lg font-tech font-bold text-[#F5F7FA] mb-4">Transaction Volume (24h)</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactionData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00A8FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#9AA6B2" />
              <YAxis stroke="#9AA6B2" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0E192E', border: '1px solid #00A8FF', borderRadius: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#00A8FF"
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
