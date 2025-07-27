export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export type UserRole = 'admin' | 'couple' | 'guest';

export interface Wedding {
  id: string;
  coupleId: string;
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  weddingDate: Date;
  ceremonyTime: string;
  ceremonyLocation: WeddingLocation;
  receptionTime: string;
  receptionLocation: WeddingLocation;
  subdomain: string;
  template: WeddingTemplate;
  settings: WeddingSettings;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface WeddingLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  googleMapsUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WeddingTemplate {
  templateId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundImage?: string;
  heroImage?: string;
  galleryImages: string[];
  customCSS?: string;
}

export interface WeddingSettings {
  allowPlusOnes: boolean;
  allowChildrenAttendance: boolean;
  requireRSVPDeadline: Date;
  sendEmailNotifications: boolean;
  allowGiftRegistry: boolean;
  isPublic: boolean;
  requireApproval: boolean;
  welcomeMessage?: string;
}

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
  
  // Enhanced Phase 3A fields
  songRequests?: string;
  needsTransportation?: boolean;
  transportationDetails?: string;
  needsAccommodation?: boolean;
  accommodationDetails?: string;
  contactPreference?: 'email' | 'phone' | 'text';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  message?: string;
  
  invitedAt: Date;
  remindersSent: number;
}

export type RSVPStatus = 'pending' | 'attending' | 'not_attending' | 'maybe';

export interface PlusOne {
  firstName: string;
  lastName: string;
  dietaryRestrictions?: string;
}

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
  
  // Enhanced Phase 3A features
  songRequests?: string;
  needsTransportation?: boolean;
  transportationDetails?: string;
  needsAccommodation?: boolean;
  accommodationDetails?: string;
  contactPreference?: 'email' | 'phone' | 'text';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  submittedAt: Date;
  updatedAt: Date;
}

export interface WeddingParty {
  id: string;
  weddingId: string;
  role: WeddingPartyRole;
  firstName: string;
  lastName: string;
  relationship?: string;
  photo?: string;
  order: number;
}

export type WeddingPartyRole = 
  | 'maid_of_honor' 
  | 'best_man' 
  | 'bridesmaid' 
  | 'groomsman' 
  | 'flower_girl' 
  | 'ring_bearer'
  | 'officiant'
  | 'padrinos_velacion'
  | 'padrinos_anillos'
  | 'padrinos_arras'
  | 'padrinos_lazo'
  | 'padrinos_biblia'
  | 'padrinos_cojines'
  | 'padrinos_ramo';

export interface GiftRegistry {
  id: string;
  weddingId: string;
  type: GiftType;
  storeName?: string;
  storeUrl?: string;
  registryId?: string;
  preferredAmount?: number;
  description?: string;
  isActive: boolean;
}

export type GiftType = 'registry' | 'cash' | 'honeymoon' | 'charity';

export interface WeddingTimeline {
  id: string;
  weddingId: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  location?: string;
  icon?: string;
  order: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: EmailVariable[];
  isActive: boolean;
}

export interface EmailVariable {
  name: string;
  description: string;
  required: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export type NotificationType = 
  | 'rsvp_received' 
  | 'rsvp_reminder' 
  | 'wedding_update' 
  | 'system_notification';

// Guest Management Types
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
  groupId?: string;
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
  name: string;
  guestIds: string[];
  maxGuests: number;
  allowPlusOnes: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
