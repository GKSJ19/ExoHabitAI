import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import GlassCard from './GlassCard';

const ScatterPlot = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 text-slate-100 rounded-lg shadow-xl backdrop-blur-md p-3">
          <p className="font-mono text-xs">Temperature: {point.temperature}K</p>
          <p className="font-mono text-xs text-cyan-400">Habitability: {point.habitability}</p>
          <p className="font-mono text-xs text-purple-400">Radius: {point.radius}R⊕</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard data-testid="scatter-plot-chart">
      <h3 className="font-subheading font-semibold text-xl text-slate-300 mb-4">
        Temperature vs Habitability Correlation
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            dataKey="temperature"
            name="Temperature"
            unit="K"
            stroke="#94A3B8"
            tick={{ fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            type="number"
            dataKey="habitability"
            name="Habitability"
            stroke="#94A3B8"
            tick={{ fontFamily: 'JetBrains Mono' }}
          />
          <ZAxis type="number" dataKey="radius" range={[20, 200]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Exoplanets" data={data} fill="#38BDF8" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default ScatterPlot;