import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface HashRateData {
  shard: string;
  hashrate: number;
}

interface HashRateRadarProps {
  data: HashRateData[];
}

export const HashRateRadar: React.FC<HashRateRadarProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis dataKey="shard" stroke="#F5F7FA" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#F5F7FA" />
          <Radar
            name="Hashrate (TH/s)"
            dataKey="hashrate"
            stroke="#00A8FF"
            fill="#00A8FF"
            fillOpacity={0.6}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0E192E', border: '1px solid #00A8FF', borderRadius: '8px' }}
            itemStyle={{ color: '#F5F7FA' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
