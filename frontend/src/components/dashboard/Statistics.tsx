// src/components/dashboard/Statistics.tsx (ENHANCED METRICS)
'use client';

import { RankingResponse } from '@/lib/api';

interface StatisticsProps {
  data: RankingResponse | null;
  isLoading: boolean;
}

export default function Statistics({ data, isLoading }: StatisticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-20 mb-2" />
            <div className="h-8 bg-slate-800 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const stats = data?.statistics;
  const candidates = data?.candidates || [];
  
  // Calculate comprehensive metrics
  const totalHabitable = candidates.filter(c => c.habitability_probability >= 0.5).length;
  const highConfidence = candidates.filter(c => c.habitability_probability >= 0.7).length;
  const moderateConfidence = candidates.filter(c => 
    c.habitability_probability >= 0.5 && c.habitability_probability < 0.7
  ).length;
  
  // Calculate average probability for all habitable candidates (≥50%)
  const habitableCandidates = candidates.filter(c => c.habitability_probability >= 0.5);
  const avgHabitability = habitableCandidates.length > 0
    ? (habitableCandidates.reduce((sum, c) => sum + c.habitability_probability, 0) / 
       habitableCandidates.length * 100)
    : 0;
  
  // Calculate habitability rate (percentage of analyzed planets that are habitable)
  const habitabilityRate = stats?.total_exoplanets 
    ? ((totalHabitable / stats.total_exoplanets) * 100)
    : 0;
  
  // Diversity score - measures spread of habitability probabilities
  const probabilities = habitableCandidates.map(c => c.habitability_probability);
  const variance = probabilities.length > 0
    ? probabilities.reduce((sum, p) => sum + Math.pow(p - (avgHabitability / 100), 2), 0) / probabilities.length
    : 0;
  const diversityScore = Math.sqrt(variance) * 100;
  
  const topCandidate = candidates[0];

  return (
    <div className="space-y-8">

      {/* Key Metrics */}
      <div>
        <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-5 font-mono">
          Key Metrics
        </div>

        {/* Habitability Rate */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Discovery Rate
            </div>
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div className="text-3xl font-light text-slate-100 mb-1 leading-none">
            {habitabilityRate.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-600 font-mono">
            of all exoplanets
          </div>
        </div>

        {/* Average Habitability Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Avg Habitability
            </div>
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <div className="text-3xl font-light text-slate-100 mb-1 leading-none">
            {avgHabitability.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-600 font-mono">
            habitable candidates
          </div>
        </div>

        {/* Candidate Diversity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Diversity Index
            </div>
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
          </div>
          <div className="text-3xl font-light text-slate-100 mb-1 leading-none">
            {diversityScore.toFixed(1)}
          </div>
          <div className="text-xs text-slate-600 font-mono">
            parameter variance
          </div>
        </div>
      </div>

      {/* Top Candidate */}
      <div className="pt-6 border-t border-slate-800/50">
        <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-3 font-mono">
          Top Candidate
        </div>
        <div className="text-lg font-light text-amber-500 mb-1 font-mono truncate">
          {topCandidate?.planet_name || '—'}
        </div>
        {topCandidate && (
          <>
            <div className="text-xs text-slate-600 font-mono mb-1">
              {(topCandidate.habitability_probability * 100).toFixed(1)}% probability
            </div>
            <div className="text-xs text-slate-700 font-mono italic">
              Rank #{topCandidate.rank}
            </div>
          </>
        )}
      </div>

      {/* Key Factor Indicator */}
      <div className="pt-6 border-t border-slate-800/50">
        <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-3 font-mono">
          Primary Factor
        </div>
        <div className="p-3 bg-slate-950/30 border border-slate-800/30 rounded">
          <div className="text-sm text-emerald-500 font-mono mb-1">
            Orbital Zone Placement
          </div>
          <p className="text-xs text-slate-600 font-mono leading-relaxed">
            {highConfidence > 0 
              ? `${highConfidence} planet${highConfidence > 1 ? 's' : ''} in temperate zone`
              : 'Most candidates outside optimal zone'
            }
          </p>
        </div>
      </div>
    </div>
  );
}