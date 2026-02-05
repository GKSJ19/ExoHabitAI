export interface PlanetFormData {
  planet_name: string;
  pl_orbper: number;
  pl_orbsmax: number;
  pl_bmasse: number;
  st_met: number;
  st_logg: number;
  disc_year: number;
  st_type: 'F' | 'G' | 'K' | 'M' | 'Other';
  pl_type: 'jupiter' | 'neptune' | 'rocky' | 'super_earth';
}

export interface HabitabilityPrediction {
  is_habitable: boolean;
  probability: number;
  score: number;
  category: string;
  description: string;
}

export interface Confidence {
  level: string;
  explanation: string;
}

export interface Recommendation {
  observe: boolean;
  priority_rank: string;
}

export interface PredictionResponse {
  status: string;
  planet_name: string;
  habitability_prediction: HabitabilityPrediction;
  confidence: Confidence;
  recommendation: Recommendation;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
}