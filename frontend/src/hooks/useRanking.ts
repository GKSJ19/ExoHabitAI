// src/hooks/useRanking.ts
'use client';

import { useState, useEffect } from 'react';
import { apiClient, RankingResponse } from '@/lib/api';

interface UseRankingOptions {
  top?: number;
  threshold?: number;
  enabled?: boolean;
}

export function useRanking(options: UseRankingOptions = {}) {
  const { top = 20, threshold = 0.0, enabled = true } = options;
  const [data, setData] = useState<RankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchRanking = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await apiClient.getRanking(top, threshold);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch ranking'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [top, threshold, enabled]);

  return { data, isLoading, error };
}