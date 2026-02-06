'use client';

import { useState } from 'react';
import BackgroundVideo from '@/components/BackgroundVideo';
import Toast from '@/components/Toast';
import ResultsDisplay from '@/components/ResultsDisplay';
import FloatingParticles from '@/components/FloatingParticles';
import { PlanetFormData, PredictionResponse } from '@/types';
import { predictHabitability } from '@/lib/utils';
import InputCard3D from '@/components/InputCard3D';
import { Input3D, Select3D } from '@/components/Input3D';

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
      <BackgroundVideo src="/backgrounds/input-bg.mp4" opacity={0.25} />
      <FloatingParticles count={20} />

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
          {/* Header with vintage styling */}
          <header className="mb-16 text-center relative">
            {/* Decorative top border */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-24 bg-amber-600/40" />
              <div className="mx-4 w-2 h-2 border border-amber-600/40 rotate-45" />
              <div className="h-px w-24 bg-amber-600/40" />
            </div>

            <div className="inline-block relative">
              <h1 className="text-4xl font-light text-slate-100 mb-3 tracking-wider font-mono">
                ExoHabitAI
              </h1>
              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />
            </div>

            <p className="text-sm text-amber-500/80 uppercase tracking-widest font-mono mt-2">
              Habitability Prediction System
            </p>

            {/* Decorative bottom border */}
            <div className="flex items-center justify-center mt-6">
              <div className="h-px w-24 bg-amber-600/40" />
              <div className="mx-4 w-2 h-2 border border-amber-600/40 rotate-45" />
              <div className="h-px w-24 bg-amber-600/40" />
            </div>
          </header>

          {/* 3D Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Planet Identity */}
            <InputCard3D title="Planet Identity">
              <Input3D
                label="Designation"
                type="text"
                value={formData.planet_name}
                onChange={(e) => setFormData({ ...formData, planet_name: e.target.value })}
                placeholder="e.g., Kepler-452b"
              />
            </InputCard3D>

            {/* Orbital Dynamics */}
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

            {/* Stellar Context */}
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

            {/* Physical Parameters */}
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
                <option value="rocky">Rocky</option>
                <option value="super_earth">Super Earth</option>
                <option value="neptune">Neptune-like</option>
                <option value="jupiter">Jupiter-like</option>
              </Select3D>
            </InputCard3D>

            {/* Discovery Metadata */}
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
          </div>

          {/* 3D Action Button */}
          <div className="flex justify-center">
            <div className="relative group perspective-1000">
              {/* Button shadow layers */}
              <div className="absolute inset-0 bg-amber-900/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="absolute inset-0 bg-slate-950/60 rounded-lg translate-y-2 translate-x-2 blur-sm" />
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                  relative px-12 py-4
                  bg-slate-900/80
                  border-2 border-amber-600/40
                  text-amber-500
                  font-mono font-semibold text-lg tracking-wider
                  rounded-lg
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:border-amber-500/60 hover:text-amber-400
                  hover:shadow-lg hover:shadow-amber-900/30
                  active:translate-y-1
                  group
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/60" />

                {/* Loading spinner */}
                {isLoading && (
                  <span className="inline-block w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mr-3" />
                )}
                
                {isLoading ? 'Running Analysis...' : 'Run Analysis'}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-lg border border-amber-400/50 animate-pulse-slow" />
                </div>
              </button>
            </div>
          </div>

          {/* Vintage footer decoration */}
          <div className="mt-16 flex items-center justify-center opacity-40">
            <div className="h-px w-32 bg-slate-600" />
            <div className="mx-4 text-slate-600 text-xs font-mono">◊</div>
            <div className="h-px w-32 bg-slate-600" />
          </div>
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
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}