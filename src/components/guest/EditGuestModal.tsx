import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../shared/Modal';
import { GuestService } from '../../services/guestService';
import { isValidPhoneNumber } from '../../utils/phoneUtils';
import type { Guest, RSVPStatus } from '../../types/guest';
import { useTranslation } from '../../hooks/useLanguage';

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onGuestUpdated: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${(p) => p.theme.colors.textPrimary};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(p) => (p.$error ? '#ef4444' : p.theme.colors.border)};
  border-radius: 8px;
  font-size: 1rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? '#ef4444' : p.theme.colors.primary)};
    box-shadow: none;
  }
`;

const Select = styled.select<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(p) => (p.$error ? '#ef4444' : p.theme.colors.border)};
  border-radius: 8px;
  font-size: 1rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? '#ef4444' : p.theme.colors.primary)};
    box-shadow: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(p) => (p.$error ? '#ef4444' : p.theme.colors.border)};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? '#ef4444' : p.theme.colors.primary)};
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${(p) => p.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            filter: brightness(0.95);
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.textSecondary};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.surfaceAlt};
            color: ${props.theme.colors.textPrimary};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
  dietaryRestrictions: string;
  specialRequests: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export const EditGuestModal: React.FC<EditGuestModalProps> = ({ 
  isOpen, 
  onClose, 
  guest,
  onGuestUpdated 
}) => {
  const t = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rsvpStatus: 'pending',
    attendingCeremony: false,
    attendingReception: false,
    dietaryRestrictions: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Populate form when guest changes
  useEffect(() => {
    if (guest) {
      console.log('EditGuestModal: Guest prop changed, updating form data:', guest);
      setFormData({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone || '',
        rsvpStatus: guest.rsvpStatus,
        attendingCeremony: guest.attendingCeremony,
        attendingReception: guest.attendingReception,
        dietaryRestrictions: guest.dietaryRestrictions || '',
        specialRequests: guest.specialRequests || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest?.id, guest?.phone, guest?.updatedAt]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t.rsvp.firstNameRequired;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t.rsvp.lastNameRequired;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.guestManagement.phoneRequired;
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = t.guestManagement.phoneInvalid;
    }

    // Email is optional, but if provided, validate it
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validation.emailInvalid || 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guest || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Update guest data
      const updates: Partial<Guest> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim() || '', // Email is optional now
        phone: formData.phone.trim(),
        rsvpStatus: formData.rsvpStatus as RSVPStatus,
        attendingCeremony: formData.attendingCeremony,
        attendingReception: formData.attendingReception,
        dietaryRestrictions: formData.dietaryRestrictions.trim() || undefined,
        specialRequests: formData.specialRequests.trim() || undefined,
      };

      // Update RSVP date if status changed to attending/not attending
      if (guest.rsvpStatus === 'pending' && formData.rsvpStatus !== 'pending') {
        updates.rsvpDate = new Date();
      }

      await GuestService.updateGuest(guest.id, updates);
      
      onGuestUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating guest:', error);
      setErrors({ phone: t.guestManagement.updateFailed || 'Failed to update guest. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!guest || !confirm(t.guestManagement.confirmDelete.replace('{name}', `${guest.firstName} ${guest.lastName}`))) {
      return;
    }

    setIsDeleting(true);

    try {
      await GuestService.deleteGuest(guest.id);
      onGuestUpdated();
      onClose();
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert(t.guestManagement.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isDeleting) {
      setErrors({});
      onClose();
    }
  };

  if (!guest) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`${t.guestManagement.editGuestTitle}: ${guest.firstName} ${guest.lastName}`} maxWidth="600px">
      <Form onSubmit={handleSubmit}>
        <InfoText>
          <strong>{t.guestManagement.infoInviteCode}:</strong> {guest.inviteCode} | 
          <strong> {t.guestManagement.infoInvited}:</strong> {guest.invitedAt.toLocaleDateString()} |
          <strong> {t.guestManagement.infoPlusOnes}:</strong> {guest.plusOnes?.length || 0}
        </InfoText>

        <FormGroup>
          <Label htmlFor="firstName">{t.rsvp.firstName} *</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            $error={!!errors.firstName}
            disabled={isSubmitting || isDeleting}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="lastName">{t.rsvp.lastName} *</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            $error={!!errors.lastName}
            disabled={isSubmitting || isDeleting}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">{t.guestManagement.phoneNumberLabel}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            $error={!!errors.phone}
            disabled={isSubmitting || isDeleting}
            placeholder={t.guestManagement.phonePlaceholder}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={isSubmitting || isDeleting}
            placeholder={t.common.optional || 'Optional'}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="rsvpStatus">{t.guestManagement.rsvpStatusLabel}</Label>
          <Select
            id="rsvpStatus"
            value={formData.rsvpStatus}
            onChange={(e) => handleInputChange('rsvpStatus', e.target.value)}
            disabled={isSubmitting || isDeleting}
          >
            <option value="pending">{t.rsvpAnalytics.statusPending}</option>
            <option value="attending">{t.rsvpAnalytics.statusAttending}</option>
            <option value="not_attending">{t.rsvpAnalytics.statusNotAttending}</option>
            <option value="maybe">{t.rsvpAnalytics.statusMaybe}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t.rsvpResponses.attendanceTitle}</Label>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={formData.attendingCeremony}
                onChange={(e) => handleInputChange('attendingCeremony', e.target.checked)}
                disabled={isSubmitting || isDeleting}
              />
              {t.guestManagement.attendingCeremonyLabel}
            </CheckboxLabel>
            
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={formData.attendingReception}
                onChange={(e) => handleInputChange('attendingReception', e.target.checked)}
                disabled={isSubmitting || isDeleting}
              />
              {t.guestManagement.attendingReceptionLabel}
            </CheckboxLabel>
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="dietaryRestrictions">{t.guestManagement.dietaryRestrictionsLabel}</Label>
          <TextArea
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
            disabled={isSubmitting || isDeleting}
            placeholder={t.guestManagement.dietaryRestrictionsPlaceholder || ''}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="specialRequests">{t.guestManagement.specialRequestsLabel}</Label>
          <TextArea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            disabled={isSubmitting || isDeleting}
            placeholder={t.guestManagement.specialRequestsPlaceholder || ''}
          />
        </FormGroup>

        <ButtonGroup>
          <Button 
            type="button" 
            variant="danger" 
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? t.guestManagement.deletingGuest : t.guestManagement.deleteGuestTitle}
          </Button>
          <Button type="button" onClick={handleClose} disabled={isSubmitting || isDeleting}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? t.guestManagement.updatingGuest : t.guestManagement.updateGuest}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};
