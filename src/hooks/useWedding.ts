import { useState, useEffect, useCallback } from 'react';
import { WeddingService } from '../services/weddingService';
import { useAuth } from './useAuth';
import type { Wedding } from '../types';

interface UseWeddingResult {
  wedding: Wedding | null;
  loading: boolean;
  error: string | null;
  createWedding: (weddingData: Partial<Wedding>) => Promise<string | null>;
  updateWedding: (updates: Partial<Wedding>) => Promise<boolean>;
  deleteWedding: () => Promise<boolean>;
  refreshWedding: () => Promise<void>;
  uploadWeddingImage: (file: File, imagePath: string) => Promise<string | null>;
}

export function useWedding(weddingId?: string) {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Fetch wedding data
  const fetchWedding = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let weddingData: Wedding | null = null;

      if (weddingId) {
        // Fetch specific wedding by ID
        weddingData = await WeddingService.getWedding(weddingId);
      } else if (currentUser.role === 'couple') {
        // Fetch wedding by couple ID
        weddingData = await WeddingService.getWeddingByCouple(currentUser.uid);
      }

      setWedding(weddingData);
    } catch (err) {
      console.error('Error fetching wedding:', err);
      setError('Failed to load wedding data');
    } finally {
      setLoading(false);
    }
  }, [currentUser, weddingId]);

  // Create wedding function
  const createWedding = useCallback(async (weddingData: Partial<Wedding>): Promise<string | null> => {
    if (!currentUser || currentUser.role !== 'couple') {
      throw new Error('Only couples can create weddings');
    }

    try {
      setLoading(true);
      setError(null);

      const weddingId = await WeddingService.createWedding(currentUser.uid, weddingData);
      
      // Fetch the newly created wedding
      if (weddingId) {
        const newWedding = await WeddingService.getWedding(weddingId);
        setWedding(newWedding);
      }

      return weddingId;
    } catch (err) {
      console.error('Error creating wedding:', err);
      setError('Failed to create wedding');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update wedding
  const updateWedding = async (updates: Partial<Wedding>): Promise<boolean> => {
    if (!wedding || !currentUser) {
      setError('No wedding to update');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await WeddingService.updateWedding(wedding.id, updates);
      
      // Update local state
      setWedding(prev => prev ? { ...prev, ...updates } : null);
      
      return true;
    } catch (err) {
      console.error('Error updating wedding:', err);
      setError('Failed to update wedding');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete wedding
  const deleteWedding = async (): Promise<boolean> => {
    if (!wedding || !currentUser) {
      setError('No wedding to delete');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await WeddingService.deleteWedding(wedding.id);
      setWedding(null);
      
      return true;
    } catch (err) {
      console.error('Error deleting wedding:', err);
      setError('Failed to delete wedding');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload wedding image
  const uploadWeddingImage = async (file: File, imagePath: string): Promise<string | null> => {
    if (!wedding) {
      setError('No wedding selected');
      return null;
    }

    try {
      setError(null);
      const imageUrl = await WeddingService.uploadWeddingImage(wedding.id, file, imagePath);
      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      return null;
    }
  };

  // Refresh wedding data
  const refreshWedding = async (): Promise<void> => {
    await fetchWedding();
  };

    // Effect to fetch wedding on mount or when dependencies change
  useEffect(() => {
    fetchWedding();
  }, [fetchWedding]);

  return {
    wedding,
    loading,
    error,
    createWedding,
    updateWedding,
    deleteWedding,
    refreshWedding,
    uploadWeddingImage,
  };
};
