export interface Guest {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inviteCode: string;
  rsvpStatus: RSVPStatus;
  rsvpDate?: Date;
  attendingCeremony: boolean;
  attendingReception: boolean;
  plusOnes: PlusOne[];
  dietaryRestrictions?: string;
  specialRequests?: string;
  invitedAt: Date;
  remindersSent: number;
  groupId?: string; // For family groups
  // Per-guest plus-ones controls
  allowPlusOnes?: boolean;
  maxPlusOnes?: number;
  isDeleted?: boolean; // Soft delete flag
  deletedAt?: Date; // When the guest was deleted
  createdAt: Date;
  updatedAt: Date;
}

export interface PlusOne {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dietaryRestrictions?: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
}

export interface GuestGroup {
  id: string;
  weddingId: string;
  name: string; // e.g., "Smith Family", "College Friends"
  guestIds: string[];
  maxGuests: number;
  allowPlusOnes: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RSVPStatus = {
  PENDING: 'pending',
  ATTENDING: 'attending',
  NOT_ATTENDING: 'not_attending',
  MAYBE: 'maybe',
} as const;

export type RSVPStatus = typeof RSVPStatus[keyof typeof RSVPStatus];

export interface RSVP {
  id: string;
  weddingId: string;
  guestId: string;
  rsvpStatus: RSVPStatus;
  attendingCeremony: boolean;
  attendingReception: boolean;
  plusOnes: PlusOne[];
  dietaryRestrictions?: string;
  specialRequests?: string;
  message?: string;
  submittedAt: Date;
  updatedAt: Date;
}

export interface GuestImport {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  group?: string;
  allowPlusOnes?: boolean;
}
