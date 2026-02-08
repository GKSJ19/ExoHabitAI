import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from './GlassCard';

const FeatureImportance = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 text-slate-100 rounded-lg shadow-xl backdrop-blur-md p-3">
          <p className="font-mono text-sm">{payload[0].payload.label}</p>
          <p className="font-mono text-sm text-cyan-400">Importance: {(payload[0].value * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const colors = ['#38BDF8', '#818CF8', '#C084FC', '#F472B6', '#FB7185'];

  return (
    <GlassCard data-testid="feature-importance-chart">
      <h3 className="font-subheading font-semibold text-xl text-slate-300 mb-4">
        Feature Importance Analysis
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 150 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" stroke="#94A3B8" tick={{ fontFamily: 'JetBrains Mono' }} />
          <YAxis
            type="category"
            dataKey="label"
            stroke="#94A3B8"
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            width={140}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default FeatureImportance;