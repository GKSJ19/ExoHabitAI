import React from 'react';
import GlassCard from './GlassCard';
import { Star } from 'lucide-react';

const TopPlanetsTable = ({ planets }) => {
  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <GlassCard data-testid="top-planets-table">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-400" size={24} />
        <h3 className="font-subheading font-semibold text-xl text-slate-300">
          Top Potentially Habitable Exoplanets
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-widest text-slate-500">
              <th className="pb-3 pr-4">Rank</th>
              <th className="pb-3 pr-4">Planet Name</th>
              <th className="pb-3 pr-4">Habitability Score</th>
              <th className="pb-3 pr-4">Temp (K)</th>
              <th className="pb-3 pr-4">Radius (R⊕)</th>
              <th className="pb-3">Star Temp (K)</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((planet, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition-colors font-mono text-sm"
                data-testid={`planet-row-${index}`}
              >
                <td className="py-3 pr-4 text-cyan-400 font-bold">#{planet.rank}</td>
                <td className="py-3 pr-4 text-slate-200">{planet.name}</td>
                <td className={`py-3 pr-4 font-bold ${getScoreColor(planet.habitability_score)}`}>
                  {planet.habitability_score.toFixed(4)}
                </td>
                <td className="py-3 pr-4 text-slate-400">{planet.pl_eqt}</td>
                <td className="py-3 pr-4 text-slate-400">{planet.pl_rade}</td>
                <td className="py-3 text-slate-400">{planet.st_teff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default TopPlanetsTable;