import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Heart, MapPin, Clock, Users, Check, X } from 'lucide-react';
import { WeddingService } from '../services/weddingService';
import { GuestService } from '../services/guestService';
import type { Wedding, Guest } from '../types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const InvitationCard = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const InvitationHeader = styled.div<{ primaryColor?: string }>`
  background: ${props => props.primaryColor || '#3b82f6'};
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
    background-size: 20px 20px;
  }
`;

const HeartIcon = styled(Heart)`
  margin: 0 auto 1rem;
  display: block;
`;

const CoupleNames = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0 0 1rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WeddingDate = styled.div`
  font-size: 1.25rem;
  font-weight: 400;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const InvitationContent = styled.div`
  padding: 2rem;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  font-style: italic;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RSVPSection = styled.div`
  background: #f9fafb;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const RSVPTitle = styled.h2`
  text-align: center;
  margin: 0 0 2rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const RadioOption = styled.label<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? '#eff6ff' : 'white'};
  
  &:hover {
    border-color: #3b82f6;
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

const RadioText = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
`;

const RadioDescription = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #059669;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface RSVPFormData {
  rsvpStatus: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
  dietaryRestrictions?: string;
  specialRequests?: string;
  message?: string;
}

export const RSVPPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RSVPFormData>({
    defaultValues: {
      rsvpStatus: '',
      attendingCeremony: true,
      attendingReception: true,
    },
  });

  const rsvpStatus = watch('rsvpStatus');

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

  const onSubmit = async (data: RSVPFormData) => {
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
        plusOnes: [], // TODO: Handle plus ones
        dietaryRestrictions: data.dietaryRestrictions,
        specialRequests: data.specialRequests,
        message: data.message,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
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
      <PageContainer>
        <InvitationCard>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </InvitationCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <InvitationCard>
          <InvitationContent>
            <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
              <X size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h2>Oops!</h2>
              <p>{error}</p>
            </div>
          </InvitationContent>
        </InvitationCard>
      </PageContainer>
    );
  }

  if (!wedding || !guest) {
    return (
      <PageContainer>
        <InvitationCard>
          <InvitationContent>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h2>Invitation not found</h2>
              <p>This invitation link is not valid.</p>
            </div>
          </InvitationContent>
        </InvitationCard>
      </PageContainer>
    );
  }

  if (submitted) {
    return (
      <PageContainer>
        <InvitationCard>
          <SuccessMessage>
            <Check size={48} style={{ margin: '0 auto 1rem' }} />
            <h2>Thank you for your response!</h2>
            <p>We've received your RSVP and look forward to celebrating with you.</p>
          </SuccessMessage>
        </InvitationCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <InvitationCard>
        <InvitationHeader primaryColor={wedding.template.primaryColor}>
          <HeartIcon size={32} />
          <CoupleNames>
            {wedding.brideFirstName} & {wedding.groomFirstName}
          </CoupleNames>
          <WeddingDate>
            {formatDate(wedding.weddingDate)}
          </WeddingDate>
        </InvitationHeader>

        <InvitationContent>
          <WelcomeMessage>
            You're Invited to Our Wedding!
          </WelcomeMessage>

          {wedding.settings.welcomeMessage && (
            <WelcomeMessage>
              {wedding.settings.welcomeMessage}
            </WelcomeMessage>
          )}

          <EventDetails>
            <EventCard>
              <EventTitle>
                <Heart size={20} />
                Ceremony
              </EventTitle>
              <EventDetail>
                <Clock size={16} />
                {formatTime(wedding.ceremonyTime)}
              </EventDetail>
              <EventDetail>
                <MapPin size={16} />
                {wedding.ceremonyLocation.name}
              </EventDetail>
              <EventDetail>
                <span></span>
                {wedding.ceremonyLocation.address}, {wedding.ceremonyLocation.city}
              </EventDetail>
            </EventCard>

            <EventCard>
              <EventTitle>
                <Users size={20} />
                Reception
              </EventTitle>
              <EventDetail>
                <Clock size={16} />
                {formatTime(wedding.receptionTime)}
              </EventDetail>
              <EventDetail>
                <MapPin size={16} />
                {wedding.receptionLocation.name}
              </EventDetail>
              <EventDetail>
                <span></span>
                {wedding.receptionLocation.address}, {wedding.receptionLocation.city}
              </EventDetail>
            </EventCard>
          </EventDetails>
        </InvitationContent>

        <RSVPSection>
          <RSVPTitle>Please Respond by {formatDate(wedding.settings.requireRSVPDeadline)}</RSVPTitle>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>Will you be attending?</Label>
              <RadioGroup>
                <RadioOption isSelected={rsvpStatus === 'attending'}>
                  <RadioInput
                    type="radio"
                    value="attending"
                    {...register('rsvpStatus')}
                  />
                  <RadioText>
                    <RadioTitle>Yes, I'll be there!</RadioTitle>
                    <RadioDescription>Can't wait to celebrate with you</RadioDescription>
                  </RadioText>
                </RadioOption>
                
                <RadioOption isSelected={rsvpStatus === 'not_attending'}>
                  <RadioInput
                    type="radio"
                    value="not_attending"
                    {...register('rsvpStatus')}
                  />
                  <RadioText>
                    <RadioTitle>Sorry, can't make it</RadioTitle>
                    <RadioDescription>Will be there in spirit</RadioDescription>
                  </RadioText>
                </RadioOption>
              </RadioGroup>
              {errors.rsvpStatus && (
                <ErrorMessage>{errors.rsvpStatus.message}</ErrorMessage>
              )}
            </FormGroup>

            {rsvpStatus === 'attending' && (
              <>
                <FormGroup>
                  <Label>Which events will you attend?</Label>
                  <CheckboxGroup>
                    <CheckboxOption>
                      <input
                        type="checkbox"
                        {...register('attendingCeremony')}
                      />
                      Ceremony
                    </CheckboxOption>
                    <CheckboxOption>
                      <input
                        type="checkbox"
                        {...register('attendingReception')}
                      />
                      Reception
                    </CheckboxOption>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Dietary Restrictions</Label>
                  <Input
                    type="text"
                    placeholder="Any dietary restrictions or allergies?"
                    {...register('dietaryRestrictions')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Special Requests</Label>
                  <Input
                    type="text"
                    placeholder="Any special accommodations needed?"
                    {...register('specialRequests')}
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label>Message to the Couple (Optional)</Label>
              <TextArea
                placeholder="Leave a special message for the happy couple..."
                {...register('message')}
              />
              {errors.message && (
                <ErrorMessage>{errors.message.message}</ErrorMessage>
              )}
            </FormGroup>

            {error && (
              <ErrorMessage style={{ textAlign: 'center', marginTop: '1rem' }}>
                {error}
              </ErrorMessage>
            )}

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit RSVP'}
            </SubmitButton>
          </form>
        </RSVPSection>
      </InvitationCard>
    </PageContainer>
  );
};
