'use client';

import { motion } from 'framer-motion';
import { Sparkles, Target, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
            AI-Powered Exoplanet Analysis
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
        >
          Exoplanet Habitability
          <br />
          Explorer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover potentially habitable exoplanets using advanced machine learning.
          Enter planetary and stellar parameters to predict habitability with scientific precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm"
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300">High Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">ML-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Real-time Prediction</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}