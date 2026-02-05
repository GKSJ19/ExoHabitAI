'use client';

export default function OrbitalDiagram() {
  return (
    <div className="mt-4">
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-40"
        aria-label="Orbital diagram"
      >
        {/* Star at center */}
        <circle cx="100" cy="100" r="8" fill="#94a3b8" />
        
        {/* Habitable zone (faint ring) */}
        <circle 
          cx="100" 
          cy="100" 
          r="60" 
          fill="none" 
          stroke="#0f766e" 
          strokeWidth="12"
          opacity="0.15"
        />
        
        {/* Orbit path */}
        <circle 
          cx="100" 
          cy="100" 
          r="60" 
          fill="none" 
          stroke="#334155" 
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        
        {/* Planet */}
        <circle cx="160" cy="100" r="4" fill="#64748b" />
      </svg>
    </div>
  );
}