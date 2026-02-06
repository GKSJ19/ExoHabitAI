'use client';

import { InputHTMLAttributes, SelectHTMLAttributes, useState } from 'react';

interface Input3DProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input3D({ label, className = '', ...props }: Input3DProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs text-slate-400 mb-2 font-mono tracking-wide">
          {label}
        </label>
      )}
      <div className="relative input-3d-container">
        {/* Background depth layers */}
        <div className="absolute inset-0 bg-slate-950/60 rounded translate-y-1 translate-x-1 blur-sm" />
        <div className="absolute inset-0 bg-slate-900/40 rounded translate-y-0.5 translate-x-0.5" />
        
        {/* Input field */}
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            relative w-full 
            bg-slate-950/90 
            border rounded 
            px-4 py-3
            text-slate-100 
            placeholder:text-slate-600
            font-mono text-sm
            transition-all duration-300
            ${isFocused 
              ? 'border-amber-600/50 shadow-lg shadow-amber-900/20 translate-y-0' 
              : 'border-slate-700/50 hover:border-slate-600 translate-y-0.5'
            }
            focus:outline-none
            ${className}
          `}
          style={{
            boxShadow: isFocused 
              ? '0 0 0 1px rgba(217, 119, 6, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              : 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Corner details */}
        {isFocused && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/60" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/60" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/60" />
          </>
        )}
      </div>
    </div>
  );
}

interface Select3DProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select3D({ label, className = '', children, ...props }: Select3DProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs text-slate-400 mb-2 font-mono tracking-wide">
          {label}
        </label>
      )}
      <div className="relative select-3d-container">
        {/* Background depth layers */}
        <div className="absolute inset-0 bg-slate-950/60 rounded translate-y-1 translate-x-1 blur-sm" />
        <div className="absolute inset-0 bg-slate-900/40 rounded translate-y-0.5 translate-x-0.5" />
        
        {/* Select field */}
        <select
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            relative w-full 
            bg-slate-950/90 
            border rounded 
            px-4 py-3
            text-slate-100
            font-mono text-sm
            appearance-none cursor-pointer
            transition-all duration-300
            ${isFocused 
              ? 'border-amber-600/50 shadow-lg shadow-amber-900/20 translate-y-0' 
              : 'border-slate-700/50 hover:border-slate-600 translate-y-0.5'
            }
            focus:outline-none
            ${className}
          `}
          style={{
            boxShadow: isFocused 
              ? '0 0 0 1px rgba(217, 119, 6, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              : 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          {children}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-4 h-4 transition-colors ${isFocused ? 'text-amber-500' : 'text-slate-500'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Corner details */}
        {isFocused && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/60" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/60" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/60" />
          </>
        )}
      </div>
    </div>
  );
}