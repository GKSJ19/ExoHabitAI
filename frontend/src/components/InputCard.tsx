'use client';

import { ReactNode, useState } from 'react';

interface InputCardProps {
  title: string;
  children: ReactNode;
}

export default function InputCard({ title, children }: InputCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        ${isFocused 
          ? 'bg-slate-900/60 border-slate-600 ring-1 ring-slate-500/20 shadow-lg shadow-black/20' 
          : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/60'
        }
        border rounded-lg p-6 transition-all duration-200
      `}
    >
      <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}