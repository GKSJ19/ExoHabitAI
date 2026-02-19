import { useState } from "react";
import { Loader2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

interface PredictionResult {
  prediction: string;
  habitability_score: number;
}

const inputFields = [
  { key: "pl_rade", label: "Planet Radius", unit: "Earth radii", placeholder: "e.g. 1.0" },
  { key: "pl_masse", label: "Planet Mass", unit: "Earth masses", placeholder: "e.g. 1.0" },
  { key: "pl_orbper", label: "Orbital Period", unit: "days", placeholder: "e.g. 365" },
  { key: "st_teff", label: "Star Temperature", unit: "Kelvin", placeholder: "e.g. 5778" },
];

const Predict = () => {
  const [values, setValues] = useState<Record<string, string>>({
    pl_rade: "",
    pl_masse: "",
    pl_orbper: "",
    st_teff: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      pl_rade: parseFloat(values.pl_rade),
      pl_masse: parseFloat(values.pl_masse),
      pl_orbper: parseFloat(values.pl_orbper),
      pl_orbsmax: 1,
      pl_eqt: 288,
      pl_insol: 1,
      pl_dens: 5.5,
      st_teff: parseFloat(values.st_teff),
      st_mass: 1,
      st_rad: 1,
      st_lum: 1,
      st_logg: 4.4,
      st_met: 0.02,
      st_age: 4.6,
      sy_dist: 10,
      sy_vmag: 9,
      sy_kmag: 7,
      pl_trandep: 0.01,
      pl_trandur: 2.5,
      pl_ratror: 0.1,
      pl_imppar: 0.3,
    };

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult({
        prediction: data.prediction,
        habitability_score: data.habitability_score,
      });
    } catch {
      setError("Unable to connect. Make sure the backend is running: python backend/app.py");
    } finally {
      setLoading(false);
    }
  };

  const isHabitable =
    result?.prediction?.toLowerCase().includes("habitable") &&
    !result?.prediction?.toLowerCase().includes("not");
  const score = result ? Math.round(result.habitability_score * 100) : 0;

  return (
    <div className="min-h-screen relative">
      <Starfield />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2 gradient-text">
            Habitability Prediction
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Enter planetary parameters to predict habitability using our AI model.
          </p>

          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {inputFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {field.label}
                    <span className="text-muted-foreground text-xs ml-1">({field.unit})</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 font-mono-data text-sm transition-all"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3.5 font-display tracking-wider text-base disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Predict Habitability"
              )}
            </button>
          </form>

          {loading && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Processing planetary data...</p>
            </div>
          )}

          {error && (
            <div className="glass-panel border-destructive/50 p-6 text-center">
              <p className="text-destructive font-medium mb-1">Connection Error</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div
              className={`glass-panel p-8 text-center border ${
                isHabitable ? "border-green-500/40" : "border-red-500/40"
              }`}
              style={{
                boxShadow: isHabitable
                  ? "0 0 40px hsl(150 80% 45% / 0.15)"
                  : "0 0 40px hsl(0 72% 51% / 0.15)",
              }}
            >
              <div
                className={`inline-block px-6 py-2 rounded-full text-sm font-display font-bold tracking-wider mb-4 ${
                  isHabitable
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {isHabitable ? "✦ HABITABLE" : "✦ NOT HABITABLE"}
              </div>

              <h3 className="font-display text-2xl font-bold mb-6 text-foreground">
                {isHabitable
                  ? "This planet may support life!"
                  : "This planet is unlikely to support life."}
              </h3>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={isHabitable ? "hsl(150, 80%, 45%)" : "hsl(0, 72%, 51%)"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${score * 3.27} 327`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono-data text-2xl font-bold text-foreground">{score}%</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Confidence Score</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Predict;
