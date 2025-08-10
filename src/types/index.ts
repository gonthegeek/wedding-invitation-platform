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
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  backgroundImage?: string;
  musicPlaylist?: string[];
  photoGallery?: string[];
  customMessage?: string;
  welcomeMessage?: string;
  allowPlusOnes?: boolean;
  allowChildrenAttendance?: boolean;
  requireRSVPDeadline?: Date;
  sendEmailNotifications?: boolean;
  allowGiftRegistry?: boolean;
  isPublic?: boolean;
  requireApproval?: boolean;
  templateStyle?: 'classic' | 'modern' | 'rustic' | 'elegant';
  // Language preference
  language?: 'en' | 'es';
  // Couple photos
  bridePhoto?: string;
  groomPhoto?: string;
  couplePhoto?: string;
  // Customizable content for invitation
  loveQuote?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  dressCode?: string;
  dressCodeDescription?: string;
  specialInstructions?: string;
  rsvpMessage?: string;
  rsvpTitle?: string;
  rsvpButtonText?: string;
  childrenNote?: string;
  childrenNoteDetails?: string;
  giftMessage?: string;
  footerMessage?: string;
  footerSignature?: string;
  // Padrinos (Godparents)
  padrinos?: Padrino[];
  // Gift options
  giftOptions?: GiftOption[];
  // Hotel information
  hotelInfo?: HotelInfo;
  // Section visibility controls
  sectionVisibility?: SectionVisibility;
  // Background customization
  backgroundType?: 'gradient' | 'image';
  backgroundImageUrl?: string;
  backgroundPosition?: 'center' | 'top' | 'bottom';
  backgroundSize?: 'cover' | 'contain' | 'auto';
}

export interface SectionVisibility {
  parents?: boolean;
  weddingParty?: boolean;
  couplePhoto?: boolean;
  countdown?: boolean;
  eventDetails?: boolean;
  dressCode?: boolean;
  rsvp?: boolean;
  giftOptions?: boolean;
  photoGallery?: boolean;
  hotelInfo?: boolean;
  loveQuote?: boolean;
  specialInstructions?: boolean;
}

export interface Padrino {
  id: string;
  type: 'velacion' | 'anillos' | 'arras' | 'lazo' | 'biblia' | 'cojines' | 'ramo';
  name: string;
  lastName?: string;
  icon?: string;
}

export interface GiftOption {
  id: string;
  type: 'bank' | 'store' | 'cash' | 'other';
  title: string;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  accountHolder?: string;
  storeUrl?: string;
  storeName?: string;
  icon?: string;
}

export interface HotelInfo {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  bookingUrl?: string;
  description?: string;
  photos?: string[];
  specialRate?: string;
  bookingCode?: string;
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
  
  // Per-guest plus-one controls
  allowPlusOnes?: boolean;
  maxPlusOnes?: number;
  
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
  isPadrino?: boolean;
  padrinoId?: string;
  side?: 'bride' | 'groom' | 'couple';
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  | 'padrinos_ramo'
  | 'other';

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
  
  // Per-guest plus-one controls
  allowPlusOnes?: boolean;
  maxPlusOnes?: number;
  
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
