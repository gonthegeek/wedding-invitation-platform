import { useState, useEffect, useCallback } from 'react';
import { RSVPAnalyticsService, type RSVPAnalytics } from '../services/rsvpAnalyticsService';

interface UseRSVPAnalyticsResult {
  analytics: RSVPAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRSVPAnalytics = (weddingId: string | undefined): UseRSVPAnalyticsResult => {
  const [analytics, setAnalytics] = useState<RSVPAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!weddingId) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await RSVPAnalyticsService.getWeddingRSVPAnalytics(weddingId);
      setAnalytics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch RSVP analytics';
      setError(errorMessage);
      console.error('Error fetching RSVP analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = async () => {
    await fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refetch,
  };
};
