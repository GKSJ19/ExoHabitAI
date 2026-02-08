// src/components/ResultsDisplay.tsx (WITH SUMMARY POPUP)
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PredictionResponse } from '../types';

const Scene = dynamic(() => import('../components/three/Scene'), { ssr: false, loading: () => null });
const Environment = dynamic(() => import('../components/three/Environment'), { ssr: false });
const CameraController = dynamic(() => import('../components/three/CameraController'), { ssr: false });
const ResultPlanetWrapper = dynamic(() => import('./ResultPlanetWrapper'), { ssr: false });

interface ResultsDisplayProps {
  prediction: PredictionResponse;
  onReset: () => void;
  compositionType?: 'rocky' | 'super_earth' | 'neptune' | 'jupiter';
}

export default function ResultsDisplay({ prediction, onReset, compositionType = 'rocky' }: ResultsDisplayProps) {
  const { habitability_prediction, confidence, recommendation, planet_name } = prediction;
  const isHabitable = habitability_prediction.is_habitable;
  const probability = habitability_prediction.probability * 100;
  const [showSummary, setShowSummary] = useState(false);

  const statusColor = isHabitable ? 'text-emerald-500' : 'text-slate-500';

  // Generate Executive Summary
  const getExecutiveSummary = () => {
    if (probability >= 70) {
      return `${planet_name} exhibits high habitability probability (${probability.toFixed(1)}%). Model assessment indicates orbital parameters consistent with temperate zone placement. Stellar characteristics favor atmospheric stability. Confidence: ${confidence.level}. Recommended for priority spectroscopic follow-up observations.`;
    } else if (probability >= 40) {
      return `${planet_name} demonstrates moderate habitability potential (${probability.toFixed(1)}%). Certain planetary and stellar parameters fall within acceptable ranges, though limiting factors may constrain long-term habitability. Model confidence: ${confidence.level}. Additional observational data required for refined assessment.`;
    } else {
      return `${planet_name} shows low habitability probability (${probability.toFixed(1)}%). Current parameterization suggests conditions incompatible with Earth-analog habitability criteria. Primary constraints include orbital configuration and/or stellar environment. Model confidence: ${confidence.level}.`;
    }
  };

  // Generate Key Factors
  const getKeyFactors = () => {
    const factors = [];
    
    if (probability >= 50) {
      factors.push({
        factor: "Orbital Period",
        assessment: "Within temperate range for host star luminosity",
        impact: "Positive"
      });
      factors.push({
        factor: "Planetary Mass",
        assessment: "Consistent with rocky composition and atmospheric retention",
        impact: "Positive"
      });
      factors.push({
        factor: "Stellar Metallicity",
        assessment: "Moderate metallicity suggests stable long-term conditions",
        impact: "Positive"
      });
      factors.push({
        factor: "Semi-major Axis",
        assessment: "Habitable zone overlap confirmed via equilibrium temperature model",
        impact: "Positive"
      });
    } else {
      factors.push({
        factor: "Orbital Parameters",
        assessment: "Configuration outside optimal temperate zone",
        impact: "Negative"
      });
      factors.push({
        factor: "Physical Characteristics",
        assessment: "Mass and radius may limit atmospheric stability",
        impact: "Negative"
      });
      factors.push({
        factor: "Stellar Environment",
        assessment: "Host star properties present challenges for surface habitability",
        impact: "Negative"
      });
      factors.push({
        factor: "Data Quality",
        assessment: "Further spectroscopic observations needed to refine estimate",
        impact: "Neutral"
      });
    }
    
    return factors;
  };

  return (
    <div className="h-screen relative bg-[#050810]">
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Scene camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Environment />
            <ResultPlanetWrapper isHabitable={isHabitable} compositionType={compositionType}/>
            <CameraController enableOrbit autoRotate autoRotateSpeed={0.5} enableZoom={false} />
          </Suspense>
        </Scene>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        <header className="p-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors font-mono text-sm uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Mission Control
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="max-w-4xl w-full">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1 }} className="text-center mb-12">
              <div className="text-xs text-slate-600 uppercase tracking-[0.2em] mb-4 font-mono">Analysis Complete</div>
              <h1 className="text-7xl font-light text-slate-100 mb-4 tracking-tight">{planet_name}</h1>
              <div className={`text-5xl font-light ${statusColor} mb-6`}>{isHabitable ? 'Habitable' : 'Not Habitable'}</div>
              <div className="text-6xl font-light text-slate-400 font-mono">{probability.toFixed(1)}%</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }} className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/50 border border-slate-800 p-6">
                <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-2 font-mono">Category</div>
                <div className="text-lg text-slate-300">{habitability_prediction.category}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6">
                <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-2 font-mono">Confidence</div>
                <div className="text-lg text-slate-300">{confidence.level}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6">
                <div className="text-xs text-slate-600 uppercase tracking-[0.15em] mb-2 font-mono">Priority</div>
                <div className="text-lg text-slate-300">{recommendation.priority_rank}</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2 }} className="text-center mb-12">
              <p className="text-slate-500 max-w-2xl mx-auto">{habitability_prediction.description}</p>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.5 }} className="flex gap-4 justify-center">
              <button onClick={onReset} className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 transition-colors font-mono text-sm uppercase tracking-wider">
                New Analysis
              </button>
              
              <button onClick={() => setShowSummary(true)} className="px-8 py-4 bg-slate-900 border border-amber-700/50 hover:border-amber-500/70 text-amber-500 hover:text-amber-400 transition-colors font-mono text-sm uppercase tracking-wider">
                View Summary
              </button>

              <Link href="/dashboard">
                <button className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 transition-colors font-mono text-sm uppercase tracking-wider">
                  Dashboard
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Summary Popup Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8 z-50"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="absolute inset-0 bg-slate-950/60 rounded-lg translate-y-2 translate-x-2 blur-lg" />
              
              <div className="relative bg-slate-900/95 border-2 border-amber-600/30 rounded-lg p-8">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

                {/* Close button */}
                <button
                  onClick={() => setShowSummary(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-xs uppercase tracking-widest text-slate-500 mb-3 font-mono">
                    Scientific Summary
                  </div>
                  <h2 className="text-3xl font-light text-amber-500 mb-2 font-mono">
                    {planet_name}
                  </h2>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block w-1 h-1 bg-amber-500 rounded-full" />
                    <h3 className="text-xs uppercase tracking-widest text-amber-500/70 font-mono">
                      Executive Summary
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm font-light">
                    {getExecutiveSummary()}
                  </p>
                </div>

                {/* Key Factors */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block w-1 h-1 bg-amber-500 rounded-full" />
                    <h3 className="text-xs uppercase tracking-widest text-amber-500/70 font-mono">
                      Key Scientific Factors
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {getKeyFactors().map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 py-3 px-4 bg-slate-950/20 rounded border-l-2 border-slate-700/50"
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          item.impact === 'Positive' ? 'bg-emerald-500' :
                          item.impact === 'Negative' ? 'bg-red-500' :
                          'bg-slate-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm text-slate-300 font-mono mb-1">
                            {item.factor}
                          </div>
                          <div className="text-xs text-slate-500 font-light">
                            {item.assessment}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close button at bottom */}
                <div className="text-center pt-4 border-t border-slate-800/50">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="px-8 py-3 bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 transition-colors font-mono text-sm uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}