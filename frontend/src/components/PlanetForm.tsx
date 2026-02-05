'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Orbit,
  Gauge,
  Star,
  Thermometer,
  Calendar,
  Atom,
  Mountain,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { PlanetFormData, ValidationError } from '@/types';
import { cn } from '@/lib/utils';

interface PlanetFormProps {
  onSubmit: (data: PlanetFormData) => Promise<void>;
  isLoading: boolean;
}

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export default function PlanetForm({ onSubmit, isLoading }: PlanetFormProps) {
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

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.planet_name.trim()) {
      newErrors.push({ field: 'planet_name', message: 'Planet name is required' });
    }

    if (formData.pl_orbper < 0.1 || formData.pl_orbper > 100000) {
      newErrors.push({
        field: 'pl_orbper',
        message: 'Orbital period must be between 0.1 and 100000 days',
      });
    }

    if (formData.pl_orbsmax < 0.001 || formData.pl_orbsmax > 1000) {
      newErrors.push({
        field: 'pl_orbsmax',
        message: 'Semi-major axis must be between 0.001 and 1000 AU',
      });
    }

    if (formData.pl_bmasse < 0.01 || formData.pl_bmasse > 13000) {
      newErrors.push({
        field: 'pl_bmasse',
        message: 'Planet mass must be between 0.01 and 13000 Earth masses',
      });
    }

    if (formData.st_met < -3.0 || formData.st_met > 1.0) {
      newErrors.push({
        field: 'st_met',
        message: 'Stellar metallicity must be between -3.0 and 1.0',
      });
    }

    if (formData.st_logg < 0.0 || formData.st_logg > 6.0) {
      newErrors.push({
        field: 'st_logg',
        message: 'Surface gravity must be between 0.0 and 6.0',
      });
    }

    if (formData.disc_year < 1990 || formData.disc_year > 2030) {
      newErrors.push({
        field: 'disc_year',
        message: 'Discovery year must be between 1990 and 2030',
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isLoading) {
      await onSubmit(formData);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  const handleNumberChange = (field: keyof PlanetFormData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData({ ...formData, [field]: numValue });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Planet Name */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={inputVariants}
        className="glass glass-hover rounded-2xl p-6"
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
          <Globe className="w-4 h-4 text-cyan-400" />
          Planet Name
        </label>
        <input
          type="text"
          value={formData.planet_name}
          onChange={(e) => setFormData({ ...formData, planet_name: e.target.value })}
          placeholder="e.g., Kepler-452b"
          className={cn(
            'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
            'placeholder-gray-500 transition-all duration-300',
            getFieldError('planet_name')
              ? 'border-red-500 focus:border-red-500'
              : 'border-white/10 focus:border-blue-500'
          )}
        />
        {getFieldError('planet_name') && (
          <p className="mt-2 text-sm text-red-400">{getFieldError('planet_name')}</p>
        )}
      </motion.div>

      {/* Planetary Parameters */}
      <div className="glass glass-hover rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mountain className="w-5 h-5 text-purple-400" />
          Planetary Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div custom={1} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Orbit className="w-4 h-4 text-blue-400" />
              Orbital Period (days)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pl_orbper}
              onChange={(e) => handleNumberChange('pl_orbper', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('pl_orbper')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('pl_orbper') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('pl_orbper')}</p>
            )}
          </motion.div>

          <motion.div custom={2} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Atom className="w-4 h-4 text-cyan-400" />
              Semi-major Axis (AU)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.pl_orbsmax}
              onChange={(e) => handleNumberChange('pl_orbsmax', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('pl_orbsmax')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('pl_orbsmax') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('pl_orbsmax')}</p>
            )}
          </motion.div>

          <motion.div custom={3} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Gauge className="w-4 h-4 text-green-400" />
              Planet Mass (Earth masses)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pl_bmasse}
              onChange={(e) => handleNumberChange('pl_bmasse', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('pl_bmasse')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('pl_bmasse') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('pl_bmasse')}</p>
            )}
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Globe className="w-4 h-4 text-purple-400" />
              Planet Type
            </label>
            <select
              value={formData.pl_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pl_type: e.target.value as PlanetFormData['pl_type'],
                })
              }
              className="w-full bg-space-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500"
            >
              <option value="rocky">Rocky</option>
              <option value="super_earth">Super Earth</option>
              <option value="neptune">Neptune-like</option>
              <option value="jupiter">Jupiter-like</option>
            </select>
          </motion.div>
        </div>
      </div>

      {/* Stellar Parameters */}
      <div className="glass glass-hover rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Stellar Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div custom={5} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Atom className="w-4 h-4 text-orange-400" />
              Stellar Metallicity [Fe/H]
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.st_met}
              onChange={(e) => handleNumberChange('st_met', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('st_met')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('st_met') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('st_met')}</p>
            )}
          </motion.div>

          <motion.div custom={6} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              Surface Gravity (log g)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.st_logg}
              onChange={(e) => handleNumberChange('st_logg', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('st_logg')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('st_logg') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('st_logg')}</p>
            )}
          </motion.div>

          <motion.div custom={7} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Stellar Type
            </label>
            <select
              value={formData.st_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  st_type: e.target.value as PlanetFormData['st_type'],
                })
              }
              className="w-full bg-space-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500"
            >
              <option value="F">F-type (Hot)</option>
              <option value="G">G-type (Sun-like)</option>
              <option value="K">K-type (Orange Dwarf)</option>
              <option value="M">M-type (Red Dwarf)</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>

          <motion.div custom={8} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Discovery Year
            </label>
            <input
              type="number"
              value={formData.disc_year}
              onChange={(e) => handleNumberChange('disc_year', e.target.value)}
              className={cn(
                'w-full bg-space-navy/50 border rounded-xl px-4 py-3 text-white',
                getFieldError('disc_year')
                  ? 'border-red-500'
                  : 'border-white/10 focus:border-blue-500'
              )}
            />
            {getFieldError('disc_year') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('disc_year')}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-4 px-8 rounded-2xl font-bold text-lg',
          'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600',
          'text-white shadow-2xl transition-all duration-300',
          'hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-3',
          isLoading ? 'animate-pulse' : 'glow-blue'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Analyzing Habitability...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Predict Habitability
          </>
        )}
      </motion.button>
    </form>
  );
}