import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { WeddingService } from '../services/weddingService';
import { GuestService } from '../services/guestService';
import styled, { keyframes } from 'styled-components';
import { MapPin, Heart, MessageCircle, Check, X } from 'lucide-react';
import { EnhancedRSVPForm, type EnhancedRSVPFormData } from '../components/rsvp/EnhancedRSVPForm';
import type { Wedding, Guest } from '../types';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const heartBeat = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// Main Container
const InvitationContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['primaryColor', 'secondaryColor'].includes(prop)
})<{ primaryColor?: string; secondaryColor?: string }>`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.primaryColor || '#667eea'} 0%, ${props => props.secondaryColor || '#764ba2'} 100%);
  font-family: 'Georgia', serif;
  position: relative;
  overflow-x: hidden;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>') repeat;
    animation: ${fadeIn} 2s ease-out;
  }
`;

const CoupleNames = styled.h1`
  font-size: 4rem;
  font-weight: 300;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const WeddingDate = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  color: white;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  animation: ${fadeIn} 1s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LoveQuote = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: white;
  max-width: 600px;
  margin: 0 auto 3rem auto;
  opacity: 0.9;
  line-height: 1.6;
  animation: ${fadeIn} 1s ease-out 0.6s both;
  
  &::before,
  &::after {
    content: '"';
    font-size: 2rem;
    font-weight: bold;
  }
`;

const HeartIcon = styled(Heart).withConfig({
  shouldForwardProp: (prop) => prop !== 'secondaryColor'
})<{ secondaryColor?: string }>`
  color: ${props => props.secondaryColor || '#ff6b9d'};
  margin: 0 1rem;
  animation: ${heartBeat} 2s infinite;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  opacity: 0.7;
  text-align: center;
  font-size: 0.9rem;
  animation: ${fadeIn} 1s ease-out 1s both;
`;

// Content Sections
const Section = styled.section`
  padding: 4rem 2rem;
  background: white;
  position: relative;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ParentsSection = styled(Section)`
  background: #f8f9fa;
`;

const ParentsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ParentsNames = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ParentGroup = styled.div`
  text-align: center;
`;

const ParentName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const CoupleSection = styled(Section)``;

const CoupleContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const PersonCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const PersonPhoto = styled.div.withConfig({
  shouldForwardProp: (prop) => !['primaryColor', 'secondaryColor', 'imageUrl'].includes(prop)
})<{ primaryColor?: string; secondaryColor?: string; imageUrl?: string }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover no-repeat` 
    : `linear-gradient(135deg, ${props.primaryColor || '#667eea'} 0%, ${props.secondaryColor || '#764ba2'} 100%)`
  };
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  border: 4px solid white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }
`;

const PersonName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 400;
`;

// Couple Photo Section
const CouplePhotoSection = styled(Section)`
  padding: 2rem 1rem;
  background: #f8f9fa;
`;

const CouplePhoto = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

// Event Details Section
const EventDetailsSection = styled(Section).withConfig({
  shouldForwardProp: (prop) => !['primaryColor', 'secondaryColor'].includes(prop)
})<{ primaryColor?: string; secondaryColor?: string }>`
  background: linear-gradient(135deg, ${props => props.primaryColor || '#667eea'} 0%, ${props => props.secondaryColor || '#764ba2'} 100%);
  color: white;
`;

const EventsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const EventIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
`;

const EventTime = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EventLocation = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

// Countdown Section
const CountdownSection = styled(Section)`
  background: #1f2937;
  color: white;
  text-align: center;
`;

const CountdownContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CountdownTimer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CountdownItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem 1rem;
`;

const CountdownNumber = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'secondaryColor'
})<{ secondaryColor?: string }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.secondaryColor || '#ff6b9d'};
`;

const CountdownLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

// RSVP Section
const RSVPSection = styled(Section)`
  background: #f8f9fa;
  text-align: center;
`;

// RSVP Form Section (replaces button when guest is authenticated)
const RSVPFormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const RSVPFormTitle = styled.h3`
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 2rem;
  color: #333;
`;

const GuestWelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  font-style: italic;
`;

const RSVPButton = styled.a<{ primaryColor?: string; secondaryColor?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, ${props => props.primaryColor || '#667eea'} 0%, ${props => props.secondaryColor || '#764ba2'} 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
`;

// Success/Error messages for RSVP submission
const RSVPSuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 15px;
  margin: 2rem 0;
  border: 1px solid #a7f3d0;
  color: #059669;
`;

const RSVPErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 15px;
  margin: 2rem 0;
  border: 1px solid #fecaca;
  color: #dc2626;
`;

// Demo banner
const DemoBanner = styled.div.withConfig({
  shouldForwardProp: (prop) => !['primaryColor', 'secondaryColor'].includes(prop)
})<{ primaryColor?: string; secondaryColor?: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, ${props => props.primaryColor || '#667eea'} 0%, ${props => props.secondaryColor || '#764ba2'} 100%);
  color: white;
`;

// Photo Gallery
const GallerySection = styled(Section)`
  background: #f8f9fa;
`;

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const GalleryCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  min-height: 200px;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

const GalleryCardFooter = styled.div`
  padding: 1rem;
  text-align: center;
  background: white;
`;

const GalleryImageCaption = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

// Padrinos Section
const PadrinosSection = styled(Section)`
  background: #f8f9fa;
`;

const PadrinosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
`;

const PadrinoCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const PadrinoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const PadrinoType = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const PadrinoName = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0.5rem 0;
  font-weight: 500;
`;

const PadrinoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PadrinoPerson = styled.div`
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.05);
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
    margin-bottom: 0.5rem;
  }
`;

// Gift Options Section
const GiftSection = styled(Section)`
  background: white;
`;

const GiftContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const GiftMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const GiftOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const GiftOptionCard = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }
`;

const GiftIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const GiftTitle = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const GiftDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const GiftDetails = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
`;

// Hotel Section
const HotelSection = styled(Section)`
  background: #f8f9fa;
`;

const HotelContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const HotelCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const HotelContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HotelInfo = styled.div``;

const HotelName = styled.h3`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const HotelAddress = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const HotelDescription = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const HotelBookingInfo = styled.div`
  background: #f0f4ff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const HotelPhotos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const HotelPhoto = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
`;

const BookingButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    color: white;
  }
`;

// Footer
const Footer = styled.footer`
  background: #1f2937;
  color: white;
  text-align: center;
  padding: 2rem;
`;

// Helper functions for Padrinos
const getDefaultIcon = (type: string): string => {
  const icons = {
    velacion: '🕯️',
    anillos: '💍',
    arras: '🪙',
    lazo: '🎀',
    biblia: '📖',
    cojines: '🛏️',
    ramo: '💐'
  };
  return icons[type as keyof typeof icons] || '🤝';
};

const getTypeDisplayName = (type: string): string => {
  const names = {
    velacion: 'Velación',
    anillos: 'Anillos',
    arras: 'Arras',
    lazo: 'Lazo',
    biblia: 'Biblia y Rosario',
    cojines: 'Cojines',
    ramo: 'Ramo'
  };
  return names[type as keyof typeof names] || type;
};

const getGiftIcon = (type: string): string => {
  const icons = {
    bank: '🏦',
    store: '🛒',
    cash: '💵',
    other: '🎁'
  };
  return icons[type as keyof typeof icons] || '🎁';
};

// Helper function to group padrinos by type
const groupPadrinosByType = (padrinos: { id: string; type: string; name: string; lastName?: string; icon?: string }[]) => {
  const grouped: Record<string, { id: string; type: string; name: string; lastName?: string; icon?: string }[]> = {};
  padrinos.forEach(padrino => {
    if (!grouped[padrino.type]) {
      grouped[padrino.type] = [];
    }
    grouped[padrino.type].push(padrino);
  });
  return grouped;
};

export const PublicWeddingInvitation: React.FC = () => {
  const { weddingId, inviteCode } = useParams<{ weddingId?: string; inviteCode?: string }>();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchWeddingAndGuest = async () => {
      try {
        setLoading(true);
        setError(null);

        let weddingData: Wedding | null = null;
        let guestData: Guest | null = null;

        // Check if this is an invitation link with invite code
        if (inviteCode) {
          // Find guest by invite code first
          guestData = await GuestService.getGuestByInviteCode(inviteCode);
          if (!guestData) {
            setError('Invalid invitation link. Please check the link and try again.');
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

          // Get wedding from guest's wedding ID
          weddingData = await WeddingService.getWedding(guestData.weddingId);
        } else if (weddingId) {
          // Direct wedding access (demo mode)
          weddingData = await WeddingService.getWedding(weddingId);
          setIsDemo(true);
        }

        if (!weddingData) {
          setError('Wedding not found.');
          setLoading(false);
          return;
        }

        setWedding(weddingData);
        setGuest(guestData);
      } catch (err) {
        console.error('Error fetching wedding/guest data:', err);
        setError('Failed to load invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (weddingId || inviteCode) {
      fetchWeddingAndGuest();
    }
  }, [weddingId, inviteCode]);

  useEffect(() => {
    if (!wedding) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const weddingTime = new Date(wedding.weddingDate).getTime();
      const distance = weddingTime - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [wedding]);

  // RSVP Form submission handler
  const handleRSVPSubmit = async (data: EnhancedRSVPFormData) => {
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

  const formatWeddingDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <InvitationContainer primaryColor="#667eea" secondaryColor="#ff6b9d">
        <HeroSection>
          <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading invitation...</div>
        </HeroSection>
      </InvitationContainer>
    );
  }

  if (!wedding) {
    return (
      <InvitationContainer primaryColor="#667eea" secondaryColor="#ff6b9d">
        <HeroSection>
          <div style={{ color: 'white', fontSize: '1.2rem' }}>Wedding invitation not found</div>
        </HeroSection>
      </InvitationContainer>
    );
  }

  if (error) {
    return (
      <InvitationContainer primaryColor="#667eea" secondaryColor="#ff6b9d">
        <HeroSection>
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            <X size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Oops!</div>
            <div style={{ fontSize: '1.1rem' }}>{error}</div>
          </div>
        </HeroSection>
      </InvitationContainer>
    );
  }

  // Extract colors from wedding settings
  const primaryColor = wedding?.settings?.primaryColor || '#667eea';
  const secondaryColor = wedding?.settings?.secondaryColor || '#ff6b9d';

  return (
    <InvitationContainer primaryColor={primaryColor} secondaryColor={secondaryColor}>
      {/* Demo Banner */}
      {isDemo && (
        <DemoBanner primaryColor={primaryColor} secondaryColor={secondaryColor}>
          🎨 Demo Mode - This is a preview of the wedding invitation
        </DemoBanner>
      )}
      
      {/* Hero Section */}
      <HeroSection>
        <CoupleNames>
          {wedding.brideFirstName} & {wedding.groomFirstName}
        </CoupleNames>
        <WeddingDate>
          {formatWeddingDate(wedding.weddingDate)}
        </WeddingDate>
        <LoveQuote>
          {wedding.settings?.loveQuote || "The best type of love is the one that awakens the soul and makes us reach for more."}
        </LoveQuote>
        <HeartIcon size={48} secondaryColor={secondaryColor} />
        <ScrollIndicator>
          <div>Desliza para ver nuestra invitación</div>
          <div style={{ marginTop: '0.5rem', fontSize: '2rem' }}>↓</div>
        </ScrollIndicator>
      </HeroSection>

      {/* Parents Section */}
      <ParentsSection>
        <SectionTitle>
          We have the honor of inviting you to celebrate our marriage
          <br />
          with the blessing of God and our parents
        </SectionTitle>
        <ParentsContainer>
          <ParentsNames>
            <ParentGroup>
              <ParentName>{wedding.settings?.brideMotherName || "Bride's Mother"}</ParentName>
              <ParentName>{wedding.settings?.brideFatherName || "Bride's Father"}</ParentName>
            </ParentGroup>
            <HeartIcon size={32} secondaryColor={secondaryColor} />
            <ParentGroup>
              <ParentName>{wedding.settings?.groomMotherName || "Groom's Mother"}</ParentName>
              <ParentName>{wedding.settings?.groomFatherName || "Groom's Father"}</ParentName>
            </ParentGroup>
          </ParentsNames>
        </ParentsContainer>
      </ParentsSection>

      {/* Padrinos Section */}
      {wedding.settings?.padrinos && wedding.settings.padrinos.length > 0 && (
        <PadrinosSection>
          <SectionTitle>Nuestros Padrinos</SectionTitle>
          <PadrinosGrid>
            {Object.entries(groupPadrinosByType(wedding.settings.padrinos)).map(([type, padrinos]) => (
              <PadrinoCard key={type}>
                <PadrinoIcon>
                  {padrinos[0].icon || getDefaultIcon(type)}
                </PadrinoIcon>
                <PadrinoType>{getTypeDisplayName(type)}</PadrinoType>
                <PadrinoGroup>
                  {padrinos.map((padrino) => (
                    <PadrinoPerson key={padrino.id}>
                      <PadrinoName>{padrino.name}</PadrinoName>
                      {padrino.lastName && <PadrinoName style={{ fontSize: '1rem', fontWeight: '400' }}>{padrino.lastName}</PadrinoName>}
                    </PadrinoPerson>
                  ))}
                </PadrinoGroup>
              </PadrinoCard>
            ))}
          </PadrinosGrid>
        </PadrinosSection>
      )}

      {/* Couple Section */}
      <CoupleSection>
        <SectionTitle>Nosotros</SectionTitle>
        <CoupleContainer>
          <PersonCard>
            <PersonPhoto 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor}
              imageUrl={wedding.settings?.bridePhoto}
            >
              {!wedding.settings?.bridePhoto && wedding.brideFirstName.charAt(0)}
            </PersonPhoto>
            <PersonName>
              {wedding.brideFirstName} {wedding.brideLastName}
            </PersonName>
          </PersonCard>
          
          <HeartIcon size={48} secondaryColor={secondaryColor} />
          
          <PersonCard>
            <PersonPhoto 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor}
              imageUrl={wedding.settings?.groomPhoto}
            >
              {!wedding.settings?.groomPhoto && wedding.groomFirstName.charAt(0)}
            </PersonPhoto>
            <PersonName>
              {wedding.groomFirstName} {wedding.groomLastName}
            </PersonName>
          </PersonCard>
        </CoupleContainer>
      </CoupleSection>

      {/* Couple Photo Section */}
      {wedding.settings?.couplePhoto && (
        <CouplePhotoSection>
          <CouplePhoto 
            src={wedding.settings.couplePhoto} 
            alt={`${wedding.brideFirstName} and ${wedding.groomFirstName}`}
          />
        </CouplePhotoSection>
      )}

      {/* Countdown Section */}
      <CountdownSection>
        <SectionTitle style={{ color: 'white' }}>Time Until Our Wedding:</SectionTitle>
        <CountdownContainer>
          <CountdownTimer>
            <CountdownItem>
              <CountdownNumber secondaryColor={secondaryColor}>{countdown.days.toString().padStart(2, '0')}</CountdownNumber>
              <CountdownLabel>Days</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber secondaryColor={secondaryColor}>{countdown.hours.toString().padStart(2, '0')}</CountdownNumber>
              <CountdownLabel>Hrs</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber secondaryColor={secondaryColor}>{countdown.minutes.toString().padStart(2, '0')}</CountdownNumber>
              <CountdownLabel>Min</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber secondaryColor={secondaryColor}>{countdown.seconds.toString().padStart(2, '0')}</CountdownNumber>
              <CountdownLabel>Sec</CountdownLabel>
            </CountdownItem>
          </CountdownTimer>
        </CountdownContainer>
      </CountdownSection>

      {/* Event Details Section */}
      <EventDetailsSection primaryColor={primaryColor} secondaryColor={secondaryColor}>
        <SectionTitle style={{ color: 'white' }}>Event Details</SectionTitle>
        <EventsContainer>
          <EventCard>
            <EventIcon>📅</EventIcon>
            <EventTitle>When?</EventTitle>
            <EventTime>{formatWeddingDate(wedding.weddingDate)}</EventTime>
          </EventCard>

          <EventCard>
            <EventIcon>⛪</EventIcon>
            <EventTitle>Ceremony</EventTitle>
            <EventTime>{wedding.ceremonyTime}</EventTime>
            <EventLocation>
              {wedding.ceremonyLocation.name}
              <br />
              {wedding.ceremonyLocation.address}
            </EventLocation>
            <MapButton href={wedding.ceremonyLocation.googleMapsUrl || "#"} target="_blank">
              <MapPin size={16} />
              VIEW ON MAPS
            </MapButton>
          </EventCard>

          <EventCard>
            <EventIcon>🎉</EventIcon>
            <EventTitle>Reception</EventTitle>
            <EventTime>{wedding.receptionTime}</EventTime>
            <EventLocation>
              {wedding.receptionLocation.name}
              <br />
              {wedding.receptionLocation.address}
            </EventLocation>
            <MapButton href={wedding.receptionLocation.googleMapsUrl || "#"} target="_blank">
              <MapPin size={16} />
              VIEW ON MAPS
            </MapButton>
          </EventCard>

          <EventCard>
            <EventIcon>👔</EventIcon>
            <EventTitle>Dress Code</EventTitle>
            <EventTime>{wedding.settings?.dressCode || "Formal"}</EventTime>
            <EventLocation>
              {wedding.settings?.dressCodeDescription || "Men: Suit\nWomen: Cocktail Dress"}
              <br />
              <small>*Please avoid wearing white (reserved for the bride)*</small>
            </EventLocation>
          </EventCard>
        </EventsContainer>
      </EventDetailsSection>

      {/* RSVP Section */}
      <RSVPSection>
        <SectionTitle>{wedding.settings?.rsvpTitle || "We Want to Share This Special Moment With You!"}</SectionTitle>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          {wedding.settings?.rsvpMessage || "Please help us by confirming your attendance."}
        </p>

        {/* Show RSVP Form for authenticated guests */}
        {guest && !submitted && (
          <RSVPFormSection>
            <RSVPFormTitle>RSVP for {guest.firstName} {guest.lastName}</RSVPFormTitle>
            {error && (
              <RSVPErrorMessage>
                <X size={24} style={{ margin: '0 auto 1rem', display: 'block' }} />
                {error}
              </RSVPErrorMessage>
            )}
            <GuestWelcomeMessage>
              Dear {guest.firstName}, we're excited to celebrate with you! Please let us know if you'll be attending.
            </GuestWelcomeMessage>
            <EnhancedRSVPForm
              onSubmit={handleRSVPSubmit}
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
              maxPlusOnes={2}
              allowPlusOnes={true}
              showTransportation={true}
              showAccommodation={true}
              showSongRequests={true}
            />
          </RSVPFormSection>
        )}

        {/* Show Success Message after RSVP submission */}
        {submitted && guest && (
          <RSVPSuccessMessage>
            <Check size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.8rem', fontWeight: '300' }}>
              Thank You, {guest.firstName}!
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>
              Your RSVP has been submitted successfully.
            </p>
            <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>
              We can't wait to celebrate with you on our special day!
            </p>
          </RSVPSuccessMessage>
        )}

        {/* Show RSVP Button for demo mode or unauthenticated users */}
        {(!guest || isDemo) && !submitted && (
          <>
            <RSVPButton href={isDemo ? "#" : `/rsvp/${wedding.subdomain}-invitation`} primaryColor={primaryColor} secondaryColor={secondaryColor}>
              <MessageCircle size={24} />
              {wedding.settings?.rsvpButtonText || "CONFIRM ATTENDANCE"}
            </RSVPButton>
            {isDemo && (
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem', fontStyle: 'italic' }}>
                *This is a demo - RSVP button is disabled
              </p>
            )}
          </>
        )}
        
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff3cd', borderRadius: '10px', maxWidth: '500px', margin: '2rem auto 0', fontSize: '0.9rem', color: '#856404' }}>
          <strong>{wedding.settings?.childrenNote || "We would love for you to bring your children,"}</strong><br />
          {wedding.settings?.childrenNoteDetails || "but we ask that you take care of them during the event."}
        </div>
      </RSVPSection>

      {/* Gift Options Section */}
      {wedding.settings?.giftOptions && wedding.settings.giftOptions.length > 0 && (
        <GiftSection>
          <SectionTitle>Gift Options</SectionTitle>
          <GiftContainer>
            <GiftMessage>
              {wedding.settings?.giftMessage || "Our best gift is sharing this great day with you, but if you wish to give us something, we suggest the following options:"}
            </GiftMessage>
            <GiftOptionsGrid>
              {wedding.settings.giftOptions.map((gift) => (
                <GiftOptionCard key={gift.id}>
                  <GiftIcon>
                    {gift.icon || getGiftIcon(gift.type)}
                  </GiftIcon>
                  <GiftTitle>{gift.title}</GiftTitle>
                  {gift.description && (
                    <GiftDescription>{gift.description}</GiftDescription>
                  )}
                  <GiftDetails>
                    {gift.type === 'bank' && (
                      <>
                        <div><strong>Bank:</strong> {gift.bankName}</div>
                        <div><strong>Account:</strong> {gift.accountNumber}</div>
                        <div><strong>Name:</strong> {gift.accountHolder}</div>
                      </>
                    )}
                    {gift.type === 'store' && (
                      <>
                        <div><strong>Store:</strong> {gift.storeName}</div>
                        {gift.storeUrl && (
                          <div>
                            <a href={gift.storeUrl} target="_blank" rel="noopener noreferrer">
                              Visit Store
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </GiftDetails>
                </GiftOptionCard>
              ))}
            </GiftOptionsGrid>
          </GiftContainer>
        </GiftSection>
      )}

      {/* Photo Gallery */}
      {wedding.settings?.photoGallery && wedding.settings.photoGallery.length > 0 && (
        <GallerySection>
          <SectionTitle>Our Memories</SectionTitle>
          <GalleryContainer>
            {wedding.settings.photoGallery.map((imageUrl, index) => (
              <GalleryCard key={index}>
                <GalleryImage
                  src={imageUrl}
                  alt={`Wedding memory ${index + 1}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.closest('.gallery-card')?.remove();
                  }}
                />
                <GalleryCardFooter>
                  <GalleryImageCaption>
                    Memory #{index + 1}
                  </GalleryImageCaption>
                </GalleryCardFooter>
              </GalleryCard>
            ))}
          </GalleryContainer>
        </GallerySection>
      )}

      {/* Hotel Section */}
      {wedding.settings?.hotelInfo && (
        <HotelSection>
          <SectionTitle>Accommodation</SectionTitle>
          <HotelContainer>
            <HotelCard>
              <HotelContent>
                <HotelInfo>
                  <HotelName>{wedding.settings.hotelInfo.name}</HotelName>
                  <HotelAddress>{wedding.settings.hotelInfo.address}</HotelAddress>
                  {wedding.settings.hotelInfo.description && (
                    <HotelDescription>{wedding.settings.hotelInfo.description}</HotelDescription>
                  )}
                  <HotelBookingInfo>
                    {wedding.settings.hotelInfo.phone && (
                      <div><strong>Phone:</strong> {wedding.settings.hotelInfo.phone}</div>
                    )}
                    {wedding.settings.hotelInfo.specialRate && (
                      <div><strong>Special Rate:</strong> {wedding.settings.hotelInfo.specialRate}</div>
                    )}
                    {wedding.settings.hotelInfo.bookingCode && (
                      <div><strong>Booking Code:</strong> {wedding.settings.hotelInfo.bookingCode}</div>
                    )}
                  </HotelBookingInfo>
                  {wedding.settings.hotelInfo.bookingUrl && (
                    <BookingButton 
                      href={wedding.settings.hotelInfo.bookingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Make Reservation
                    </BookingButton>
                  )}
                </HotelInfo>
                {wedding.settings.hotelInfo.photos && wedding.settings.hotelInfo.photos.length > 0 && (
                  <HotelPhotos>
                    {wedding.settings.hotelInfo.photos.slice(0, 4).map((photo, index) => (
                      <HotelPhoto 
                        key={index}
                        src={photo} 
                        alt={`${wedding.settings?.hotelInfo?.name} - Photo ${index + 1}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ))}
                  </HotelPhotos>
                )}
              </HotelContent>
            </HotelCard>
          </HotelContainer>
        </HotelSection>
      )}

      {/* Footer */}
      <Footer>
        <div style={{ marginBottom: '1rem' }}>
          <HeartIcon size={32} secondaryColor={secondaryColor} />
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {wedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!"}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
          {wedding.settings?.footerSignature || "With love:"}
        </div>
        <div style={{ fontSize: '1.5rem', color: secondaryColor, marginTop: '0.5rem' }}>
          {wedding.brideFirstName} & {wedding.groomFirstName}
        </div>
      </Footer>
    </InvitationContainer>
  );
};
