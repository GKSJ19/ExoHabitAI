import React from 'react';

const GlassCard = ({ children, className = '', hover = false, ...props }) => {
  const hoverClass = hover ? 'hover:border-cyan-500/50 hover:shadow-cyan-500/20' : '';
  
  return (
    <div
      className={`glass-card rounded-xl p-6 transition-all duration-300 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;