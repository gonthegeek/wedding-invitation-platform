import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../shared/Modal';
import { GuestService } from '../../services/guestService';
import { EmailService } from '../../services/emailService';
import { generateSharingURL } from '../../config/invitationConfig';
import type { Guest } from '../../types/guest';
import { Mail, Copy, Send, CheckCircle, AlertCircle, Users, ExternalLink, MessageCircle, Smartphone } from 'lucide-react';

// Default invitation message templates (module scope so they are stable)
const DEFAULT_INVITATION_TEMPLATES = {
  en: "Hi {firstName}! You're invited to our wedding! 💒 Please RSVP here: {url}",
  es: '¡Hola {firstName}! ¡Estás invitado/a a nuestra boda! 💒 Por favor confirma tu asistencia aquí: {url}',
};

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
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const MethodTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const MethodTab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textSecondary)};
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const InfoBox = styled.div<{ type: 'info' | 'warning' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${(p) => (p.type === 'info' ? p.theme.colors.surfaceAlt : '#fff7ed')};
  border: 1px solid ${(p) => (p.type === 'info' ? p.theme.colors.border : '#fed7aa')};
  color: ${(p) => (p.type === 'info' ? p.theme.colors.textSecondary : '#ea580c')};
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textSecondary)};
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const GuestSelectionContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const GuestItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => (p.$selected ? p.theme.colors.surfaceAlt : p.theme.colors.surface)};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${(p) => (p.$selected ? p.theme.colors.surfaceAlt : p.theme.colors.surfaceAlt)};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const GuestPhone = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const GuestStatus = styled.div<{ $status: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
  
  ${(p) => {
    switch (p.$status) {
      case 'pending':
        return `background: #fef3c7; color: #92400e;`;
      case 'sent':
        return `background: #dcfce7; color: #166534;`;
      default:
        return `background: ${p.theme.colors.surfaceAlt}; color: ${p.theme.colors.textSecondary};`;
    }
  }}
`;

const SelectionSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(p) => p.theme.colors.surfaceAlt};
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
  
  ${(p) =>
    p.variant === 'primary'
      ? `
    background: ${p.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }
  `
      : `
    background: ${p.theme.colors.surface};
    color: ${p.theme.colors.textSecondary};
    border: 1px solid ${p.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${p.theme.colors.surfaceAlt};
      color: ${p.theme.colors.textPrimary};
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
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const URLSection = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const URLItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textPrimary};
  word-break: break-all;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: filter 0.2s;
  
  &:hover {
    filter: brightness(0.95);
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
  background: ${(p) => p.$color};
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
  
  ${(p) =>
    p.$type === 'success'
      ? `background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;`
      : `background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`}
`;

const TemplateControls = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const TemplateRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
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

  // New: language + template control
  const [messageLang, setMessageLang] = useState<'en' | 'es'>('en');
  const [messageTemplates, setMessageTemplates] = useState<{ en: string; es: string }>(DEFAULT_INVITATION_TEMPLATES);

  useEffect(() => {
    // Load saved templates and preferred language
    try {
      const saved = localStorage.getItem('invitationMessageTemplates');
      const savedLang = localStorage.getItem('invitationMessageLang');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<typeof DEFAULT_INVITATION_TEMPLATES>;
        setMessageTemplates({ en: parsed.en || DEFAULT_INVITATION_TEMPLATES.en, es: parsed.es || DEFAULT_INVITATION_TEMPLATES.es });
      }
      if (savedLang === 'en' || savedLang === 'es') setMessageLang(savedLang);
    } catch {
      // ignore parse/read errors
    }
  }, []);

  useEffect(() => {
    // Persist user customizations
    try {
      localStorage.setItem('invitationMessageTemplates', JSON.stringify(messageTemplates));
      localStorage.setItem('invitationMessageLang', messageLang);
    } catch {
      // ignore write errors (e.g., privacy mode)
    }
  }, [messageTemplates, messageLang]);

  const buildMessageForGuest = (guest: Guest) => {
    const url = getInvitationURL(guest);
    const tmpl = messageTemplates[messageLang] || DEFAULT_INVITATION_TEMPLATES[messageLang];
    return tmpl
      .replace(/\{firstName\}/g, guest.firstName)
      .replace(/\{url\}/g, url);
  };

  // Check email service status on mount
  useEffect(() => {
    const checkEmailService = async () => {
      try {
        // Temporarily disable email service check until functions are deployed
        setEmailServiceStatus({
          available: false,
          provider: 'not_deployed',
          error: 'Email functions not deployed yet - use URL sharing instead'
        });
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
    if (!guest.phone) {
      alert(`${guest.firstName} ${guest.lastName} doesn't have a phone number. Please add one first or use the copy URL option.`);
      return;
    }

    const message = buildMessageForGuest(guest);
    const whatsappURL = generateSharingURL.whatsapp(message, guest.phone);
    window.open(whatsappURL, '_blank');
    await markGuestAsInvited(guest);
  };

  const shareViaSMS = async (guest: Guest) => {
    if (!guest.phone) {
      alert(`${guest.firstName} ${guest.lastName} doesn't have a phone number. Please add one first or use the copy URL option.`);
      return;
    }

    const message = buildMessageForGuest(guest);
    const smsURL = generateSharingURL.sms(message, guest.phone);
    window.open(smsURL, '_blank');
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
                      <GuestPhone>{guest.phone || 'No phone provided'}</GuestPhone>
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
                    ? " Perfect for following up with guests who haven't responded yet."
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
              <br />
              <strong>📱 Direct Integration:</strong> WhatsApp and SMS buttons will open directly to the guest's phone number if available.
              {selectedGuestsList.some(g => g.remindersSent > 0) 
                ? ' Reminder counts will be updated when you copy/share URLs, helping you track follow-ups.'
                : ' Guests will be automatically marked as "invited" when you copy/share their URLs, or you can use "Mark All as Invited" for bulk tracking.'
              }
            </SectionDescription>

            {/* New: Language and Template editor */}
            <TemplateControls>
              <TemplateRow>
                <label htmlFor="msgLang" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Message language</label>
                <Select id="msgLang" value={messageLang} onChange={e => setMessageLang(e.target.value as 'en' | 'es')}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </Select>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Available placeholders: {'{firstName}'} and {'{url}'}
                </div>
              </TemplateRow>
              <div>
                <TextArea
                  value={messageTemplates[messageLang]}
                  onChange={(e) => setMessageTemplates(prev => ({ ...prev, [messageLang]: e.target.value }))}
                />
              </div>
            </TemplateControls>

            <URLSection>
              {selectedGuestsList.map((guest) => (
                <URLItem key={guest.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {guest.firstName} {guest.lastName}
                    </div>
                    <URLText>{getInvitationURL(guest)}</URLText>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Preview: {buildMessageForGuest(guest)}
                    </div>
                    <SocialButtons>
                      <SocialButton 
                        $color="#25D366" 
                        onClick={() => shareViaWhatsApp(guest)}
                        title={guest.phone ? "Send WhatsApp message directly" : "No phone number - add one to enable WhatsApp"}
                        disabled={!guest.phone}
                        style={{ opacity: guest.phone ? 1 : 0.5, cursor: guest.phone ? 'pointer' : 'not-allowed' }}
                      >
                        <MessageCircle size={12} />
                        WhatsApp {!guest.phone && '(No phone)'}
                      </SocialButton>
                      <SocialButton 
                        $color="#007AFF" 
                        onClick={() => shareViaSMS(guest)}
                        title={guest.phone ? "Send SMS message directly" : "No phone number - add one to enable SMS"}
                        disabled={!guest.phone}
                        style={{ opacity: guest.phone ? 1 : 0.5, cursor: guest.phone ? 'pointer' : 'not-allowed' }}
                      >
                        <Smartphone size={12} />
                        SMS {!guest.phone && '(No phone)'}
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
