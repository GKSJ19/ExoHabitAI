import React from "react";
import { PlanetaryParams } from "./PlanetaryForm";
import { StellarParams } from "./StellarForm";

interface PredictionResult {
  score: number;
  status: string;
  factors: { label: string; value: string; score: number; icon: string }[];
  recommendation: string;
}

interface ResultsDisplayProps {
  result: PredictionResult;
  planetParams: PlanetaryParams;
  stellarParams: StellarParams;
}

function getFactorColor(score: number) {
  if (score >= 70) return "hsl(142 70% 45%)";
  if (score >= 40) return "hsl(38 92% 55%)";
  return "hsl(0 75% 55%)";
}

function getStatusBadge(status: string) {
  const map: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    "Highly Habitable": { bg: "hsl(142 70% 45% / 0.12)", border: "hsl(142 70% 45% / 0.4)", text: "hsl(142 70% 55%)", icon: "🌍" },
    "Potentially Habitable": { bg: "hsl(38 92% 55% / 0.12)", border: "hsl(38 92% 55% / 0.4)", text: "hsl(38 92% 65%)", icon: "🌱" },
    "Marginally Habitable": { bg: "hsl(20 80% 50% / 0.12)", border: "hsl(20 80% 50% / 0.4)", text: "hsl(20 80% 60%)", icon: "🌵" },
    "Uninhabitable": { bg: "hsl(0 75% 55% / 0.12)", border: "hsl(0 75% 55% / 0.4)", text: "hsl(0 75% 65%)", icon: "☠️" },
  };
  return map[status] || map["Uninhabitable"];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, planetParams, stellarParams }) => {
  const badge = getStatusBadge(result.status);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Main Result Banner */}
      <div
        className="rounded-xl p-5 text-center space-y-2 border"
        style={{ background: badge.bg, borderColor: badge.border }}
      >
        <div className="text-4xl">{badge.icon}</div>
        <h3 className="font-orbitron text-xl font-bold" style={{ color: badge.text }}>
          {result.status}
        </h3>
        <div className="flex items-center justify-center gap-3">
          <div
            className="text-3xl font-orbitron font-black"
            style={{ color: badge.text, textShadow: `0 0 20px ${badge.text}` }}
          >
            {Math.round(result.score)}%
          </div>
          <div className="text-sm text-muted-foreground">Habitability Score</div>
        </div>
        {/* Score bar */}
        <div className="mt-3 h-2.5 bg-space-panel rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${result.score}%`,
              background: `linear-gradient(90deg, hsl(0 75% 55%), hsl(38 92% 55%), hsl(142 70% 45%))`,
              backgroundSize: "200% 100%",
              backgroundPositionX: `${100 - result.score}%`,
            }}
          />
        </div>
      </div>

      {/* Factor Breakdown */}
      <div>
        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Factor Breakdown
        </h4>
        <div className="space-y-2.5">
          {result.factors.map((factor) => {
            const color = getFactorColor(factor.score);
            return (
              <div key={factor.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span>{factor.icon}</span>
                    {factor.label}
                  </span>
                  <span className="font-orbitron text-xs" style={{ color }}>
                    {factor.value}
                  </span>
                </div>
                <div className="h-1.5 bg-space-panel rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${factor.score}%`,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendation */}
      <div className="glow-border rounded-xl p-4 space-y-1">
        <div className="font-orbitron text-xs text-primary uppercase tracking-widest">AI Analysis</div>
        <p className="text-sm text-foreground/80 leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Summary Table */}
      <div>
        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Input Summary
        </h4>
        <div className="rounded-xl overflow-hidden border border-space-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-space-panel">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Parameter</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["🪐 Planet Radius", `${planetParams.planetRadius.toFixed(2)} R⊕`],
                ["🧱 Planet Mass", `${planetParams.planetMass.toFixed(2)} M⊕`],
                ["🔄 Orbital Period", `${planetParams.orbitalPeriod} days`],
                ["🌡️ Equilibrium Temp", `${planetParams.equilibriumTemp} K`],
                ["📏 Semi-Major Axis", `${planetParams.semiMajorAxis.toFixed(3)} AU`],
                ["⭐ Star Type", `${stellarParams.starType}-Type`],
                ["🔥 Star Temp", `${stellarParams.starTemp.toLocaleString()} K`],
                ["💡 Star Luminosity", `${stellarParams.starLuminosity.toFixed(3)} L☉`],
                ["⚖️ Star Mass", `${stellarParams.starMass.toFixed(2)} M☉`],
              ].map(([label, value], i) => (
                <tr
                  key={i}
                  className="border-t border-space-border hover:bg-space-panel/50 transition-colors"
                >
                  <td className="px-3 py-2 text-foreground/80">{label}</td>
                  <td className="px-3 py-2 text-right font-orbitron text-xs text-primary/80">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
export type { PredictionResult };
