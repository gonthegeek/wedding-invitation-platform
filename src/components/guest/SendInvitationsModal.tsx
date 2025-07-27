import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../shared/Modal';
import { GuestService } from '../../services/guestService';
import { EmailService } from '../../services/emailService';
import { generateSharingURL } from '../../config/invitationConfig';
import type { Guest } from '../../types/guest';
import { Mail, Copy, Send, CheckCircle, AlertCircle, Users, ExternalLink, MessageCircle, Smartphone } from 'lucide-react';

interface SendInvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  onInvitationsSent: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Section = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
`;

const MethodTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
`;

const MethodTab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const InfoBox = styled.div<{ type: 'info' | 'warning' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${props => props.type === 'info' ? '#eff6ff' : '#fff7ed'};
  border: 1px solid ${props => props.type === 'info' ? '#bfdbfe' : '#fed7aa'};
  color: ${props => props.type === 'info' ? '#1e40af' : '#ea580c'};
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const GuestSelectionContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const GuestItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background: ${props => props.$selected ? '#f0f9ff' : 'white'};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.$selected ? '#e0f2fe' : '#f9fafb'};
  }
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
  cursor: pointer;
`;

const GuestInfo = styled.div`
  flex: 1;
`;

const GuestName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const GuestEmail = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const GuestStatus = styled.div<{ $status: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'sent':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const SelectionSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.variant === 'primary' ? `
    background: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-hover);
    }
  ` : `
    background: white;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    
    &:hover:not(:disabled) {
      background: #f9fafb;
      color: var(--text-primary);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
`;

const URLSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const URLItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const URLText = styled.div`
  flex: 1;
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--primary-hover);
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SocialButton = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  background: ${props => props.$color};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  
  ${props => props.$type === 'success' ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;

export const SendInvitationsModal: React.FC<SendInvitationsModalProps> = ({ 
  isOpen, 
  onClose, 
  guests,
  onInvitationsSent 
}) => {
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedURLs, setCopiedURLs] = useState<Set<string>>(new Set());
  const [invitationMethod, setInvitationMethod] = useState<'urls' | 'email'>('urls');
  const [guestFilter, setGuestFilter] = useState<'pending' | 'invited' | 'all'>('pending');
  const [emailServiceStatus, setEmailServiceStatus] = useState<{
    available: boolean;
    provider: string;
    error?: string;
  } | null>(null);

  // Check email service status on mount
  useEffect(() => {
    const checkEmailService = async () => {
      try {
        // Temporarily disable email service check until functions are deployed
        // TODO: Re-enable after firebase functions are deployed
        setEmailServiceStatus({
          available: false,
          provider: 'not_deployed',
          error: 'Email functions not deployed yet - use URL sharing instead'
        });
        
        // Uncomment below when functions are deployed:
        // const status = await EmailService.checkEmailServiceStatus();
        // setEmailServiceStatus(status);
      } catch (err) {
        console.error('Failed to check email service:', err);
        setEmailServiceStatus({
          available: false,
          provider: 'none',
          error: 'Failed to check email service'
        });
      }
    };

    checkEmailService();
  }, []);

  // Filter guests based on invitation status
  const getFilteredGuests = () => {
    switch (guestFilter) {
      case 'pending':
        return guests.filter(guest => guest.remindersSent === 0);
      case 'invited':
        return guests.filter(guest => guest.remindersSent > 0);
      case 'all':
      default:
        return guests;
    }
  };

  const filteredGuests = getFilteredGuests();
  const allSelected = selectedGuests.size === filteredGuests.length && filteredGuests.length > 0;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedGuests(new Set());
      setStatusMessage(null);
      setCopiedURLs(new Set());
    }
  }, [isOpen]);

  const toggleGuestSelection = (guestId: string) => {
    const newSelection = new Set(selectedGuests);
    if (newSelection.has(guestId)) {
      newSelection.delete(guestId);
    } else {
      newSelection.add(guestId);
    }
    setSelectedGuests(newSelection);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedGuests(new Set());
    } else {
      setSelectedGuests(new Set(filteredGuests.map(guest => guest.id)));
    }
  };

  const getInvitationURL = (guest: Guest) => {
    // In a real app, this would be the actual domain
    const baseURL = window.location.origin;
    return `${baseURL}/invite/${guest.inviteCode}`;  // Updated to new format with embedded RSVP
  };

  const markGuestAsInvited = async (guest: Guest) => {
    try {
      await GuestService.updateGuest(guest.id, {
        remindersSent: guest.remindersSent + 1,
        invitedAt: new Date(),
      });
      // Refresh the guest list to reflect changes
      onInvitationsSent();
    } catch (error) {
      console.error('Failed to update guest invitation status:', error);
    }
  };

  const markAllSelectedAsInvited = async () => {
    if (selectedGuests.size === 0) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const selectedGuestsList = guests.filter(guest => selectedGuests.has(guest.id));
      
      // Update all selected guests to mark invitations as sent
      for (const guest of selectedGuestsList) {
        await GuestService.updateGuest(guest.id, {
          remindersSent: guest.remindersSent + 1,
          invitedAt: new Date(),
        });
      }

      setStatusMessage({
        type: 'success',
        message: `Successfully ${selectedGuestsList.some(g => g.remindersSent > 0) ? 'sent reminders to' : 'marked'} ${selectedGuestsList.length} guest${selectedGuestsList.length === 1 ? '' : 's'} ${selectedGuestsList.some(g => g.remindersSent > 0) ? '!' : 'as invited!'}`
      });

      // Refresh the guest list and close modal after a brief delay
      setTimeout(() => {
        onInvitationsSent();
        setSelectedGuests(new Set());
      }, 1500);

    } catch (error) {
      console.error('Error marking guests as invited:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to mark guests as invited. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareViaWhatsApp = async (guest: Guest) => {
    const url = getInvitationURL(guest);
    const message = `Hi ${guest.firstName}! You're invited to our wedding! 💒 Please RSVP here: ${url}`;
    const whatsappURL = generateSharingURL.whatsapp(message);
    window.open(whatsappURL, '_blank');
    
    // Mark guest as invited when URL is shared
    await markGuestAsInvited(guest);
  };

  const shareViaSMS = async (guest: Guest) => {
    const url = getInvitationURL(guest);
    const message = `Hi ${guest.firstName}! You're invited to our wedding! Please RSVP: ${url}`;
    const smsURL = generateSharingURL.sms(message);
    window.open(smsURL, '_blank');
    
    // Mark guest as invited when URL is shared
    await markGuestAsInvited(guest);
  };

  const copyURL = async (guest: Guest) => {
    const url = getInvitationURL(guest);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedURLs(prev => new Set([...prev, guest.id]));
      
      // Mark guest as invited when URL is copied
      await markGuestAsInvited(guest);
      
      setTimeout(() => {
        setCopiedURLs(prev => {
          const newSet = new Set(prev);
          newSet.delete(guest.id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const sendInvitations = async () => {
    if (selectedGuests.size === 0) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const selectedGuestsList = guests.filter(guest => selectedGuests.has(guest.id));
      
      // Check if we have weddingId (should be available from guests data)
      const weddingId = selectedGuestsList[0]?.weddingId;
      if (!weddingId) {
        throw new Error('Wedding ID not found');
      }

      // Use EmailService to send real emails
      const result = await EmailService.sendInvitationEmails({
        weddingId,
        guests: selectedGuestsList
      });

      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: `Successfully sent ${result.totalSent} invitation${result.totalSent === 1 ? '' : 's'}!` +
            (result.totalFailed > 0 ? ` (${result.totalFailed} failed)` : '')
        });

        onInvitationsSent();
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatusMessage({
          type: 'error',
          message: 'Some invitations failed to send. Please try again.'
        });
      }

    } catch (error) {
      console.error('Error sending invitations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('not authenticated')) {
        setStatusMessage({
          type: 'error',
          message: 'Authentication required. Please log in again.'
        });
      } else if (errorMessage.includes('email service')) {
        setStatusMessage({
          type: 'error',
          message: 'Email service not configured. Please contact support or use URL sharing method.'
        });
      } else {
        setStatusMessage({
          type: 'error',
          message: 'Failed to send invitations. Please try again or use URL sharing method.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGuestsList = guests.filter(guest => selectedGuests.has(guest.id));
  const hasInvitedGuests = guests.some(guest => guest.remindersSent > 0);
  const modalTitle = hasInvitedGuests ? "Send Invitations & Reminders" : "Send Invitations";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="700px">
      <Container>
        {/* Guest Selection Section */}
        <Section>
          <SectionTitle>
            <Users size={20} />
            Select Guests
          </SectionTitle>
          <SectionDescription>
            Choose guests to invite or send reminders to. Use the tabs below to filter by invitation status.
          </SectionDescription>

          {/* Guest Filter Tabs */}
          <FilterTabs>
            <FilterTab 
              $active={guestFilter === 'pending'} 
              onClick={() => setGuestFilter('pending')}
            >
              📋 Pending ({guests.filter(g => g.remindersSent === 0).length})
            </FilterTab>
            <FilterTab 
              $active={guestFilter === 'invited'} 
              onClick={() => setGuestFilter('invited')}
            >
              ✉️ Invited ({guests.filter(g => g.remindersSent > 0).length})
            </FilterTab>
            <FilterTab 
              $active={guestFilter === 'all'} 
              onClick={() => setGuestFilter('all')}
            >
              👥 All ({guests.length})
            </FilterTab>
          </FilterTabs>

          {filteredGuests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              {guestFilter === 'pending' && 'All guests have already been sent invitations!'}
              {guestFilter === 'invited' && 'No guests have been invited yet.'}
              {guestFilter === 'all' && 'No guests found.'}
            </div>
          ) : (
            <>
              <SelectionSummary>
                <div>
                  <strong>{selectedGuests.size}</strong> of <strong>{filteredGuests.length}</strong> guests selected
                </div>
                <Button onClick={toggleSelectAll}>
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </SelectionSummary>

              <GuestSelectionContainer>
                {filteredGuests.map((guest) => (
                  <GuestItem 
                    key={guest.id} 
                    $selected={selectedGuests.has(guest.id)}
                    onClick={() => toggleGuestSelection(guest.id)}
                  >
                    <Checkbox
                      type="checkbox"
                      checked={selectedGuests.has(guest.id)}
                      onChange={() => toggleGuestSelection(guest.id)}
                    />
                    <GuestInfo>
                      <GuestName>{guest.firstName} {guest.lastName}</GuestName>
                      <GuestEmail>{guest.email}</GuestEmail>
                    </GuestInfo>
                    <GuestStatus $status={guest.remindersSent > 0 ? 'sent' : 'pending'}>
                      {guest.remindersSent > 0 ? `Sent (${guest.remindersSent}x)` : 'Pending'}
                    </GuestStatus>
                  </GuestItem>
                ))}
              </GuestSelectionContainer>
            </>
          )}
        </Section>

        {/* Invitation Method Selection */}
        {selectedGuestsList.length > 0 && (
          <Section>
            <SectionTitle>
              <Mail size={20} />
              {selectedGuestsList.some(g => g.remindersSent > 0) ? 'Send Reminders' : 'Invitation Method'}
            </SectionTitle>
            
            <MethodTabs>
              <MethodTab 
                $active={invitationMethod === 'urls'} 
                onClick={() => setInvitationMethod('urls')}
              >
                📱 Share URLs (Recommended)
              </MethodTab>
              <MethodTab 
                $active={invitationMethod === 'email'} 
                onClick={() => setInvitationMethod('email')}
              >
                ✉️ Email (Advanced)
              </MethodTab>
            </MethodTabs>

            {invitationMethod === 'urls' && (
              <InfoBox type="info">
                <ExternalLink size={16} />
                <div>
                  <strong>
                    {selectedGuestsList.some(g => g.remindersSent > 0) 
                      ? 'Send gentle reminders!' 
                      : 'Cost-effective and personal!'
                    }
                  </strong> Copy invitation URLs and share them directly via WhatsApp, text message, or social media. 
                  {selectedGuestsList.some(g => g.remindersSent > 0) 
                    ? ' Perfect for following up with guests who haven\'t responded yet.'
                    : ' This method is free and often more personal than email.'
                  }
                </div>
              </InfoBox>
            )}

            {invitationMethod === 'email' && (
              <InfoBox type={emailServiceStatus?.available ? 'info' : 'warning'}>
                <AlertCircle size={16} />
                <div>
                  {emailServiceStatus?.available ? (
                    <>
                      <strong>Email service ready:</strong> Using {emailServiceStatus.provider} for email delivery. 
                      Emails will be sent professionally with tracking and delivery confirmation.
                    </>
                  ) : (
                    <>
                      <strong>Email service required:</strong> To send real emails, you'll need to configure an email service provider. 
                      {emailServiceStatus?.error && ` (${emailServiceStatus.error})`}
                      <br />
                      <small>Consider using URL sharing method instead - it's free and often more personal!</small>
                    </>
                  )}
                </div>
              </InfoBox>
            )}
          </Section>
        )}

        {/* Copy URLs Section */}
        {selectedGuestsList.length > 0 && invitationMethod === 'urls' && (
          <Section>
            <SectionTitle>
              <ExternalLink size={20} />
              {selectedGuestsList.some(g => g.remindersSent > 0) ? 'Reminder URLs' : 'Invitation URLs'}
            </SectionTitle>
            <SectionDescription>
              Copy individual invitation URLs to share via WhatsApp, text message, or other channels. 
              {selectedGuestsList.some(g => g.remindersSent > 0) 
                ? 'Reminder counts will be updated when you copy/share URLs, helping you track follow-ups.'
                : 'Guests will be automatically marked as "invited" when you copy/share their URLs, or you can use "Mark All as Invited" for bulk tracking.'
              }
            </SectionDescription>

            <URLSection>
              {selectedGuestsList.map((guest) => (
                <URLItem key={guest.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {guest.firstName} {guest.lastName}
                    </div>
                    <URLText>{getInvitationURL(guest)}</URLText>
                    <SocialButtons>
                      <SocialButton 
                        $color="#25D366" 
                        onClick={() => shareViaWhatsApp(guest)}
                        title="Share via WhatsApp"
                      >
                        <MessageCircle size={12} />
                        WhatsApp
                      </SocialButton>
                      <SocialButton 
                        $color="#007AFF" 
                        onClick={() => shareViaSMS(guest)}
                        title="Share via SMS"
                      >
                        <Smartphone size={12} />
                        SMS
                      </SocialButton>
                    </SocialButtons>
                  </div>
                  <CopyButton onClick={() => copyURL(guest)}>
                    {copiedURLs.has(guest.id) ? (
                      <>
                        <CheckCircle size={12} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </CopyButton>
                </URLItem>
              ))}
            </URLSection>

            {/* Bulk Actions for URL Sharing */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <InfoBox type="info">
                <CheckCircle size={16} />
                <div>
                  <strong>Tip:</strong> After sharing URLs manually, click 
                  "{selectedGuestsList.some(g => g.remindersSent > 0) ? 'Mark All Reminded' : 'Mark All as Invited'}" 
                  to update tracking status.
                </div>
              </InfoBox>
              <div style={{ marginTop: '1rem' }}>
                <Button 
                  variant="primary" 
                  onClick={markAllSelectedAsInvited}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>⏳</div>
                      {selectedGuestsList.some(g => g.remindersSent > 0) ? 'Sending Reminders...' : 'Marking as Invited...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      {selectedGuestsList.some(g => g.remindersSent > 0) ? 'Mark All Reminded' : 'Mark All as Invited'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Section>
        )}

        {/* Email Sending Section */}
        {selectedGuests.size > 0 && invitationMethod === 'email' && (
          <Section>
            <SectionTitle>
              <Mail size={20} />
              Send Email Invitations
            </SectionTitle>
            <SectionDescription>
              Send beautiful email invitations with personalized invitation links to selected guests.
            </SectionDescription>

            <div style={{ textAlign: 'center' }}>
              <Button 
                variant="primary" 
                onClick={sendInvitations}
                disabled={isLoading || selectedGuests.size === 0 || !emailServiceStatus?.available}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send {selectedGuests.size} Invitation{selectedGuests.size === 1 ? '' : 's'}
                  </>
                )}
              </Button>
            </div>
          </Section>
        )}

        {statusMessage && (
          <StatusMessage $type={statusMessage.type}>
            {statusMessage.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {statusMessage.message}
          </StatusMessage>
        )}

        <ButtonGroup>
          <Button onClick={onClose} disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Close'}
          </Button>
        </ButtonGroup>
      </Container>
    </Modal>
  );
};
