import React from "react";

interface HabitabilityMeterProps {
  score: number; // 0-100
  isLoading?: boolean;
}

function getStatusInfo(score: number) {
  if (score >= 75) return { label: "Highly Habitable", color: "hsl(142 70% 45%)", glow: "var(--shadow-green)", emoji: "🌍" };
  if (score >= 50) return { label: "Potentially Habitable", color: "hsl(38 92% 55%)", glow: "0 0 20px hsl(38 92% 55% / 0.4)", emoji: "🌱" };
  if (score >= 25) return { label: "Marginally Habitable", color: "hsl(20 80% 50%)", glow: "0 0 20px hsl(20 80% 50% / 0.4)", emoji: "🌵" };
  return { label: "Uninhabitable", color: "hsl(0 75% 55%)", glow: "var(--shadow-red)", emoji: "☠️" };
}

const HabitabilityMeter: React.FC<HabitabilityMeterProps> = ({ score, isLoading }) => {
  const status = getStatusInfo(score);
  const clampedScore = Math.max(0, Math.min(100, score));

  // Arc calculation
  const radius = 70;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Semicircle gauge */}
      <div className="relative w-52 h-28 overflow-hidden">
        <svg
          width="208"
          height="112"
          viewBox="0 0 208 112"
          className="absolute top-0 left-0"
        >
          {/* Track */}
          <path
            d="M 14 104 A 90 90 0 0 1 194 104"
            fill="none"
            stroke="hsl(222 35% 12%)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 14 104 A 90 90 0 0 1 194 104"
            fill="none"
            stroke={status.color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 90}`}
            strokeDashoffset={`${Math.PI * 90 * (1 - clampedScore / 100)}`}
            style={{
              filter: `drop-shadow(0 0 8px ${status.color})`,
              transition: "stroke-dashoffset 0.8s ease-out, stroke 0.5s ease",
            }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI * (tick / 100); // 0 to π
            const x = 104 - 90 * Math.cos(angle);
            const y = 104 - 90 * Math.sin(angle);
            return (
              <circle key={tick} cx={x} cy={y} r="3" fill="hsl(222 35% 18%)" />
            );
          })}
        </svg>
        {/* Center score */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div
            className="text-3xl font-orbitron font-bold transition-all duration-700"
            style={{ color: status.color, textShadow: `0 0 20px ${status.color}` }}
          >
            {isLoading ? "—" : `${Math.round(clampedScore)}%`}
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-500"
        style={{
          background: `${status.color}18`,
          border: `1px solid ${status.color}50`,
          color: status.color,
          boxShadow: `0 0 12px ${status.color}30`,
        }}
      >
        <span>{status.emoji}</span>
        <span className="font-orbitron text-xs tracking-wider">
          {isLoading ? "Analyzing..." : status.label}
        </span>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between w-52 text-xs text-muted-foreground px-3">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default HabitabilityMeter;
