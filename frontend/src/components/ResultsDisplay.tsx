'use client';

import { PredictionResponse } from '@/types';
import OrbitalDiagram from './OrbitalDiagram';

interface ResultsDisplayProps {
  prediction: PredictionResponse;
  onReset: () => void;
}

export default function ResultsDisplay({ prediction, onReset }: ResultsDisplayProps) {
  const { planet_name, habitability_prediction, confidence, recommendation } = prediction;
  const { is_habitable, probability, score, category } = habitability_prediction;

  // Generate interpretation text
  const getInterpretation = () => {
    if (probability >= 0.7) {
      return "This planet exhibits characteristics consistent with temperate conditions. Orbital parameters place it within the conservative habitable zone. Stellar metallicity and surface gravity suggest stable long-term conditions favorable for atmospheric retention.";
    } else if (probability >= 0.4) {
      return "This planet shows moderate potential for habitability. While some parameters fall within acceptable ranges, certain characteristics may limit long-term stability. Further observational data would refine this assessment.";
    } else {
      return "Current parameters suggest low probability of Earth-like habitability. Orbital configuration, stellar environment, or physical characteristics present significant challenges for temperate surface conditions.";
    }
  };

  // Generate key factors
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-light text-slate-100 mb-2">
            Analysis Complete
          </h1>
          <p className="text-lg text-slate-300">
            {planet_name}
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Primary Score */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="text-7xl font-light text-slate-100 mb-2">
                {(probability * 100).toFixed(1)}%
              </div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-4">
                Habitability Score
              </div>
              <div className="text-xl text-slate-300 mb-6">
                {is_habitable ? 'Potentially Habitable' : 'Not Habitable'}
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Confidence</span>
                <span className="text-slate-200 font-mono">{confidence.level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Research Priority</span>
                <span className="text-slate-200 font-mono">{recommendation.priority_rank}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-200 font-mono">{category}</span>
              </div>
            </div>
          </div>

          {/* Planet Context */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
              Planet Context
            </h3>
            <dl className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <dt className="text-slate-400">Host Star</dt>
                <dd className="text-slate-200 font-mono">G2V</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Semi-major Axis</dt>
                <dd className="text-slate-200 font-mono">1.02 AU</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Discovery Year</dt>
                <dd className="text-slate-200 font-mono">2024</dd>
              </div>
            </dl>
            
            <OrbitalDiagram />
          </div>
        </div>

        {/* Interpretation */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-6 mb-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">
            Interpretation
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            {getInterpretation()}
          </p>
        </div>

        {/* Key Factors */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-6 mb-8">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">
            Key Factors Affecting Score
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {getKeyFactors().map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Return to Configuration
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 border border-slate-700 hover:bg-slate-900/60 text-slate-200 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}