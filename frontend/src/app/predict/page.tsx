// src/app/predict/page.tsx (ENHANCED WITH REAL EXAMPLES & COMPOSITION TYPES)
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PlanetFormData, PredictionResponse } from '@/types';
import { apiClient } from '@/lib/api';
import InputCard3D from '@/components/InputCard3D';
import { Input3D, Select3D } from '@/components/Input3D';
import Toast from '@/components/Toast';

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });
const Environment = dynamic(() => import('@/components/three/Environment'), { ssr: false });

const ResultsDisplay = dynamic(() => import('@/components/ResultsDisplay'), { ssr: false });

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Real examples from TESS dataset
const REAL_EXAMPLES = [
  {
    planet_name: 'GJ 1132 b',
    pl_orbper: 1.62893,
    pl_orbsmax: 0.0157,
    pl_bmasse: 1.837,
    st_met: -0.17,
    st_logg: 5.037,
    disc_year: 2015,
    st_type: 'M',
    pl_type: 'rocky' as const,
    description: 'Rocky exoplanet around red dwarf'
  },
  {
    planet_name: 'CoRoT-2 b',
    pl_orbper: 1.743,
    pl_orbsmax: 0.0281,
    pl_bmasse: 542.1,
    st_met: -0.08,
    st_logg: 4.48,
    disc_year: 2008,
    st_type: 'G',
    pl_type: 'jupiter' as const,
    description: 'Hot Jupiter - gas giant'
  },
  {
    planet_name: 'GJ 1214 b',
    pl_orbper: 1.58,
    pl_orbsmax: 0.0149,
    pl_bmasse: 8.17,
    st_met: 0.29,
    st_logg: 5.026,
    disc_year: 2009,
    st_type: 'M',
    pl_type: 'neptune' as const,
    description: 'Neptune-like mini-Neptune'
  },
  {
    planet_name: 'G 9-40 b',
    pl_orbper: 5.746,
    pl_orbsmax: 0.0385,
    pl_bmasse: 11.7,
    st_met: 0.04,
    st_logg: 4.926,
    disc_year: 2019,
    st_type: 'M',
    pl_type: 'super_earth' as const,
    description: 'Super-Earth candidate'
  }
];

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  
  const [formData, setFormData] = useState<PlanetFormData>({
    planet_name: '',
    pl_orbper: 365.25,
    pl_orbsmax: 1.0,
    pl_bmasse: 1.0,
    st_met: 0.0,
    st_logg: 4.44,
    disc_year: 2024,
    st_type: 'G',
    pl_type: 'rocky',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async () => {
    if (!formData.planet_name.trim()) {
      showToast('Planet name is required', 'error');
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const result = await apiClient.predict(formData);
      setPrediction(result);
      showToast('Analysis complete', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setFormData({
      planet_name: '',
      pl_orbper: 365.25,
      pl_orbsmax: 1.0,
      pl_bmasse: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      disc_year: 2024,
      st_type: 'G',
      pl_type: 'rocky',
    });
  };

  const loadExample = (example: typeof REAL_EXAMPLES[0]) => {
    setFormData({
      planet_name: example.planet_name,
      pl_orbper: example.pl_orbper,
      pl_orbsmax: example.pl_orbsmax,
      pl_bmasse: example.pl_bmasse,
      st_met: example.st_met,
      st_logg: example.st_logg,
      disc_year: example.disc_year,
      st_type: example.st_type,
      pl_type: example.pl_type,
    });
    showToast(`Loaded: ${example.planet_name}`, 'info');
  };

  if (prediction) {
    return (
      <ResultsDisplay 
        prediction={prediction} 
        onReset={handleReset}
        compositionType={formData.pl_type}
      />
    );
  }

  return (
    <>
      {/* 3D Background */}
      <div className="fixed inset-0 -z-10">
        <Scene camera={{ position: [0, 0, 20], fov: 50 }}>
          <Environment />
        </Scene>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen relative z-10 py-12"
      >
        {/* Toast */}
        <AnimatePresence>
          {toast.show && (
            <div className="fixed top-4 right-4 z-50">
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
              />
            </div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-100 transition-colors font-mono text-sm uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Mission Control
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl font-light text-slate-100 mb-3 tracking-tight">
              Habitability Prediction
            </h1>
            <p className="text-sm text-slate-500 uppercase tracking-[0.15em] font-mono">
              Input planetary parameters
            </p>
          </motion.header>

          {/* Real TESS Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h3 className="text-xs uppercase tracking-widest text-slate-600 font-mono mb-4">
                Load Real Exoplanet
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {REAL_EXAMPLES.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="relative group perspective-1000"
                >
                  <div className="absolute inset-0 bg-slate-950/40 rounded translate-y-1 translate-x-1 blur-sm" />
                  
                  <div className="relative px-4 py-3 bg-slate-900/60 border border-slate-700 hover:border-amber-500/50 rounded transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-amber-500 font-mono text-sm mb-1 truncate">
                      {example.planet_name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {example.description}
                    </div>
                    <div className="absolute top-1 right-1">
                      <div className={`w-2 h-2 rounded-full ${
                        example.pl_type === 'rocky' ? 'bg-emerald-500' :
                        example.pl_type === 'super_earth' ? 'bg-blue-500' :
                        example.pl_type === 'neptune' ? 'bg-cyan-500' :
                        'bg-amber-500'
                      }`} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <InputCard3D title="Planet Identity">
                <Input3D
                  label="Designation"
                  type="text"
                  value={formData.planet_name}
                  onChange={(e) => setFormData({ ...formData, planet_name: e.target.value })}
                  placeholder="e.g., Kepler-452b"
                />
              </InputCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <InputCard3D title="Orbital Dynamics">
                <Input3D
                  label="Period (days)"
                  type="number"
                  step="0.01"
                  value={formData.pl_orbper}
                  onChange={(e) => setFormData({ ...formData, pl_orbper: parseFloat(e.target.value) })}
                />
                <Input3D
                  label="Semi-major Axis (AU)"
                  type="number"
                  step="0.001"
                  value={formData.pl_orbsmax}
                  onChange={(e) => setFormData({ ...formData, pl_orbsmax: parseFloat(e.target.value) })}
                />
              </InputCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <InputCard3D title="Stellar Context">
                <Select3D
                  label="Spectral Type"
                  value={formData.st_type}
                  onChange={(e) => setFormData({ ...formData, st_type: e.target.value as any })}
                >
                  <option value="F">F-type</option>
                  <option value="G">G-type</option>
                  <option value="K">K-type</option>
                  <option value="M">M-type</option>
                  <option value="Other">Other</option>
                </Select3D>
                <Input3D
                  label="Metallicity [Fe/H]"
                  type="number"
                  step="0.01"
                  value={formData.st_met}
                  onChange={(e) => setFormData({ ...formData, st_met: parseFloat(e.target.value) })}
                />
              </InputCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <InputCard3D title="Physical Parameters">
                <Input3D
                  label="Mass (Earth masses)"
                  type="number"
                  step="0.01"
                  value={formData.pl_bmasse}
                  onChange={(e) => setFormData({ ...formData, pl_bmasse: parseFloat(e.target.value) })}
                />
                <Select3D
                  label="Composition Type"
                  value={formData.pl_type}
                  onChange={(e) => setFormData({ ...formData, pl_type: e.target.value as any })}
                >
                  <option value="rocky">Rocky Planet</option>
                  <option value="super_earth">Super-Earth</option>
                  <option value="neptune">Neptune-like</option>
                  <option value="jupiter">Jupiter-like</option>
                </Select3D>
              </InputCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <InputCard3D title="Discovery Metadata">
                <Input3D
                  label="Surface Gravity (log g)"
                  type="number"
                  step="0.01"
                  value={formData.st_logg}
                  onChange={(e) => setFormData({ ...formData, st_logg: parseFloat(e.target.value) })}
                />
                <Input3D
                  label="Discovery Year"
                  type="number"
                  value={formData.disc_year}
                  onChange={(e) => setFormData({ ...formData, disc_year: parseInt(e.target.value) })}
                />
              </InputCard3D>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex justify-center"
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                px-16 py-5 bg-slate-900 border-2 border-slate-700
                text-slate-300 font-mono uppercase tracking-[0.15em] text-sm
                transition-all duration-300
                ${isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-slate-500 hover:text-slate-100'
                }
              `}
            >
              {isLoading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}