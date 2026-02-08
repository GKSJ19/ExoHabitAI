// src/components/dashboard/SystemHealth.tsx
'use client';

import { useHealth } from '@/hooks/useHealth';

export default function SystemHealth() {
  const { health, isLoading } = useHealth();

  if (isLoading && !health) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
          <span className="text-xs text-slate-600 uppercase tracking-[0.15em] font-mono">
            System Status
          </span>
        </div>
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isHealthy ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-slate-400 uppercase tracking-[0.15em] font-mono">
          System Status
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-slate-100">
            {health?.ranking_count?.toLocaleString() || '—'}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            planets analyzed
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${
            health?.model_loaded ? 'bg-emerald-500' : 'bg-slate-600'
          }`} />
          <span className="text-slate-500 font-mono">
            Model {health?.model_loaded ? 'operational' : 'offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${
            health?.ranking_data_available ? 'bg-emerald-500' : 'bg-slate-600'
          }`} />
          <span className="text-slate-500 font-mono">
            Database {health?.ranking_data_available ? 'connected' : 'disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}