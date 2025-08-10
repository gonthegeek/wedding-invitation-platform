import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../shared/Modal';
import { GuestService } from '../../services/guestService';
import { isValidPhoneNumber } from '../../utils/phoneUtils';
import type { Guest } from '../../types/guest';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingId: string;
  onGuestAdded: () => void;
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
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.$error ? '#ef4444' : 'var(--border)'};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : 'var(--primary-color)'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const Select = styled.select<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.$error ? '#ef4444' : 'var(--border)'};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : 'var(--primary-color)'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: var(--primary-color);
    color: white;
    border: none;
    
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

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  groupName: string;
  allowPlusOnes: boolean;
  maxPlusOnes: number;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  groupName?: string;
  maxPlusOnes?: string;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({ 
  isOpen, 
  onClose, 
  weddingId, 
  onGuestAdded 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    groupName: '',
    allowPlusOnes: false,
    maxPlusOnes: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (include country code if international)';
    }

    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }

    if (formData.allowPlusOnes && formData.maxPlusOnes <= 0) {
      newErrors.maxPlusOnes = 'Maximum plus ones must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Find or create guest group
      const groupId = await GuestService.findOrCreateGroup(
        weddingId,
        formData.groupName,
        formData.allowPlusOnes
      );

      // Create guest data
      const guestData: Omit<Guest, 'id' | 'inviteCode' | 'invitedAt' | 'createdAt' | 'updatedAt' | 'remindersSent'> = {
        weddingId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: '', // Not using email anymore, focusing on phone
        phone: formData.phone.trim(),
        groupId,
        rsvpStatus: 'pending',
        attendingCeremony: false,
        attendingReception: false,
        plusOnes: [],
        allowPlusOnes: formData.allowPlusOnes,
        maxPlusOnes: formData.allowPlusOnes ? formData.maxPlusOnes : 0,
      };

      // Add guest
      await GuestService.createGuest(weddingId, guestData);
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        groupName: '',
        allowPlusOnes: false,
        maxPlusOnes: 1,
      });
      setErrors({});
      onGuestAdded();
      onClose();
    } catch (error) {
      console.error('Error adding guest:', error);
      setErrors({ phone: 'Failed to add guest. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => {
      // Handle linked changes between allowPlusOnes and maxPlusOnes
      if (field === 'allowPlusOnes') {
        const allow = Boolean(value);
        return {
          ...prev,
          allowPlusOnes: allow,
          maxPlusOnes: allow ? Math.max(1, prev.maxPlusOnes || 1) : 0,
        };
      }

      return { ...prev, [field]: value } as FormData;
    });
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        groupName: '',
        allowPlusOnes: false,
        maxPlusOnes: 1,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Guest">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            $error={!!errors.firstName}
            disabled={isSubmitting}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            $error={!!errors.lastName}
            disabled={isSubmitting}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            $error={!!errors.phone}
            disabled={isSubmitting}
            placeholder="e.g., +1 (555) 123-4567 or 555-123-4567"
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="groupName">Group Name *</Label>
          <Input
            id="groupName"
            type="text"
            value={formData.groupName}
            onChange={(e) => handleInputChange('groupName', e.target.value)}
            $error={!!errors.groupName}
            disabled={isSubmitting}
            placeholder="e.g., Family, Friends, Coworkers"
          />
          {errors.groupName && <ErrorMessage>{errors.groupName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={formData.allowPlusOnes}
              onChange={(e) => handleInputChange('allowPlusOnes', e.target.checked)}
              disabled={isSubmitting}
            />
            Allow plus ones for this guest
          </CheckboxLabel>
        </FormGroup>

        {formData.allowPlusOnes && (
          <FormGroup>
            <Label htmlFor="maxPlusOnes">Maximum Plus Ones</Label>
            <Select
              id="maxPlusOnes"
              value={formData.maxPlusOnes}
              onChange={(e) => handleInputChange('maxPlusOnes', parseInt(e.target.value))}
              disabled={isSubmitting}
            >
              <option value={1}>1 Plus One</option>
              <option value={2}>2 Plus Ones</option>
              <option value={3}>3 Plus Ones</option>
              <option value={4}>4 Plus Ones</option>
            </Select>
            {errors.maxPlusOnes && <ErrorMessage>{errors.maxPlusOnes}</ErrorMessage>}
          </FormGroup>
        )}

        <ButtonGroup>
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Guest...' : 'Add Guest'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};
