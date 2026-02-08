// src/hooks/useHealth.ts
'use client';

import { useState, useEffect } from 'react';
import { apiClient, HealthResponse } from '@/lib/api';

export function useHealth(interval: number = 30000) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      setIsLoading(true);
      try {
        const result = await apiClient.getHealth();
        setHealth(result);
      } catch (err) {
        console.error('Health check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
    const intervalId = setInterval(fetchHealth, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return { health, isLoading };
}