'use client';

import { useState, useRef, MouseEvent } from 'react';
import { PredictionResponse } from '@/types';
import OrbitalDiagram from './OrbitalDiagram';
import FloatingParticles from './FloatingParticles';

interface ResultsDisplayProps {
  prediction: PredictionResponse;
  onReset: () => void;
}

export default function ResultsDisplay3D({ prediction, onReset }: ResultsDisplayProps) {
  const { planet_name, habitability_prediction, confidence, recommendation } = prediction;
  const { is_habitable, probability, category } = habitability_prediction;

  const [scoreRotateX, setScoreRotateX] = useState(0);
  const [scoreRotateY, setScoreRotateY] = useState(0);
  const scoreRef = useRef<HTMLDivElement>(null);

  const handleScoreMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!scoreRef.current) return;
    
    const rect = scoreRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -8;
    const rotateYValue = (mouseX / (rect.width / 2)) * 8;
    
    setScoreRotateX(rotateXValue);
    setScoreRotateY(rotateYValue);
  };

  const handleScoreMouseLeave = () => {
    setScoreRotateX(0);
    setScoreRotateY(0);
  };

  const getInterpretation = () => {
    if (probability >= 0.7) {
      return "This planet exhibits characteristics consistent with temperate conditions. Orbital parameters place it within the conservative habitable zone. Stellar metallicity and surface gravity suggest stable long-term conditions favorable for atmospheric retention.";
    } else if (probability >= 0.4) {
      return "This planet shows moderate potential for habitability. While some parameters fall within acceptable ranges, certain characteristics may limit long-term stability. Further observational data would refine this assessment.";
    } else {
      return "Current parameters suggest low probability of Earth-like habitability. Orbital configuration, stellar environment, or physical characteristics present significant challenges for temperate surface conditions.";
    }
  };

  const getKeyFactors = () => {
    const factors = [];
    
    if (probability >= 0.5) {
      factors.push("Orbital period within temperate range");
      factors.push("Planet mass consistent with rocky composition");
      factors.push("Host star spectral type favorable");
      factors.push("Moderate stellar metallicity");
      factors.push("Semi-major axis: habitable zone overlap confirmed");
    } else {
      factors.push("Orbital parameters outside optimal range");
      factors.push("Physical characteristics may limit habitability");
      factors.push("Stellar environment presents challenges");
      factors.push("Further spectroscopic data needed");
    }
    
    return factors;
  };

  return (
    <div className="min-h-screen relative z-10">
      <FloatingParticles count={30} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with vintage styling */}
        <header className="mb-12 text-center relative">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-24 bg-amber-600/40" />
            <div className="mx-4 w-2 h-2 border border-amber-600/40 rotate-45" />
            <div className="h-px w-24 bg-amber-600/40" />
          </div>

          <div className="inline-block relative">
            <h1 className="text-3xl font-light text-slate-100 mb-2 tracking-wider font-mono">
              Analysis Complete
            </h1>
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-amber-600/40" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-amber-600/40" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-amber-600/40" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-amber-600/40" />
          </div>

          <p className="text-xl text-amber-500/80 font-mono mt-4 tracking-wide">
            {planet_name}
          </p>

          <div className="flex items-center justify-center mt-6">
            <div className="h-px w-24 bg-amber-600/40" />
            <div className="mx-4 w-2 h-2 border border-amber-600/40 rotate-45" />
            <div className="h-px w-24 bg-amber-600/40" />
          </div>
        </header>

        {/* Main Grid with 3D cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Primary Score Card - 3D Interactive */}
          <div className="lg:col-span-2 perspective-1000">
            <div
              ref={scoreRef}
              onMouseMove={handleScoreMouseMove}
              onMouseLeave={handleScoreMouseLeave}
              className="relative"
              style={{
                transform: `rotateX(${scoreRotateX}deg) rotateY(${scoreRotateY}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out',
              }}
            >
              {/* Depth layers */}
              <div className="absolute inset-0 bg-slate-950/40 rounded-lg translate-y-2 translate-x-2 blur-lg" />
              <div className="absolute inset-0 bg-slate-900/60 rounded-lg translate-y-1 translate-x-1 blur-sm" />
              
              {/* Main card */}
              <div 
                className="relative bg-slate-900/50 border-2 border-amber-600/30 rounded-lg p-10"
                style={{
                  boxShadow: `
                    0 20px 25px -5px rgba(0, 0, 0, 0.4),
                    0 10px 10px -5px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.05)
                  `,
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

                <div className="text-center mb-8" style={{ transform: 'translateZ(20px)' }}>
                  {/* Animated score */}
                  <div className="relative inline-block">
                    <div className="text-8xl font-light text-amber-500 mb-3 font-mono tracking-wider">
                      {(probability * 100).toFixed(1)}
                      <span className="text-5xl">%</span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-2xl opacity-30 bg-amber-500" />
                  </div>

                  <div className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-mono">
                    Habitability Score
                  </div>

                  <div className={`
                    text-2xl font-mono tracking-wide mb-6 px-6 py-2 inline-block rounded
                    ${is_habitable 
                      ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/50' 
                      : 'text-red-400 bg-red-950/30 border border-red-800/50'
                    }
                  `}>
                    {is_habitable ? 'Potentially Habitable' : 'Not Habitable'}
                  </div>
                </div>

                {/* Metrics table with 3D effect */}
                <div className="max-w-md mx-auto space-y-1 text-sm" style={{ transform: 'translateZ(10px)' }}>
                  {[
                    { label: 'Confidence', value: confidence.level },
                    { label: 'Research Priority', value: recommendation.priority_rank },
                    { label: 'Category', value: category },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`
                        flex justify-between py-3 px-4
                        bg-slate-950/40 
                        border border-slate-800/50
                        rounded
                        hover:bg-slate-950/60 hover:border-slate-700
                        transition-all duration-300
                      `}
                      style={{
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <span className="text-slate-400 font-mono">{item.label}</span>
                      <span className="text-amber-500 font-mono font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Planet Context Card - 3D */}
          <div className="perspective-1000">
            <div className="relative transform-gpu hover:scale-[1.02] transition-transform duration-300">
              {/* Depth layers */}
              <div className="absolute inset-0 bg-slate-950/40 rounded-lg translate-y-2 translate-x-2 blur-lg" />
              <div className="absolute inset-0 bg-slate-900/60 rounded-lg translate-y-1 translate-x-1 blur-sm" />
              
              {/* Main card */}
              <div 
                className="relative bg-slate-900/50 border border-amber-600/30 rounded-lg p-8"
                style={{
                  boxShadow: `
                    0 10px 15px -3px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.05)
                  `,
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/40" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/40" />

                <h3 className="text-xs uppercase tracking-widest text-amber-500/80 mb-6 font-mono flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Planet Context
                </h3>

                <dl className="space-y-4 text-sm mb-8">
                  {[
                    { term: 'Host Star', value: 'G2V' },
                    { term: 'Semi-major Axis', value: '1.02 AU' },
                    { term: 'Discovery Year', value: '2024' },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between py-2 px-3 bg-slate-950/30 rounded border-l-2 border-amber-600/40"
                    >
                      <dt className="text-slate-400 font-mono">{item.term}</dt>
                      <dd className="text-slate-200 font-mono font-semibold">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                
                <OrbitalDiagram />
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation Card */}
        <div className="perspective-1000 mb-8">
          <div className="relative transform-gpu hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-slate-950/40 rounded-lg translate-y-1 translate-x-1 blur-md" />
            
            <div 
              className="relative bg-slate-900/40 border border-slate-800/50 rounded-lg p-8"
              style={{ boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.03)' }}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-600/30" />
              
              <h3 className="text-xs uppercase tracking-widest text-amber-500/70 mb-4 font-mono flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-amber-500 rounded-full" />
                Interpretation
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm font-light">
                {getInterpretation()}
              </p>
            </div>
          </div>
        </div>

        {/* Key Factors Card */}
        <div className="perspective-1000 mb-12">
          <div className="relative transform-gpu hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-slate-950/40 rounded-lg translate-y-1 translate-x-1 blur-md" />
            
            <div 
              className="relative bg-slate-900/40 border border-slate-800/50 rounded-lg p-8"
              style={{ boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.03)' }}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-600/30" />
              
              <h3 className="text-xs uppercase tracking-widest text-amber-500/70 mb-4 font-mono flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-amber-500 rounded-full" />
                Key Factors Affecting Score
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {getKeyFactors().map((factor, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 py-2 px-3 bg-slate-950/20 rounded border-l-2 border-slate-700/50 hover:border-amber-600/40 transition-colors"
                  >
                    <span className="text-amber-600/60 mt-1 font-mono text-xs">▸</span>
                    <span className="font-light">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3D Action Buttons */}
        <div className="flex gap-6 justify-center">
          {[
            { label: 'Return to Configuration', onClick: onReset, primary: true },
            { label: 'Export Report', onClick: () => window.print(), primary: false },
          ].map((button, index) => (
            <div key={index} className="relative perspective-1000">
              <div className="absolute inset-0 bg-slate-950/40 rounded-lg translate-y-1 translate-x-1 blur-sm" />
              
              <button
                onClick={button.onClick}
                className={`
                  relative px-8 py-3
                  ${button.primary 
                    ? 'bg-slate-900/80 border-2 border-amber-600/50 text-amber-500 hover:border-amber-500/70 hover:text-amber-400' 
                    : 'bg-slate-950/60 border border-slate-700/50 text-slate-300 hover:bg-slate-900/60 hover:border-slate-600'
                  }
                  font-mono text-sm tracking-wide
                  rounded-lg
                  transition-all duration-300
                  hover:shadow-lg
                  active:translate-y-0.5
                `}
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Corner accents for primary button */}
                {button.primary && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/60" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/60" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/60" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/60" />
                  </>
                )}
                
                {button.label}
              </button>
            </div>
          ))}
        </div>

        {/* Vintage footer */}
        <div className="mt-16 flex items-center justify-center opacity-40">
          <div className="h-px w-32 bg-slate-600" />
          <div className="mx-4 text-slate-600 text-xs font-mono">◊</div>
          <div className="h-px w-32 bg-slate-600" />
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}