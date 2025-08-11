import React, { useState } from 'react';
import styled from 'styled-components';
import { useGuest } from '../../hooks/useGuest';
import { Search, User, Heart, Music, Car, Home, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import type { Guest, PlusOne } from '../../types';
import { useTranslation } from '../../hooks/useLanguage';

interface DetailedRSVPResponsesProps {
  weddingId: string;
}

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 16px;
  height: 16px;
`;

const GuestCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const GuestHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const GuestInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const GuestName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GuestEmail = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$status) {
      case 'attending':
        return 'background: #d1fae5; color: #065f46;';
      case 'not_attending':
        return 'background: #fee2e2; color: #991b1b;';
      case 'maybe':
        return 'background: #fef3c7; color: #92400e;';
      default:
        return `background: ${props.theme.colors.surfaceAlt}; color: ${props.theme.colors.textPrimary};`;
    }
  }}
`;

const ResponseSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  padding: 16px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

const InfoContent = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const PlusOnesList = styled.div`
  margin-top: 8px;
`;

const PlusOneItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PlusOneName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

export const DetailedRSVPResponses: React.FC<DetailedRSVPResponsesProps> = ({ weddingId }) => {
  const { guests, loading } = useGuest(weddingId);
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslation();

  // Filter guests who have responded (not pending)
  const respondedGuests = guests.filter((guest: Guest) => guest.rsvpStatus !== 'pending');

  // Filter by search term
  const filteredGuests = respondedGuests.filter((guest: Guest) =>
    `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatStatus = (status: string) => {
    switch (status) {
      case 'attending': return t.rsvpAnalytics.statusAttending;
      case 'not_attending': return t.rsvpAnalytics.statusNotAttending;
      case 'maybe': return t.rsvpAnalytics.statusMaybe;
      default: return t.rsvpAnalytics.statusPending;
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          {t.rsvpResponses.loading}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{t.rsvpResponses.title.replace('{count}', String(filteredGuests.length))}</Title>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder={t.rsvpResponses.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>

      {filteredGuests.length === 0 ? (
        <EmptyState>
          {respondedGuests.length === 0 
            ? t.rsvpResponses.emptyNoResponses
            : t.rsvpResponses.emptyNoMatches
          }
        </EmptyState>
      ) : (
        filteredGuests.map((guest: Guest) => (
          <GuestCard key={guest.id}>
            <GuestHeader>
              <GuestInfo>
                <GuestName>
                  <User size={20} />
                  {guest.firstName} {guest.lastName}
                </GuestName>
                {guest.email && <GuestEmail>{guest.email}</GuestEmail>}
              </GuestInfo>
              <StatusBadge $status={guest.rsvpStatus}>
                {formatStatus(guest.rsvpStatus)}
              </StatusBadge>
            </GuestHeader>

            <ResponseSection>
              {/* Attendance Details */}
              <InfoCard>
                <InfoTitle>
                  <Heart size={16} />
                  {t.rsvpResponses.attendanceTitle}
                </InfoTitle>
                <InfoContent>
                  {guest.rsvpStatus === 'attending' ? (
                    <>
                      <div>{t.rsvpResponses.attendingWedding}</div>
                      {guest.attendingCeremony && <div>{t.rsvpResponses.willAttendCeremony}</div>}
                      {guest.attendingReception && <div>{t.rsvpResponses.willAttendReception}</div>}
                    </>
                  ) : guest.rsvpStatus === 'not_attending' ? (
                    <div>{t.rsvpResponses.willNotAttend}</div>
                  ) : (
                    <div>{t.rsvpResponses.maybeAttending}</div>
                  )}
                </InfoContent>
              </InfoCard>

              {/* Plus Ones */}
              {guest.plusOnes && guest.plusOnes.length > 0 && (
                <InfoCard>
                  <InfoTitle>
                    <User size={16} />
                    {t.rsvpResponses.plusOnesTitle.replace('{count}', String(guest.plusOnes.length))}
                  </InfoTitle>
                  <PlusOnesList>
                    {guest.plusOnes.map((plusOne: PlusOne, index: number) => (
                      <PlusOneItem key={index}>
                        <PlusOneName>
                          {plusOne.firstName} {plusOne.lastName}
                        </PlusOneName>
                        {plusOne.dietaryRestrictions && (
                          <InfoContent>
                            {t.rsvpResponses.dietaryLabel} {plusOne.dietaryRestrictions}
                          </InfoContent>
                        )}
                      </PlusOneItem>
                    ))}
                  </PlusOnesList>
                </InfoCard>
              )}

              {/* Dietary Restrictions */}
              {guest.dietaryRestrictions && (
                <InfoCard>
                  <InfoTitle>
                    <AlertCircle size={16} />
                    {t.rsvpAnalytics.dietaryRestrictionsTitle}
                  </InfoTitle>
                  <InfoContent>{guest.dietaryRestrictions}</InfoContent>
                </InfoCard>
              )}

              {/* Song Requests */}
              {guest.songRequests && (
                <InfoCard>
                  <InfoTitle>
                    <Music size={16} />
                    {t.rsvp.songRequests}
                  </InfoTitle>
                  <InfoContent>{guest.songRequests}</InfoContent>
                </InfoCard>
              )}

              {/* Transportation */}
              {guest.needsTransportation && (
                <InfoCard>
                  <InfoTitle>
                    <Car size={16} />
                    {t.rsvpResponses.transportationTitle}
                  </InfoTitle>
                  <InfoContent>
                    <div>{t.rsvpResponses.needsTransportation}</div>
                    {guest.transportationDetails && (
                      <div style={{ marginTop: '4px' }}>
                        {t.rsvpResponses.detailsLabel} {guest.transportationDetails}
                      </div>
                    )}
                  </InfoContent>
                </InfoCard>
              )}

              {/* Accommodation */}
              {guest.needsAccommodation && (
                <InfoCard>
                  <InfoTitle>
                    <Home size={16} />
                    {t.rsvpResponses.accommodationTitle}
                  </InfoTitle>
                  <InfoContent>
                    <div>{t.rsvpResponses.needsAccommodation}</div>
                    {guest.accommodationDetails && (
                      <div style={{ marginTop: '4px' }}>
                        {t.rsvpResponses.detailsLabel} {guest.accommodationDetails}
                      </div>
                    )}
                  </InfoContent>
                </InfoCard>
              )}

              {/* Emergency Contact */}
              {guest.emergencyContactName && (
                <InfoCard>
                  <InfoTitle>
                    <Phone size={16} />
                    {t.rsvpResponses.emergencyContactTitle}
                  </InfoTitle>
                  <InfoContent>
                    <div>{guest.emergencyContactName}</div>
                    {guest.emergencyContactPhone && (
                      <div>{guest.emergencyContactPhone}</div>
                    )}
                  </InfoContent>
                </InfoCard>
              )}

              {/* Special Requests & Message */}
              {(guest.specialRequests || guest.message) && (
                <InfoCard>
                  <InfoTitle>
                    <MessageSquare size={16} />
                    {t.rsvpResponses.messagesAndRequestsTitle}
                  </InfoTitle>
                  <InfoContent>
                    {guest.specialRequests && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>{t.rsvpResponses.specialRequests}</strong><br />
                        {guest.specialRequests}
                      </div>
                    )}
                    {guest.message && (
                      <div>
                        <strong>{t.rsvpResponses.messageLabel}</strong><br />
                        {guest.message}
                      </div>
                    )}
                  </InfoContent>
                </InfoCard>
              )}
            </ResponseSection>
          </GuestCard>
        ))
      )}
    </Container>
  );
};
