import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import ErrorAlert from "@/components/ErrorAlert";
import { PlanetaryParams, StellarParams, PredictionResult, FormErrors } from "@/types/exohabit";
import { validatePlanetaryParams, validateStellarParams, predictHabitability } from "@/lib/api";
const initialPlanetary: PlanetaryParams = {
  planetaryMass: "",
  planetaryRadius: "",
  orbitalPeriod: "",
  semiMajorAxis: "",
  eccentricity: "",
  equilibriumTemperature: "",
};
const initialStellar: StellarParams = {
  stellarMass: "",
  stellarRadius: "",
  stellarTemperature: "",
  stellarLuminosity: "",
  stellarMetallicity: "",
  stellarAge: "",
};
const Index = () => {
  const [planetary, setPlanetary] = useState<PlanetaryParams>(initialPlanetary);
  const [stellar, setStellar] = useState<StellarParams>(initialStellar);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handlePlanetaryChange = (name: string, value: string) => {
    setPlanetary((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleStellarChange = (name: string, value: string) => {
    setStellar((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleSubmit = async () => {
    const planetaryErrors = validatePlanetaryParams(planetary);
    const stellarErrors = validateStellarParams(stellar);
    const allErrors = { ...planetaryErrors, ...stellarErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    setErrors({});
    setApiError(null);
    setResult(null);
    setIsLoading(true);
    try {
      const data = await predictHabitability(planetary, stellar);
      setResult(data);
    } catch (err: any) {
      setApiError(
        err.message || "Failed to connect to the prediction server. Make sure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen stars-bg">
      <HeroSection />
      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        {apiError && (
          <ErrorAlert message={apiError} onDismiss={() => setApiError(null)} />
        )}
        <PredictionForm
          planetary={planetary}
          stellar={stellar}
          errors={errors}
          isLoading={isLoading}
          onPlanetaryChange={handlePlanetaryChange}
          onStellarChange={handleStellarChange}
          onSubmit={handleSubmit}
        />
        {result && <ResultsDisplay result={result} />}
        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            ExoHabitAI — AI-Powered Exoplanet Habitability Prediction
          </p>
        </footer>
      </main>
    </div>
  );
};