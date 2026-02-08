// src/components/dashboard/MissionControl.tsx (TRULY DARK POPUP)
'use client';

import { useState } from 'react';
import { useRanking } from '@/hooks/useRanking';
import SystemHealth from './SystemHealth';
import Statistics from './Statistics';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RankingCandidate } from '@/lib/api';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/three/Scene'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-slate-600 font-mono text-sm uppercase tracking-wider">
        Loading orbital view...
      </div>
    </div>
  )
});

const Environment = dynamic(() => import('@/components/three/Environment'), { ssr: false });
const OrbitalRings = dynamic(() => import('@/components/three/OrbitalRings'), { ssr: false });
const CameraController = dynamic(() => import('@/components/three/CameraController'), { ssr: false });

export default function MissionControl() {
  const { data, isLoading } = useRanking({ top: 20, threshold: 0.0 });
  const [selectedPlanet, setSelectedPlanet] = useState<RankingCandidate | null>(null);
  const [showPredictionDetails, setShowPredictionDetails] = useState(false);

  const handlePlanetClick = (planet: RankingCandidate) => {
    setSelectedPlanet(planet);
    setShowPredictionDetails(true);
  };

  const getPredictionInfo = (planet: RankingCandidate) => {
    const prob = planet.habitability_probability;
    if (prob >= 0.7) {
      return {
        category: 'High Confidence',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-950/30',
        borderColor: 'border-emerald-800/50',
        description: 'Strong habitability candidate - recommended for immediate spectroscopic follow-up'
      };
    } else if (prob >= 0.5) {
      return {
        category: 'Moderate Confidence',
        color: 'text-blue-500',
        bgColor: 'bg-blue-950/30',
        borderColor: 'border-blue-800/50',
        description: 'Moderate habitability potential - requires parameter refinement'
      };
    } else {
      return {
        category: 'Low Confidence',
        color: 'text-amber-500',
        bgColor: 'bg-amber-950/30',
        borderColor: 'border-amber-800/50',
        description: 'Lower habitability likelihood - further analysis needed'
      };
    }
  };

  return (
    <div className="h-screen flex bg-[#050810]">
      {/* Left Panel */}
      <aside className="w-80 border-r border-slate-800/50 flex flex-col">
        <div className="border-b border-slate-800/50 p-8">
          <div className="mb-1">
            <h1 className="text-2xl font-light text-slate-100 tracking-tight">
              ExoHabitAI
            </h1>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-[0.15em] font-mono">
            Mission Control
          </p>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <SystemHealth />
          <Statistics data={data} isLoading={isLoading} />
        </div>

        <div className="border-t border-slate-800/50 p-8">
          <Link href="/predict">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 transition-colors duration-200 text-sm uppercase tracking-wider font-mono"
            >
              Start Prediction
            </motion.button>
          </Link>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-600 font-mono text-sm uppercase tracking-wider">
              Loading planetary data...
            </div>
          </div>
        ) : data?.candidates && data.candidates.length > 0 ? (
          <Scene camera={{ position: [0, 35, 0], fov: 60 }}>
            <Environment />
            <OrbitalRings 
              planets={data.candidates} 
              onPlanetClick={handlePlanetClick}
            />
            <CameraController 
              enableOrbit 
              autoRotate={false}
              enableZoom
              enablePan={false}
            />
          </Scene>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-600 font-mono text-sm uppercase tracking-wider mb-2">
                No data available
              </div>
              <div className="text-slate-700 text-xs">
                Ensure backend is running on port 5000
              </div>
            </div>
          </div>
        )}

        {/* Planet Prediction Details Modal - TRULY DARK */}
        <AnimatePresence>
          {showPredictionDetails && selectedPlanet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
              onClick={() => setShowPredictionDetails(false)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)', // 95% black
                backdropFilter: 'blur(12px)',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full"
              >
                {/* Shadow layers for depth */}
                <div className="absolute inset-0 bg-black/60 rounded-lg translate-y-3 translate-x-3 blur-xl" />
                <div className="absolute inset-0 bg-black/40 rounded-lg translate-y-2 translate-x-2 blur-lg" />
                
                {/* Main modal - completely opaque */}
                <div 
                  className="relative border-2 border-amber-600/40 rounded-lg p-8"
                  style={{
                    backgroundColor: '#0f172a', // Solid slate-900
                  }}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

                  {/* Close button */}
                  <button
                    onClick={() => setShowPredictionDetails(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Content */}
                  <div className="text-center mb-8">
                    <div className="text-xs uppercase tracking-widest text-slate-500 mb-3 font-mono">
                      Prediction Analysis
                    </div>
                    <h2 className="text-3xl font-light text-amber-500 mb-4 font-mono">
                      {selectedPlanet.planet_name}
                    </h2>
                    
                    {(() => {
                      const info = getPredictionInfo(selectedPlanet);
                      return (
                        <>
                          <div className="text-6xl font-light text-slate-100 mb-3 font-mono">
                            {(selectedPlanet.habitability_probability * 100).toFixed(1)}%
                          </div>
                          <div className={`inline-block px-6 py-2 rounded ${info.bgColor} border ${info.borderColor} ${info.color} font-mono text-lg mb-4`}>
                            {info.category}
                          </div>
                          <p className="text-sm text-slate-400 mt-4 max-w-lg mx-auto">
                            {info.description}
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      className="p-4 rounded border border-slate-800/50"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-2">
                        Rank
                      </div>
                      <div className="text-2xl font-light text-slate-100 font-mono">
                        #{selectedPlanet.rank}
                      </div>
                    </div>
                    <div 
                      className="p-4 rounded border border-slate-800/50"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-2">
                        Status
                      </div>
                      <div className={`text-lg font-mono ${selectedPlanet.predicted_habitable ? 'text-emerald-500' : 'text-red-500'}`}>
                        {selectedPlanet.predicted_habitable ? 'Habitable' : 'Not Habitable'}
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <div className="text-center">
                    <button 
                      onClick={() => setShowPredictionDetails(false)}
                      className="px-8 py-3 bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 transition-colors font-mono text-sm uppercase tracking-wider"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="absolute top-8 right-8 text-right">
          <div className="text-xs text-slate-600 uppercase tracking-wider font-mono space-y-1">
            <div>Drag to rotate view</div>
            <div>Scroll to zoom</div>
            <div className="text-amber-600/60">Click planet for details</div>
          </div>
        </div>

        {/* Orbital Legend */}
        <div className="absolute bottom-8 right-8 bg-slate-900/80 border border-slate-700 p-4 rounded">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-3">
            Orbital Rings
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500 font-mono">Inner: High Priority (≥70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500 font-mono">Middle: Moderate (50-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-500 font-mono">Outer: Low Priority (&lt;50%)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}