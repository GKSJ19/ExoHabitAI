import React from 'react';
import GlassCard from './GlassCard';

const MetricCard = ({ icon: Icon, label, value, testId }) => {
  return (
    <GlassCard hover className="group" data-testid={testId}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-2">
            {label}
          </p>
          <p className="font-mono text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity">
            <Icon size={32} />
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default MetricCard;