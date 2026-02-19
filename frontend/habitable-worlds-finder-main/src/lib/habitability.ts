import { PlanetaryParams } from "@/components/PlanetaryForm";
import { StellarParams } from "@/components/StellarForm";
import { PredictionResult } from "@/components/ResultsDisplay";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function lerp(
  val: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 100
) {
  const t = (val - inMin) / (inMax - inMin);
  return clamp(outMin + t * (outMax - outMin), outMin, outMax);
}

/**
 * Local scoring model — used for fallback & live scoring
 */
export function computeHabitabilityScore(
  planet: PlanetaryParams,
  stellar: StellarParams
): PredictionResult {
  let tempScore: number;
  const t = planet.equilibriumTemp;

  if (t < 150) tempScore = lerp(t, 50, 150, 0, 30);
  else if (t <= 270) tempScore = lerp(t, 150, 270, 30, 95);
  else if (t <= 320) tempScore = 95;
  else if (t <= 450) tempScore = lerp(t, 320, 450, 95, 30);
  else tempScore = lerp(t, 450, 800, 30, 0);

  let radiusScore: number;
  const r = planet.planetRadius;

  if (r < 0.5) radiusScore = lerp(r, 0.1, 0.5, 0, 40);
  else if (r <= 1.5) radiusScore = lerp(r, 0.5, 1.5, 55, 100);
  else if (r <= 2.5) radiusScore = lerp(r, 1.5, 2.5, 100, 55);
  else radiusScore = lerp(r, 2.5, 10, 55, 5);

  let massScore: number;
  const m = planet.planetMass;

  if (m < 0.3) massScore = lerp(m, 0.1, 0.3, 10, 50);
  else if (m <= 2) massScore = lerp(m, 0.3, 2, 70, 100);
  else if (m <= 5) massScore = lerp(m, 2, 5, 100, 65);
  else massScore = lerp(m, 5, 20, 65, 5);

  const hz = Math.sqrt(stellar.starLuminosity);
  const hzInner = hz * 0.75;
  const hzOuter = hz * 1.8;
  const a = planet.semiMajorAxis;

  let axisScore: number;

  if (a < hzInner) axisScore = lerp(a, 0.01, hzInner, 0, 55);
  else if (a <= hz) axisScore = lerp(a, hzInner, hz, 55, 100);
  else if (a <= hzOuter) axisScore = lerp(a, hz, hzOuter, 100, 55);
  else axisScore = lerp(a, hzOuter, 5, 55, 0);

  const starTypeScore: Record<string, number> = {
    G: 90,
    K: 80,
    M: 60,
    F: 65,
  };

  const starScore = starTypeScore[stellar.starType] ?? 50;

  const weights = { temp: 0.35, radius: 0.2, mass: 0.15, axis: 0.2, star: 0.1 };

  const score =
    tempScore * weights.temp +
    radiusScore * weights.radius +
    massScore * weights.mass +
    axisScore * weights.axis +
    starScore * weights.star;

  const finalScore = clamp(score, 0, 100);

  let status: string;

  if (finalScore >= 75) status = "Highly Habitable";
  else if (finalScore >= 50) status = "Potentially Habitable";
  else if (finalScore >= 25) status = "Marginally Habitable";
  else status = "Uninhabitable";

  return {
    score: finalScore,
    status,
    recommendation: "Local heuristic model used.",
    factors: [],
  };
}

/**
 * Real ML backend call
 */
export async function predictFromAPI(
  planet: PlanetaryParams,
  stellar: StellarParams
): Promise<PredictionResult> {
  const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://exohabitai-ux25.onrender.com";

  const payload = {
    Radius: planet.planetRadius,
    Mass: planet.planetMass,
    Period: planet.orbitalPeriod,
    SemiMajorAxis: planet.semiMajorAxis,
    EqTemp: planet.equilibriumTemp,

    Density: planet.planetMass / Math.pow(planet.planetRadius, 3),

    Insolation:
      stellar.starLuminosity /
      Math.pow(planet.semiMajorAxis, 2),

    StarTemp: stellar.starTemp,
    StarLum: stellar.starLuminosity,
    StarMet: 0.0,
    Star_Type: stellar.starType,
  };

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error("API failed");

    const data = await response.json();

    return {
      score: Math.round(data.confidence_score * 100),
      status: data.habitability_label,
      recommendation:
        data.habitability_label === "Potentially Habitable"
          ? "ML model predicts this planet may support life."
          : "ML model predicts this planet is unlikely to support life.",
      factors: [],
    };
  } catch (error) {
    console.warn("Backend unreachable. Using local model.");
    return computeHabitabilityScore(planet, stellar);
  }
}
