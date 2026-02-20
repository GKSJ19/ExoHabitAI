import { useState, useEffect, useCallback } from "react";
import HabitabilityMeter from "@/components/HabitabilityMeter";
import PlanetaryForm, { PlanetaryParams } from "@/components/PlanetaryForm";
import StellarForm, { StellarParams } from "@/components/StellarForm";
import ResultsDisplay, { PredictionResult } from "@/components/ResultsDisplay";
import PlanetRanking, { RankedPlanet } from "@/components/PlanetRanking";
import { computeHabitabilityScore, predictFromAPI } from "@/lib/habitability";
import { Button } from "@/components/ui/button";
import spaceHero from "@/assets/space-hero.jpg";

// ── Presets ────────────────────────────────────────────────────────────────────
const PRESETS = {
  earth: {
    planet: { planetRadius: 1.0, planetMass: 1.0, orbitalPeriod: 365, equilibriumTemp: 288, semiMajorAxis: 1.0 },
    stellar: { starTemp: 5778, starLuminosity: 1.0, starType: "G" as const, starMass: 1.0 },
  },
  kepler442b: {
    planet: { planetRadius: 1.34, planetMass: 2.3, orbitalPeriod: 112, equilibriumTemp: 233, semiMajorAxis: 0.409 },
    stellar: { starTemp: 4402, starLuminosity: 0.112, starType: "K" as const, starMass: 0.61 },
  },
  trappist1e: {
    planet: { planetRadius: 0.92, planetMass: 0.77, orbitalPeriod: 6.1, equilibriumTemp: 251, semiMajorAxis: 0.029 },
    stellar: { starTemp: 2566, starLuminosity: 0.000553, starType: "M" as const, starMass: 0.089 },
  },
  mars: {
    planet: { planetRadius: 0.532, planetMass: 0.107, orbitalPeriod: 687, equilibriumTemp: 210, semiMajorAxis: 1.524 },
    stellar: { starTemp: 5778, starLuminosity: 1.0, starType: "G" as const, starMass: 1.0 },
  },
};

type PresetKey = keyof typeof PRESETS;

const DEFAULT_PLANET: PlanetaryParams = PRESETS.earth.planet;
const DEFAULT_STELLAR: StellarParams = PRESETS.earth.stellar;

// ── Validation ─────────────────────────────────────────────────────────────────
function validate(planet: PlanetaryParams, stellar: StellarParams) {
  const pErrors: Partial<Record<keyof PlanetaryParams, string>> = {};
  const sErrors: Partial<Record<keyof StellarParams, string>> = {};

  if (planet.planetRadius < 0.1 || planet.planetRadius > 10)
    pErrors.planetRadius = "Must be between 0.1 and 10 R⊕";
  if (planet.planetMass < 0.1 || planet.planetMass > 20)
    pErrors.planetMass = "Must be between 0.1 and 20 M⊕";
  if (planet.orbitalPeriod < 1 || planet.orbitalPeriod > 1000)
    pErrors.orbitalPeriod = "Must be between 1 and 1000 days";
  if (planet.equilibriumTemp < 50 || planet.equilibriumTemp > 800)
    pErrors.equilibriumTemp = "Must be between 50 and 800 K";
  if (planet.semiMajorAxis < 0.01 || planet.semiMajorAxis > 5)
    pErrors.semiMajorAxis = "Must be between 0.01 and 5 AU";

  if (stellar.starTemp < 2000 || stellar.starTemp > 12000)
    sErrors.starTemp = "Must be between 2,000 and 12,000 K";
  if (stellar.starLuminosity < 0.001 || stellar.starLuminosity > 100)
    sErrors.starLuminosity = "Must be between 0.001 and 100 L☉";
  if (stellar.starMass < 0.08 || stellar.starMass > 8)
    sErrors.starMass = "Must be between 0.08 and 8 M☉";

  return { pErrors, sErrors, isValid: Object.keys(pErrors).length === 0 && Object.keys(sErrors).length === 0 };
}

// ── Main Page ──────────────────────────────────────────────────────────────────
const Index = () => {
  const [planet, setPlanet] = useState<PlanetaryParams>(DEFAULT_PLANET);
  const [stellar, setStellar] = useState<StellarParams>(DEFAULT_STELLAR);
  const [liveScore, setLiveScore] = useState(75);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pErrors, setPErrors] = useState<Partial<Record<keyof PlanetaryParams, string>>>({});
  const [sErrors, setSErrors] = useState<Partial<Record<keyof StellarParams, string>>>({});
  const [activePreset, setActivePreset] = useState<PresetKey | null>("earth");
  const [rankings, setRankings] = useState<RankedPlanet[]>([]);
  const [predictionCount, setPredictionCount] = useState(0);

  // Live score updates as sliders move
  useEffect(() => {
    const r = computeHabitabilityScore(planet, stellar);
    setLiveScore(r.score);
  }, [planet, stellar]);

  const handlePreset = useCallback((key: PresetKey) => {
    const p = PRESETS[key];
    setPlanet(p.planet);
    setStellar(p.stellar);
    setActivePreset(key);
    setResult(null);
    setApiError(null);
    setPErrors({});
    setSErrors({});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { pErrors: pe, sErrors: se, isValid } = validate(planet, stellar);
    setPErrors(pe);
    setSErrors(se);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const r = await predictFromAPI(planet, stellar);
      setResult(r);
      const count = predictionCount + 1;
      setPredictionCount(count);
      const name = activePreset
        ? presetLabels[activePreset].label
        : `Planet #${count}`;
      setRankings((prev) => [
        ...prev,
        { id: `${Date.now()}`, name, result: r, timestamp: Date.now() },
      ]);
    } catch (err) {
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlanet(DEFAULT_PLANET);
    setStellar(DEFAULT_STELLAR);
    setResult(null);
    setApiError(null);
    setPErrors({});
    setSErrors({});
    setActivePreset("earth");
  };

  const presetLabels: Record<PresetKey, { label: string; emoji: string }> = {
    earth: { label: "Earth", emoji: "🌍" },
    kepler442b: { label: "Kepler-442b", emoji: "🪐" },
    trappist1e: { label: "TRAPPIST-1e", emoji: "🌑" },
    mars: { label: "Mars", emoji: "🔴" },
  };

  return (
    <div className="min-h-screen stars-bg">
      {/* ── Hero Header ───────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${spaceHero})`, opacity: 0.18 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="relative z-10 text-center py-14 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-orbitron tracking-widest uppercase glow-border text-primary">
            <span className="animate-pulse">●</span> ML-Powered Analysis
          </div>
          <h1 className="font-orbitron text-3xl md:text-5xl font-black tracking-tight glow-text text-primary mb-3">
            Exoplanet Habitability
            <span className="block text-2xl md:text-3xl text-foreground/70 font-light tracking-wider mt-1">
              Prediction System
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Enter planetary and stellar parameters to assess the likelihood of life-supporting conditions using advanced ML models.
          </p>
        </div>
      </header>

      {/* ── Live Meter (sticky) ───────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-space-border py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-orbitron text-xs tracking-widest text-muted-foreground uppercase">
              Live Habitability Indicator
            </span>
          </div>
          <HabitabilityMeter score={liveScore} isLoading={isLoading} />
          <div className="text-xs text-muted-foreground italic text-center sm:text-right">
            Updates in real-time<br />as you change values
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Presets */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground font-orbitron uppercase tracking-wider mr-1">Presets:</span>
          {(Object.keys(presetLabels) as PresetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activePreset === key
                  ? "bg-primary text-primary-foreground shadow-primary"
                  : "bg-space-panel border border-space-border text-foreground/70 hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {presetLabels[key].emoji} {presetLabels[key].label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Planetary Parameters ── */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🪐</span>
                <div>
                  <h2 className="font-orbitron text-base font-bold text-foreground">Planetary Parameters</h2>
                  <p className="text-xs text-muted-foreground">Physical characteristics of the exoplanet</p>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-primary/40 to-transparent" />
              <PlanetaryForm params={planet} onChange={(p) => { setPlanet(p); setActivePreset(null); }} errors={pErrors} />
            </div>

            {/* ── Stellar Parameters ── */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">☀️</span>
                <div>
                  <h2 className="font-orbitron text-base font-bold text-foreground">Stellar Parameters</h2>
                  <p className="text-xs text-muted-foreground">Properties of the host star</p>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-space-gold/40 to-transparent" />
              <StellarForm params={stellar} onChange={(s) => { setStellar(s); setActivePreset(null); }} errors={sErrors} />
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-44 h-12 font-orbitron text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 shadow-primary pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "🚀 Predict Habitability"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="min-w-32 h-12 font-orbitron text-sm tracking-wider border-space-border text-foreground/70 hover:text-foreground hover:border-primary/50"
            >
              🔄 Reset
            </Button>
          </div>

          {/* ── API Error ── */}
          {apiError && (
            <div className="mt-4 p-4 rounded-xl border border-space-red/40 bg-space-red/10 text-space-red text-sm text-center animate-fade-in-up">
              ⚠️ {apiError}
            </div>
          )}
        </form>

        {/* ── Results ── */}
        {result && !isLoading && (
          <div className="mt-8 glass-card rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="font-orbitron text-base font-bold text-foreground">Prediction Results</h2>
                <p className="text-xs text-muted-foreground">Detailed habitability analysis</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-space-green/40 to-transparent mb-6" />
            <ResultsDisplay result={result} planetParams={planet} stellarParams={stellar} />
          </div>
        )}

        {rankings.length > 0 && (
          <div className="mt-8 glass-card rounded-2xl p-6">
            <PlanetRanking rankings={rankings} onClear={() => setRankings([])} />
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-space-border mt-12 py-6 text-center">
        <p className="text-xs text-muted-foreground font-orbitron tracking-widest">
          EXOPLANET HABITABILITY SYSTEM · ML-POWERED · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
