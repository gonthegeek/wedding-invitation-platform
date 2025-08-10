import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Heart, MapPin, Clock, Check, X } from 'lucide-react';
import { WeddingService } from '../services/weddingService';
import { GuestService } from '../services/guestService';
import { EnhancedRSVPForm, type EnhancedRSVPFormData } from '../components/rsvp/EnhancedRSVPForm';
import type { Wedding, Guest } from '../types';

// Main container matching invitation style
const RSVPContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Georgia', serif;
`;

// Hero section matching invitation
const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.9), rgba(102, 126, 234, 0.9)),
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/><circle cx="20" cy="80" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="2" fill="white" opacity="0.1"/></svg>');
  background-size: 100px 100px;
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.03) 1px,
      rgba(255, 255, 255, 0.03) 2px
    );
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
  }
`;

const HeartIcon = styled(Heart)`
  margin: 0 auto 2rem;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
`;

const CoupleNames = styled.h1`
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0 0 1rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const RSVPTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
  position: relative;
  z-index: 1;
  opacity: 0.95;
`;

const WeddingDate = styled.div`
  font-size: 1.25rem;
  font-weight: 400;
  opacity: 0.9;
  position: relative;
  z-index: 1;
  margin-top: 1rem;
`;

// Content section
const ContentSection = styled.section`
  background: white;
  margin: -2rem 1rem 0;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  min-height: 60vh;
  
  @media (max-width: 768px) {
    margin: -2rem 0 0;
    border-radius: 20px 20px 0 0;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 3rem;
  font-style: italic;
  line-height: 1.6;
`;

// Event details matching invitation style
const EventDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EventCard = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #f1f5ff 100%);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
`;

const EventIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.95rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// RSVP Form section
const RSVPFormSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin: 2rem 0;
  color: white;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
`;

const FormTitle = styled.h3`
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Success and error states
const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #059669;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 15px;
  margin: 2rem 0;
  border: 1px solid #a7f3d0;
`;

const SuccessIcon = styled(Check)`
  margin: 0 auto 1rem;
  display: block;
  color: #059669;
  background: white;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 5px 15px rgba(5, 150, 105, 0.3);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 15px;
  margin: 2rem 0;
  border: 1px solid #fecaca;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(102, 126, 234, 0.2);
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Footer matching invitation
const Footer = styled.footer`
  background: #1f2937;
  color: white;
  text-align: center;
  padding: 3rem 2rem;
`;

const formatWeddingDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const RSVPPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitationData = async () => {
      if (!inviteCode) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Find guest by invite code
        const guestData = await GuestService.getGuestByInviteCode(inviteCode);
        if (!guestData) {
          setError('Guest not found. Please check your invitation link.');
          setLoading(false);
          return;
        }

        // Check if guest has been deleted
        const guestWithDeleteFlag = guestData as Guest & { isDeleted?: boolean };
        if (guestWithDeleteFlag.isDeleted === true) {
          setError('This invitation is no longer valid. Please contact the couple for assistance.');
          setLoading(false);
          return;
        }

        // Get wedding details
        const weddingData = await WeddingService.getWedding(guestData.weddingId);
        if (!weddingData) {
          setError('Wedding not found.');
          setLoading(false);
          return;
        }

        setGuest(guestData);
        setWedding(weddingData);
      } catch (err) {
        console.error('Error fetching invitation data:', err);
        setError('Failed to load invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationData();
  }, [inviteCode]);

  const onSubmit = async (data: EnhancedRSVPFormData) => {
    if (!guest || !wedding) return;
    
    // Basic validation
    if (!data.rsvpStatus) {
      setError('Please select your attendance status');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await GuestService.submitRSVP({
        weddingId: wedding.id,
        guestId: guest.id,
        rsvpStatus: data.rsvpStatus as 'pending' | 'attending' | 'not_attending' | 'maybe',
        attendingCeremony: data.attendingCeremony,
        attendingReception: data.attendingReception,
        plusOnes: (data.plusOnes || []).map((plusOne, index) => ({
          id: `${guest.id}-plus-${index}`,
          firstName: plusOne.firstName,
          lastName: plusOne.lastName,
          dietaryRestrictions: plusOne.dietaryRestrictions,
          attendingCeremony: data.attendingCeremony,
          attendingReception: data.attendingReception,
        })),
        dietaryRestrictions: data.dietaryRestrictions,
        specialRequests: data.specialRequests,
        message: data.message,
        // Enhanced Phase 3A fields
        songRequests: data.songRequests,
        needsTransportation: data.needsTransportation,
        transportationDetails: data.transportationDetails,
        needsAccommodation: data.needsAccommodation,
        accommodationDetails: data.accommodationDetails,
        contactPreference: data.contactPreference,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date | { toDate: () => Date } | string | unknown) => {
    // Handle Firestore Timestamp objects
    let jsDate: Date;
    
    if (!date) {
      jsDate = new Date();
    } else if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'object' && date !== null && 'toDate' in date) {
      // Firestore Timestamp object
      const timestamp = date as { toDate: () => Date };
      jsDate = timestamp.toDate();
    } else if (typeof date === 'string') {
      jsDate = new Date(date);
    } else {
      jsDate = new Date();
    }
    
    return jsDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <RSVPContainer>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </RSVPContainer>
    );
  }

  if (error) {
    return (
      <RSVPContainer>
        <ContentSection>
          <Container>
            <ErrorMessage>
              <X size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Oops!</h2>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>{error}</p>
            </ErrorMessage>
          </Container>
        </ContentSection>
      </RSVPContainer>
    );
  }

  if (!wedding || !guest) {
    return (
      <RSVPContainer>
        <ContentSection>
          <Container>
            <ErrorMessage>
              <h2>Wedding or guest information not found</h2>
              <p>This invitation link is not valid.</p>
            </ErrorMessage>
          </Container>
        </ContentSection>
      </RSVPContainer>
    );
  }

  if (submitted) {
    return (
      <RSVPContainer>
        <HeroSection>
          <HeartIcon size={48} />
          <CoupleNames>
            {wedding.brideFirstName} & {wedding.groomFirstName}
          </CoupleNames>
          <RSVPTitle>Thank You!</RSVPTitle>
          <WeddingDate>{formatWeddingDate(wedding.weddingDate)}</WeddingDate>
        </HeroSection>
        
        <ContentSection>
          <Container>
            <SuccessMessage>
              <SuccessIcon size={64} />
              <h2 style={{ margin: '0 0 1rem', fontSize: '2rem', fontWeight: '300' }}>
                RSVP Submitted Successfully!
              </h2>
              <p style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>
                Thank you for confirming your attendance, {guest.firstName}!
              </p>
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>
                We're excited to celebrate with you on our special day.
              </p>
            </SuccessMessage>
          </Container>
        </ContentSection>

        <Footer>
          <div style={{ marginBottom: '1rem' }}>
            <HeartIcon size={32} />
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {wedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!"}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            {wedding.settings?.footerSignature || "With love:"}
          </div>
          <div style={{ fontSize: '1.5rem', color: '#ff6b9d', marginTop: '0.5rem' }}>
            {wedding.brideFirstName} & {wedding.groomFirstName}
          </div>
        </Footer>
      </RSVPContainer>
    );
  }

  return (
    <RSVPContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeartIcon size={48} />
        <CoupleNames>
          {wedding.brideFirstName} & {wedding.groomFirstName}
        </CoupleNames>
        <RSVPTitle>Please Respond</RSVPTitle>
        <WeddingDate>{formatDate(wedding.weddingDate)}</WeddingDate>
      </HeroSection>

      {/* Content */}
      <ContentSection>
        <Container>
          <WelcomeMessage>
            Dear {guest.firstName} {guest.lastName},<br />
            {wedding.settings?.rsvpMessage || "We hope you can join us for our special day. Please let us know if you'll be attending."}
          </WelcomeMessage>

          {/* Event Details */}
          <EventDetailsGrid>
            <EventCard>
              <EventIcon>⛪</EventIcon>
              <EventTitle>Ceremony</EventTitle>
              <EventDetail>
                <Clock size={16} />
                {formatTime(wedding.ceremonyTime)}
              </EventDetail>
              <EventDetail>
                <MapPin size={16} />
                {wedding.ceremonyLocation.name}
              </EventDetail>
              <EventDetail>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                  {wedding.ceremonyLocation.address}, {wedding.ceremonyLocation.city}
                </span>
              </EventDetail>
            </EventCard>

            <EventCard>
              <EventIcon>🎉</EventIcon>
              <EventTitle>Reception</EventTitle>
              <EventDetail>
                <Clock size={16} />
                {formatTime(wedding.receptionTime)}
              </EventDetail>
              <EventDetail>
                <MapPin size={16} />
                {wedding.receptionLocation.name}
              </EventDetail>
              <EventDetail>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                  {wedding.receptionLocation.address}, {wedding.receptionLocation.city}
                </span>
              </EventDetail>
            </EventCard>
          </EventDetailsGrid>

          {/* RSVP Form */}
          <RSVPFormSection>
            <FormTitle>Your Response</FormTitle>
            <EnhancedRSVPForm
              onSubmit={onSubmit}
              isSubmitting={submitting}
              defaultValues={{
                rsvpStatus: guest.rsvpStatus === 'pending' ? '' : guest.rsvpStatus,
                attendingCeremony: guest.attendingCeremony,
                attendingReception: guest.attendingReception,
                plusOnes: guest.plusOnes || [],
                dietaryRestrictions: guest.dietaryRestrictions || '',
                specialRequests: guest.specialRequests || '',
                message: guest.message || '',
                songRequests: guest.songRequests || '',
                needsTransportation: guest.needsTransportation || false,
                transportationDetails: guest.transportationDetails || '',
                needsAccommodation: guest.needsAccommodation || false,
                accommodationDetails: guest.accommodationDetails || '',
                contactPreference: guest.contactPreference || 'email',
                emergencyContactName: guest.emergencyContactName || '',
                emergencyContactPhone: guest.emergencyContactPhone || '',
              }}
              {
                ...(() => {
                  const rawMax = (guest as Guest & { maxPlusOnes?: number }).maxPlusOnes ?? 0;
                  const hasExplicitMax = typeof rawMax === 'number' && rawMax > 0;
                  const allowedFlag = (guest as Guest & { allowPlusOnes?: boolean }).allowPlusOnes === true;
                  const allow = allowedFlag || hasExplicitMax;
                  const max = allow ? (hasExplicitMax ? rawMax : 1) : 0;
                  return { allowPlusOnes: allow, maxPlusOnes: max };
                })()
              }
              showAttendanceEvents={wedding.settings?.rsvpFormVisibility?.attendanceEvents ?? true}
              showPlusOnes={wedding.settings?.rsvpFormVisibility?.plusOnes ?? true}
              showDietaryRestrictions={wedding.settings?.rsvpFormVisibility?.dietaryRestrictions ?? true}
              showSongRequests={wedding.settings?.rsvpFormVisibility?.songRequests ?? true}
              showTransportation={wedding.settings?.rsvpFormVisibility?.transportation ?? true}
              showAccommodation={wedding.settings?.rsvpFormVisibility?.accommodation ?? true}
              showContactPreference={wedding.settings?.rsvpFormVisibility?.contactPreference ?? true}
              showEmergencyContact={wedding.settings?.rsvpFormVisibility?.emergencyContact ?? true}
              showSpecialRequests={wedding.settings?.rsvpFormVisibility?.specialRequests ?? true}
              showMessage={wedding.settings?.rsvpFormVisibility?.message ?? true}
            />
          </RSVPFormSection>
        </Container>
      </ContentSection>

      {/* Footer */}
      <Footer>
        <div style={{ marginBottom: '1rem' }}>
          <HeartIcon size={32} />
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {wedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!"}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
          {wedding.settings?.footerSignature || "With love:"}
        </div>
        <div style={{ fontSize: '1.5rem', color: '#ff6b9d', marginTop: '0.5rem' }}>
          {wedding.brideFirstName} & {wedding.groomFirstName}
        </div>
      </Footer>
    </RSVPContainer>
  );
};
