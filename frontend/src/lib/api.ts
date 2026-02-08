// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  ranking_data_available: boolean;
  ranking_count: number;
}

export interface RankingCandidate {
  rank: number;
  planet_name: string;
  habitability_probability: number;
  habitability_score: number;
  predicted_habitable: boolean;
  actual_label?: number;
  discovery_year?: number;
}

export interface RankingResponse {
  status: string;
  parameters: {
    top: number;
    threshold: number;
  };
  statistics: {
    total_exoplanets: number;
    above_threshold: number;
    returned: number;
  };
  candidates: RankingCandidate[];
}

export interface ExampleInput {
  planet_name: string;
  pl_orbper: number;
  pl_orbsmax: number;
  pl_bmasse: number;
  st_met: number;
  st_logg: number;
  disc_year: number;
  st_type: string;
  pl_type: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }

  async getRanking(top: number = 20, threshold: number = 0.0): Promise<RankingResponse> {
    const response = await fetch(
      `${this.baseUrl}/rank?top=${top}&threshold=${threshold}`
    );
    if (!response.ok) throw new Error('Failed to fetch ranking');
    return response.json();
  }

  async getExamples(): Promise<{ examples: ExampleInput[] }> {
    const response = await fetch(`${this.baseUrl}/examples`);
    if (!response.ok) throw new Error('Failed to fetch examples');
    return response.json();
  }

  async predict(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Prediction failed');
    }
    
    return result;
  }
}

export const apiClient = new ApiClient();