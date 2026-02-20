import React from "react";
import { PredictionResult } from "./ResultsDisplay";

export interface RankedPlanet {
  id: string;
  name: string;
  result: PredictionResult;
  timestamp: number;
}

interface PlanetRankingProps {
  rankings: RankedPlanet[];
  onClear: () => void;
}

function getMedalEmoji(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
}

function getScoreColor(score: number) {
  if (score >= 70) return "hsl(142 70% 45%)";
  if (score >= 40) return "hsl(38 92% 55%)";
  return "hsl(0 75% 55%)";
}

const PlanetRanking: React.FC<PlanetRankingProps> = ({ rankings, onClear }) => {
  if (rankings.length === 0) return null;

  const sorted = [...rankings].sort((a, b) => b.result.score - a.result.score);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <h2 className="font-orbitron text-base font-bold text-foreground">Planet Rankings</h2>
            <p className="text-xs text-muted-foreground">
              {sorted.length} planet{sorted.length !== 1 ? "s" : ""} analyzed
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-orbitron tracking-wider uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-primary/40 to-transparent" />

      <div className="space-y-2">
        {sorted.map((planet, i) => {
          const color = getScoreColor(planet.result.score);
          return (
            <div
              key={planet.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-space-panel/50 border border-space-border hover:border-primary/30 transition-all"
            >
              <div className="text-lg w-8 text-center shrink-0">
                {getMedalEmoji(i)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-orbitron text-sm text-foreground truncate">
                    {planet.name}
                  </span>
                  <span
                    className="font-orbitron text-sm font-bold shrink-0"
                    style={{ color }}
                  >
                    {Math.round(planet.result.score)}%
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 bg-space-panel rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${planet.result.score}%`,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{planet.result.status}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(planet.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanetRanking;
