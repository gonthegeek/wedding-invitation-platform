import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Guest, GuestGroup, RSVP, GuestImport } from '../types';
import { generateInviteCode } from '../utils';

export class GuestService {
  private static GUESTS_COLLECTION = 'guests';
  private static GROUPS_COLLECTION = 'guestGroups';
  private static RSVPS_COLLECTION = 'rsvps';

  // Guest Management
  static async createGuest(weddingId: string, guestData: Omit<Guest, 'id' | 'inviteCode' | 'createdAt' | 'updatedAt' | 'invitedAt' | 'remindersSent'>): Promise<string> {
    try {
      const inviteCode = generateInviteCode();
      
      const newGuest = {
        ...guestData,
        weddingId,
        inviteCode,
        rsvpStatus: 'pending',
        attendingCeremony: false,
        attendingReception: false,
        plusOnes: [],
        invitedAt: serverTimestamp(),
        remindersSent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.GUESTS_COLLECTION), newGuest);
      console.log('Guest created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw new Error('Failed to create guest');
    }
  }

  static async createMultipleGuests(weddingId: string, guestsData: GuestImport[]): Promise<string[]> {
    try {
      const createdGuestIds: string[] = [];
      
      // Create guests in batches to avoid overwhelming Firestore
      for (const guestData of guestsData) {
        const guestId = await this.createGuest(weddingId, {
          weddingId,
          firstName: guestData.firstName,
          lastName: guestData.lastName,
          email: guestData.email,
          phone: guestData.phone,
          rsvpStatus: 'pending',
          attendingCeremony: false,
          attendingReception: false,
          plusOnes: [],
          groupId: guestData.group ? await this.findOrCreateGroup(weddingId, guestData.group, guestData.allowPlusOnes || false) : undefined,
        });
        createdGuestIds.push(guestId);
      }
      
      return createdGuestIds;
    } catch (error) {
      console.error('Error creating multiple guests:', error);
      throw new Error('Failed to create guests');
    }
  }

  static async updateGuest(guestId: string, updates: Partial<Guest>): Promise<void> {
    try {
      console.log('Original updates object:', updates);
      
      // Process updates to handle undefined values and empty strings properly
      const processedUpdates: Record<string, unknown> = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle empty strings for optional fields
          if (typeof value === 'string' && value.trim() === '' && 
              ['phone', 'dietaryRestrictions', 'specialRequests'].includes(key)) {
            // Don't include empty optional string fields - this effectively removes them
            console.log(`Skipping empty optional field: ${key}`);
            return;
          }
          processedUpdates[key] = value;
        } else {
          console.log(`Filtering out undefined value for key: ${key}`);
        }
      });

      console.log('Processed updates object:', processedUpdates);

      if (Object.keys(processedUpdates).length === 0) {
        console.log('No valid updates to apply');
        return;
      }

      const guestRef = doc(db, this.GUESTS_COLLECTION, guestId);
      await updateDoc(guestRef, {
        ...processedUpdates,
        updatedAt: serverTimestamp(),
      });
      console.log('Guest updated successfully');
    } catch (error) {
      console.error('Error updating guest:', error);
      console.error('Updates that caused error:', updates);
      throw new Error('Failed to update guest');
    }
  }

  static async deleteGuest(guestId: string): Promise<void> {
    try {
      // Instead of hard deleting, mark the guest as deleted (soft delete)
      // This preserves the invite link and allows for recovery
      const guestRef = doc(db, this.GUESTS_COLLECTION, guestId);
      await updateDoc(guestRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('Guest soft deleted successfully');
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw new Error('Failed to delete guest');
    }
  }

  static async restoreGuest(guestId: string): Promise<void> {
    try {
      // Restore a soft-deleted guest
      const guestRef = doc(db, this.GUESTS_COLLECTION, guestId);
      await updateDoc(guestRef, {
        isDeleted: false,
        deletedAt: null,
        updatedAt: serverTimestamp(),
      });
      console.log('Guest restored successfully');
    } catch (error) {
      console.error('Error restoring guest:', error);
      throw new Error('Failed to restore guest');
    }
  }

  static async getDeletedGuests(weddingId: string): Promise<Guest[]> {
    try {
      // Get only deleted guests for recovery purposes
      const q = query(
        collection(db, this.GUESTS_COLLECTION),
        where('weddingId', '==', weddingId)
      );
      
      const querySnapshot = await getDocs(q);
      const deletedGuests: Guest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Only include deleted guests
        if (data.isDeleted === true) {
          const safeToDate = (dateField: unknown): Date => {
            if (!dateField) return new Date();
            if (dateField instanceof Date) return dateField;
            
            if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
              const timestamp = dateField as { toDate: () => Date };
              if (typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
              }
            }
            
            if (typeof dateField === 'string') return new Date(dateField);
            return new Date();
          };
          
          deletedGuests.push({
            id: doc.id,
            ...data,
            invitedAt: safeToDate(data.invitedAt),
            rsvpDate: data.rsvpDate ? safeToDate(data.rsvpDate) : undefined,
            deletedAt: data.deletedAt ? safeToDate(data.deletedAt) : undefined,
            createdAt: safeToDate(data.createdAt),
            updatedAt: safeToDate(data.updatedAt),
          } as unknown as Guest);
        }
      });
      
      // Sort by deletion date (most recently deleted first)
      return deletedGuests.sort((a, b) => {
        const aDeleted = (a as unknown as Guest & { deletedAt?: Date }).deletedAt;
        const bDeleted = (b as unknown as Guest & { deletedAt?: Date }).deletedAt;
        if (!aDeleted || !bDeleted) return 0;
        return bDeleted.getTime() - aDeleted.getTime();
      });
    } catch (error) {
      console.error('Error fetching deleted guests:', error);
      throw new Error('Failed to fetch deleted guests');
    }
  }

  static async getGuest(guestId: string): Promise<Guest | null> {
    try {
      const guestDoc = await getDoc(doc(db, this.GUESTS_COLLECTION, guestId));
      
      if (guestDoc.exists()) {
        const data = guestDoc.data();
        
        // Helper function to safely convert dates
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        return {
          id: guestDoc.id,
          ...data,
          invitedAt: safeToDate(data.invitedAt),
          rsvpDate: data.rsvpDate ? safeToDate(data.rsvpDate) : undefined,
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
        } as Guest;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching guest:', error);
      throw new Error('Failed to fetch guest');
    }
  }

  static async getGuestByInviteCode(inviteCode: string): Promise<Guest | null> {
    try {
      const q = query(
        collection(db, this.GUESTS_COLLECTION),
        where('inviteCode', '==', inviteCode)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        return {
          id: doc.id,
          ...data,
          invitedAt: safeToDate(data.invitedAt),
          rsvpDate: data.rsvpDate ? safeToDate(data.rsvpDate) : undefined,
          deletedAt: data.deletedAt ? safeToDate(data.deletedAt) : undefined,
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
        } as unknown as Guest;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching guest by invite code:', error);
      throw new Error('Failed to fetch guest');
    }
  }

  static async getWeddingGuests(weddingId: string): Promise<Guest[]> {
    try {
      // Use simple query without composite index requirement
      const q = query(
        collection(db, this.GUESTS_COLLECTION),
        where('weddingId', '==', weddingId)
      );
      
      const querySnapshot = await getDocs(q);
      const guests: Guest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filter out deleted guests in JavaScript instead of Firestore query
        if (data.isDeleted === true) {
          return; // Skip deleted guests
        }
        
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        guests.push({
          id: doc.id,
          ...data,
          invitedAt: safeToDate(data.invitedAt),
          rsvpDate: data.rsvpDate ? safeToDate(data.rsvpDate) : undefined,
          deletedAt: data.deletedAt ? safeToDate(data.deletedAt) : undefined,
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
        } as unknown as Guest);
      });
      
      // Sort guests by lastName in JavaScript since we removed orderBy to avoid index requirement
      return guests.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
    } catch (error) {
      console.error('Error fetching wedding guests:', error);
      throw new Error('Failed to fetch guests');
    }
  }

  // Guest Group Management
  static async createGuestGroup(weddingId: string, groupData: Omit<GuestGroup, 'id' | 'guestIds' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newGroup = {
        ...groupData,
        weddingId,
        guestIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.GROUPS_COLLECTION), newGroup);
      console.log('Guest group created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating guest group:', error);
      throw new Error('Failed to create guest group');
    }
  }

  static async findOrCreateGroup(weddingId: string, groupName: string, allowPlusOnes: boolean): Promise<string> {
    try {
      // First try to find existing group
      const q = query(
        collection(db, this.GROUPS_COLLECTION),
        where('weddingId', '==', weddingId),
        where('name', '==', groupName)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      
      // Create new group if not found
      return await this.createGuestGroup(weddingId, {
        weddingId,
        name: groupName,
        maxGuests: 10, // Default max guests per group
        allowPlusOnes,
      });
    } catch (error) {
      console.error('Error finding or creating group:', error);
      throw new Error('Failed to manage guest group');
    }
  }

  static async getWeddingGroups(weddingId: string): Promise<GuestGroup[]> {
    try {
      const q = query(
        collection(db, this.GROUPS_COLLECTION),
        where('weddingId', '==', weddingId)
      );
      
      const querySnapshot = await getDocs(q);
      const groups: GuestGroup[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        groups.push({
          id: doc.id,
          ...data,
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
        } as GuestGroup);
      });
      
      // Sort groups by name in JavaScript since we removed orderBy to avoid index requirement
      return groups.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (error) {
      console.error('Error fetching wedding groups:', error);
      throw new Error('Failed to fetch guest groups');
    }
  }

  // RSVP Management
  static async submitRSVP(rsvpData: Omit<RSVP, 'id' | 'submittedAt' | 'updatedAt'>): Promise<string> {
    try {
      const newRSVP = {
        ...rsvpData,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.RSVPS_COLLECTION), newRSVP);
      
      // Update guest's RSVP status with all enhanced fields
      await this.updateGuest(rsvpData.guestId, {
        rsvpStatus: rsvpData.rsvpStatus,
        rsvpDate: new Date(),
        attendingCeremony: rsvpData.attendingCeremony,
        attendingReception: rsvpData.attendingReception,
        plusOnes: rsvpData.plusOnes,
        dietaryRestrictions: rsvpData.dietaryRestrictions,
        specialRequests: rsvpData.specialRequests,
        message: rsvpData.message,
        // Enhanced Phase 3A fields
        songRequests: rsvpData.songRequests,
        needsTransportation: rsvpData.needsTransportation,
        transportationDetails: rsvpData.transportationDetails,
        needsAccommodation: rsvpData.needsAccommodation,
        accommodationDetails: rsvpData.accommodationDetails,
        contactPreference: rsvpData.contactPreference,
        emergencyContactName: rsvpData.emergencyContactName,
        emergencyContactPhone: rsvpData.emergencyContactPhone,
      });
      
      console.log('RSVP submitted with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      throw new Error('Failed to submit RSVP');
    }
  }

  static async getRSVP(guestId: string): Promise<RSVP | null> {
    try {
      const q = query(
        collection(db, this.RSVPS_COLLECTION),
        where('guestId', '==', guestId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Get most recent RSVP
        const data = doc.data();
        
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        return {
          id: doc.id,
          ...data,
          submittedAt: safeToDate(data.submittedAt),
          updatedAt: safeToDate(data.updatedAt),
        } as RSVP;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching RSVP:', error);
      throw new Error('Failed to fetch RSVP');
    }
  }

  static async getWeddingRSVPs(weddingId: string): Promise<RSVP[]> {
    try {
      const q = query(
        collection(db, this.RSVPS_COLLECTION),
        where('weddingId', '==', weddingId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const rsvps: RSVP[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        rsvps.push({
          id: doc.id,
          ...data,
          submittedAt: safeToDate(data.submittedAt),
          updatedAt: safeToDate(data.updatedAt),
        } as RSVP);
      });
      
      return rsvps;
    } catch (error) {
      console.error('Error fetching wedding RSVPs:', error);
      throw new Error('Failed to fetch RSVPs');
    }
  }

  // Statistics
  static async getWeddingStats(weddingId: string) {
    try {
      const guests = await this.getWeddingGuests(weddingId);
      
      const totalGuests = guests.length;
      const totalInvited = guests.length;
      const respondedCount = guests.filter(g => g.rsvpStatus !== 'pending').length;
      const attendingCount = guests.filter(g => g.rsvpStatus === 'attending').length;
      const notAttendingCount = guests.filter(g => g.rsvpStatus === 'not_attending').length;
      const maybeCount = guests.filter(g => g.rsvpStatus === 'maybe').length;
      
      // Count plus ones
      const totalPlusOnes = guests.reduce((sum, guest) => sum + (guest.plusOnes?.length || 0), 0);
      
      return {
        totalGuests,
        totalInvited,
        respondedCount,
        attendingCount,
        notAttendingCount,
        maybeCount,
        totalPlusOnes,
        responseRate: totalInvited > 0 ? (respondedCount / totalInvited) * 100 : 0,
        attendanceRate: respondedCount > 0 ? (attendingCount / respondedCount) * 100 : 0,
      };
    } catch (error) {
      console.error('Error calculating wedding stats:', error);
      throw new Error('Failed to calculate statistics');
    }
  }
}
