'use client';

import { useState } from 'react';
import InputCard from '@/components/InputCard';
import ResultsDisplay from '@/components/ResultsDisplay';
import BackgroundVideo from '@/components/BackgroundVideo';
import Toast from '@/components/Toast';
import { PlanetFormData, PredictionResponse } from '@/types';
import { predictHabitability } from '@/lib/utils';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Home() {
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
      const result = await predictHabitability(formData);
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

  if (prediction) {
    return (
      <>
        <BackgroundVideo src="/backgrounds/results-bg.mp4" opacity={0.2} />
        <ResultsDisplay prediction={prediction} onReset={handleReset} />
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </>
    );
  }

  return (
    <>
      <BackgroundVideo src="/backgrounds/input-bg.mp4" opacity={0.3} />
      
      <div className="min-h-screen relative z-10">
        {toast.show && (
          <div className="fixed top-4 right-4 z-50">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-2xl font-light text-slate-100 mb-2">
              ExoHabitAI
            </h1>
            <p className="text-sm text-slate-400 uppercase tracking-wider">
              Habitability Prediction System
            </p>
          </header>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Planet Identity */}
            <InputCard title="Planet Identity">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.planet_name}
                  onChange={(e) => setFormData({ ...formData, planet_name: e.target.value })}
                  placeholder="e.g., Kepler-452b"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
            </InputCard>

            {/* Orbital Dynamics */}
            <InputCard title="Orbital Dynamics">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Period (days)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pl_orbper}
                  onChange={(e) => setFormData({ ...formData, pl_orbper: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Semi-major Axis (AU)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.pl_orbsmax}
                  onChange={(e) => setFormData({ ...formData, pl_orbsmax: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
            </InputCard>

            {/* Stellar Context */}
            <InputCard title="Stellar Context">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Spectral Type
                </label>
                <select
                  value={formData.st_type}
                  onChange={(e) => setFormData({ ...formData, st_type: e.target.value as any })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 appearance-none cursor-pointer"
                >
                  <option value="F">F-type</option>
                  <option value="G">G-type</option>
                  <option value="K">K-type</option>
                  <option value="M">M-type</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Metallicity [Fe/H]
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.st_met}
                  onChange={(e) => setFormData({ ...formData, st_met: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
            </InputCard>

            {/* Physical Parameters */}
            <InputCard title="Physical Parameters">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Mass (Earth masses)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pl_bmasse}
                  onChange={(e) => setFormData({ ...formData, pl_bmasse: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Composition Type
                </label>
                <select
                  value={formData.pl_type}
                  onChange={(e) => setFormData({ ...formData, pl_type: e.target.value as any })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 appearance-none cursor-pointer"
                >
                  <option value="rocky">Rocky</option>
                  <option value="super_earth">Super Earth</option>
                  <option value="neptune">Neptune-like</option>
                  <option value="jupiter">Jupiter-like</option>
                </select>
              </div>
            </InputCard>

            {/* Discovery Metadata */}
            <InputCard title="Discovery Metadata">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Surface Gravity (log g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.st_logg}
                  onChange={(e) => setFormData({ ...formData, st_logg: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Discovery Year
                </label>
                <input
                  type="number"
                  value={formData.disc_year}
                  onChange={(e) => setFormData({ ...formData, disc_year: parseInt(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-colors"
                />
              </div>
            </InputCard>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-50 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running Analysis...' : 'Run Analysis'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}