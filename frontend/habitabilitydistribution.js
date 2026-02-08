import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from './GlassCard';

const HabitabilityDistribution = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 text-slate-100 rounded-lg shadow-xl backdrop-blur-md p-3">
          <p className="font-mono text-sm">Range: {payload[0].payload.range}</p>
          <p className="font-mono text-sm text-cyan-400">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (score) => {
    if (score < 0.3) return '#EF4444';
    if (score < 0.6) return '#FBBF24';
    return '#34D399';
  };

  return (
    <GlassCard data-testid="habitability-distribution-chart">
      <h3 className="font-subheading font-semibold text-xl text-slate-300 mb-4">
        Habitability Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="range"
            stroke="#94A3B8"
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#94A3B8" tick={{ fontFamily: 'JetBrains Mono' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default HabitabilityDistribution;