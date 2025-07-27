import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Guest, RSVPStatus } from '../types';

export interface RSVPAnalytics {
  totalGuests: number;
  totalPlusOnes: number;
  totalInvited: number;
  
  // Response counts
  respondedCount: number;
  pendingCount: number;
  attendingCeremony: number;
  attendingReception: number;
  notAttending: number;
  maybeCount: number;
  
  // Response rates
  responseRate: number;
  attendanceRate: number;
  
  // Timeline data
  responsesByDate: Array<{
    date: string;
    responses: number;
    cumulative: number;
  }>;
  
  // Dietary restrictions
  dietaryRestrictions: Array<{
    restriction: string;
    count: number;
  }>;
  
  // Plus ones breakdown
  plusOnesData: {
    requested: number;
    attending: number;
    details: Array<{
      guestName: string;
      plusOnesCount: number;
      attending: number;
    }>;
  };
  
  // Recent activity
  recentResponses: Array<{
    guestName: string;
    status: RSVPStatus;
    date: Date;
    attendingCeremony: boolean;
    attendingReception: boolean;
  }>;
}

export class RSVPAnalyticsService {
  private static GUESTS_COLLECTION = 'guests';

  static async getWeddingRSVPAnalytics(weddingId: string): Promise<RSVPAnalytics> {
    try {
      // Simplified query - filter deleted guests in memory instead of in query
      const q = query(
        collection(db, this.GUESTS_COLLECTION),
        where('weddingId', '==', weddingId)
      );
      
      const querySnapshot = await getDocs(q);
      const guests: Guest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filter out soft-deleted guests in memory to avoid compound query issues
        if (data.isDeleted === true) {
          return;
        }
        
        guests.push({
          id: doc.id,
          ...data,
          invitedAt: this.safeToDate(data.invitedAt),
          rsvpDate: data.rsvpDate ? this.safeToDate(data.rsvpDate) : undefined,
          createdAt: this.safeToDate(data.createdAt),
          updatedAt: this.safeToDate(data.updatedAt),
        } as Guest);
      });

      return this.calculateAnalytics(guests);
    } catch (error) {
      console.error('Error fetching RSVP analytics:', error);
      // Return empty analytics instead of throwing to prevent UI crashes
      return this.getEmptyAnalytics();
    }
  }

  private static safeToDate(dateField: unknown): Date {
    if (!dateField) return new Date();
    if (dateField instanceof Date) return dateField;
    
    if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
      const timestamp = dateField as Timestamp;
      return timestamp.toDate();
    }
    
    if (typeof dateField === 'string') return new Date(dateField);
    return new Date();
  }

  private static calculateAnalytics(guests: Guest[]): RSVPAnalytics {
    const totalGuests = guests.length;
    const totalInvited = guests.filter(g => g.remindersSent > 0).length;
    
    // Response counts
    const respondedGuests = guests.filter(g => g.rsvpStatus !== 'pending');
    const respondedCount = respondedGuests.length;
    const pendingCount = totalGuests - respondedCount;
    
    const attendingCeremony = guests.filter(g => g.attendingCeremony).length;
    const attendingReception = guests.filter(g => g.attendingReception).length;
    const notAttending = guests.filter(g => g.rsvpStatus === 'not_attending').length;
    const maybeCount = guests.filter(g => g.rsvpStatus === 'maybe').length;
    
    // Plus ones calculation
    const totalPlusOnes = guests.reduce((sum, guest) => sum + guest.plusOnes.length, 0);
    const attendingPlusOnes = guests.reduce((sum, guest) => {
      return sum + (guest.rsvpStatus === 'attending' ? guest.plusOnes.length : 0);
    }, 0);
    
    // Response rates
    const responseRate = totalInvited > 0 ? (respondedCount / totalInvited) * 100 : 0;
    const attendingTotal = Math.max(attendingCeremony, attendingReception);
    const attendanceRate = respondedCount > 0 ? (attendingTotal / respondedCount) * 100 : 0;
    
    // Timeline data (responses by date)
    const responsesByDate = this.calculateResponseTimeline(respondedGuests);
    
    // Dietary restrictions analysis
    const dietaryRestrictions = this.analyzeDietaryRestrictions(guests);
    
    // Plus ones data
    const plusOnesData = this.analyzePlusOnes(guests);
    
    // Recent responses (last 10)
    const recentResponses = respondedGuests
      .filter(g => g.rsvpDate)
      .sort((a, b) => (b.rsvpDate?.getTime() || 0) - (a.rsvpDate?.getTime() || 0))
      .slice(0, 10)
      .map(guest => ({
        guestName: `${guest.firstName} ${guest.lastName}`,
        status: guest.rsvpStatus,
        date: guest.rsvpDate!,
        attendingCeremony: guest.attendingCeremony,
        attendingReception: guest.attendingReception,
      }));

    return {
      totalGuests,
      totalPlusOnes,
      totalInvited,
      respondedCount,
      pendingCount,
      attendingCeremony,
      attendingReception,
      notAttending,
      maybeCount,
      responseRate: Math.round(responseRate * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      responsesByDate,
      dietaryRestrictions,
      plusOnesData: {
        requested: totalPlusOnes,
        attending: attendingPlusOnes,
        details: plusOnesData,
      },
      recentResponses,
    };
  }

  private static calculateResponseTimeline(respondedGuests: Guest[]) {
    const responseMap = new Map<string, number>();
    
    respondedGuests.forEach(guest => {
      if (guest.rsvpDate) {
        const dateKey = guest.rsvpDate.toISOString().split('T')[0];
        responseMap.set(dateKey, (responseMap.get(dateKey) || 0) + 1);
      }
    });
    
    const sortedDates = Array.from(responseMap.keys()).sort();
    let cumulative = 0;
    
    return sortedDates.map(date => {
      const responses = responseMap.get(date) || 0;
      cumulative += responses;
      return {
        date,
        responses,
        cumulative,
      };
    });
  }

  private static analyzeDietaryRestrictions(guests: Guest[]) {
    const restrictionMap = new Map<string, number>();
    
    guests.forEach(guest => {
      if (guest.dietaryRestrictions && guest.dietaryRestrictions.trim()) {
        const restrictions = guest.dietaryRestrictions
          .split(',')
          .map(r => r.trim().toLowerCase())
          .filter(r => r.length > 0);
        
        restrictions.forEach(restriction => {
          restrictionMap.set(restriction, (restrictionMap.get(restriction) || 0) + 1);
        });
      }
      
      // Include plus ones dietary restrictions
      guest.plusOnes.forEach(plusOne => {
        if (plusOne.dietaryRestrictions && plusOne.dietaryRestrictions.trim()) {
          const restrictions = plusOne.dietaryRestrictions
            .split(',')
            .map(r => r.trim().toLowerCase())
            .filter(r => r.length > 0);
          
          restrictions.forEach(restriction => {
            restrictionMap.set(restriction, (restrictionMap.get(restriction) || 0) + 1);
          });
        }
      });
    });
    
    return Array.from(restrictionMap.entries())
      .map(([restriction, count]) => ({ restriction, count }))
      .sort((a, b) => b.count - a.count);
  }

  private static analyzePlusOnes(guests: Guest[]) {
    return guests
      .filter(guest => guest.plusOnes.length > 0)
      .map(guest => ({
        guestName: `${guest.firstName} ${guest.lastName}`,
        plusOnesCount: guest.plusOnes.length,
        attending: guest.rsvpStatus === 'attending' ? guest.plusOnes.length : 0,
      }))
      .sort((a, b) => b.plusOnesCount - a.plusOnesCount);
  }

  // Get RSVP deadline information
  private static getEmptyAnalytics(): RSVPAnalytics {
    return {
      totalGuests: 0,
      totalPlusOnes: 0,
      totalInvited: 0,
      respondedCount: 0,
      pendingCount: 0,
      attendingCeremony: 0,
      attendingReception: 0,
      notAttending: 0,
      maybeCount: 0,
      responseRate: 0,
      attendanceRate: 0,
      responsesByDate: [],
      dietaryRestrictions: [],
      plusOnesData: {
        requested: 0,
        attending: 0,
        details: [],
      },
      recentResponses: [],
    };
  }

  static async getRSVPDeadlineInfo(): Promise<{
    deadline: Date | null;
    daysUntilDeadline: number;
    isOverdue: boolean;
  }> {
    // This would typically come from wedding configuration
    // For now, we'll assume 2 weeks before wedding date
    // In a real implementation, this would be stored in the wedding document
    
    try {
      // For now, return placeholder data with configurable deadline
      // In future: get actual wedding date and RSVP deadline from wedding document
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30); // 30 days from now as placeholder
      
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysUntilDeadline < 0;
      
      return {
        deadline,
        daysUntilDeadline,
        isOverdue,
      };
    } catch (error) {
      console.error('Error getting RSVP deadline info:', error);
      return {
        deadline: null,
        daysUntilDeadline: 0,
        isOverdue: false,
      };
    }
  }
}
