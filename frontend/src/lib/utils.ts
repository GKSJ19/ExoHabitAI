import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlanetFormData, PredictionResponse } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function predictHabitability(
  formData: PlanetFormData
): Promise<PredictionResponse> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Prediction failed');
  }

  return response.json();
}

export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(2)}%`;
}

export function getHabitabilityColor(probability: number): string {
  if (probability >= 0.7) return 'text-habitable-high';
  if (probability >= 0.4) return 'text-habitable-medium';
  return 'text-habitable-low';
}

export function getHabitabilityGradient(probability: number): string {
  if (probability >= 0.7) return 'from-emerald-500 to-green-600';
  if (probability >= 0.4) return 'from-amber-500 to-orange-600';
  return 'from-red-500 to-rose-600';
}