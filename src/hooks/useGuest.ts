import { useState, useCallback, useEffect } from 'react';
import { GuestService } from '../services/guestService';
import type { Guest, GuestGroup, RSVP, GuestImport } from '../types';

interface UseGuestResult {
  guests: Guest[];
  groups: GuestGroup[];
  loading: boolean;
  error: string | null;
  stats: {
    totalGuests: number;
    totalInvited: number;
    respondedCount: number;
    attendingCount: number;
    notAttendingCount: number;
    maybeCount: number;
    totalPlusOnes: number;
    responseRate: number;
    attendanceRate: number;
  } | null;
  
  // Guest operations
  createGuest: (guestData: Omit<Guest, 'id' | 'inviteCode' | 'createdAt' | 'updatedAt' | 'invitedAt' | 'remindersSent'>) => Promise<string | null>;
  updateGuest: (guestId: string, updates: Partial<Guest>) => Promise<boolean>;
  deleteGuest: (guestId: string) => Promise<boolean>;
  importGuests: (guestsData: GuestImport[]) => Promise<boolean>;
  
  // Group operations
  createGroup: (groupData: Omit<GuestGroup, 'id' | 'guestIds' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  
  // RSVP operations
  getGuestRSVP: (guestId: string) => Promise<RSVP | null>;
  
  // Utility functions
  refreshGuests: () => Promise<void>;
  getGuestByInviteCode: (inviteCode: string) => Promise<Guest | null>;
}

export function useGuest(weddingId?: string): UseGuestResult {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalGuests: number;
    totalInvited: number;
    respondedCount: number;
    attendingCount: number;
    notAttendingCount: number;
    maybeCount: number;
    totalPlusOnes: number;
    responseRate: number;
    attendanceRate: number;
  } | null>(null);

  // Fetch guests and groups
  const fetchGuests = useCallback(async () => {
    if (!weddingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [guestsData, groupsData, statsData] = await Promise.all([
        GuestService.getWeddingGuests(weddingId),
        GuestService.getWeddingGroups(weddingId),
        GuestService.getWeddingStats(weddingId),
      ]);

      setGuests(guestsData);
      setGroups(groupsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guest data');
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  // Create guest
  const createGuest = useCallback(async (guestData: Omit<Guest, 'id' | 'inviteCode' | 'createdAt' | 'updatedAt' | 'invitedAt' | 'remindersSent'>): Promise<string | null> => {
    if (!weddingId) {
      setError('No wedding ID provided');
      return null;
    }

    try {
      setError(null);
      const guestId = await GuestService.createGuest(weddingId, guestData);
      
      // Refresh guests list
      await fetchGuests();
      
      return guestId;
    } catch (err) {
      console.error('Error creating guest:', err);
      setError('Failed to create guest');
      return null;
    }
  }, [weddingId, fetchGuests]);

  // Update guest
  const updateGuest = useCallback(async (guestId: string, updates: Partial<Guest>): Promise<boolean> => {
    try {
      setError(null);
      await GuestService.updateGuest(guestId, updates);
      
      // Update local state
      setGuests(prev => prev.map(guest => 
        guest.id === guestId ? { ...guest, ...updates } : guest
      ));
      
      // Refresh stats
      if (weddingId) {
        const newStats = await GuestService.getWeddingStats(weddingId);
        setStats(newStats);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating guest:', err);
      setError('Failed to update guest');
      return false;
    }
  }, [weddingId]);

  // Delete guest
  const deleteGuest = useCallback(async (guestId: string): Promise<boolean> => {
    try {
      setError(null);
      await GuestService.deleteGuest(guestId);
      
      // Remove from local state
      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      
      // Refresh stats
      if (weddingId) {
        const newStats = await GuestService.getWeddingStats(weddingId);
        setStats(newStats);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError('Failed to delete guest');
      return false;
    }
  }, [weddingId]);

  // Import multiple guests
  const importGuests = useCallback(async (guestsData: GuestImport[]): Promise<boolean> => {
    if (!weddingId) {
      setError('No wedding ID provided');
      return false;
    }

    try {
      setError(null);
      setLoading(true);
      
      await GuestService.createMultipleGuests(weddingId, guestsData);
      
      // Refresh all data
      await fetchGuests();
      
      return true;
    } catch (err) {
      console.error('Error importing guests:', err);
      setError('Failed to import guests');
      return false;
    } finally {
      setLoading(false);
    }
  }, [weddingId, fetchGuests]);

  // Create group
  const createGroup = useCallback(async (groupData: Omit<GuestGroup, 'id' | 'guestIds' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!weddingId) {
      setError('No wedding ID provided');
      return null;
    }

    try {
      setError(null);
      const groupId = await GuestService.createGuestGroup(weddingId, groupData);
      
      // Refresh groups list
      const groupsData = await GuestService.getWeddingGroups(weddingId);
      setGroups(groupsData);
      
      return groupId;
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
      return null;
    }
  }, [weddingId]);

  // Get guest RSVP
  const getGuestRSVP = useCallback(async (guestId: string): Promise<RSVP | null> => {
    try {
      setError(null);
      return await GuestService.getRSVP(guestId);
    } catch (err) {
      console.error('Error fetching RSVP:', err);
      setError('Failed to fetch RSVP');
      return null;
    }
  }, []);

  // Get guest by invite code
  const getGuestByInviteCode = useCallback(async (inviteCode: string): Promise<Guest | null> => {
    try {
      setError(null);
      return await GuestService.getGuestByInviteCode(inviteCode);
    } catch (err) {
      console.error('Error fetching guest by invite code:', err);
      setError('Failed to fetch guest');
      return null;
    }
  }, []);

  // Refresh guests data
  const refreshGuests = useCallback(async (): Promise<void> => {
    await fetchGuests();
  }, [fetchGuests]);

  // Fetch data on mount and when weddingId changes
  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  return {
    guests,
    groups,
    loading,
    error,
    stats,
    createGuest,
    updateGuest,
    deleteGuest,
    importGuests,
    createGroup,
    getGuestRSVP,
    refreshGuests,
    getGuestByInviteCode,
  };
}
