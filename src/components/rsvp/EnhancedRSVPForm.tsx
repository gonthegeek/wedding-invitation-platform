import React from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, Music, MessageSquare, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from '../../hooks/useLanguage';

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${(p) => p.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// RSVP status options
const RsvpOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const OptionCard = styled.label<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  border-radius: 8px;
  cursor: pointer;
  background: ${(p) => (p.$active ? p.theme.colors.surfaceAlt : p.theme.colors.surface)};
`;

const OptionText = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: 0.875rem;
`;

const OptionSubtitle = styled.div`
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const PlusOneCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const PlusOneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PlusOneTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const RemoveButton = styled.button`
  background: ${(p) => p.theme.colors.error};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    filter: brightness(0.9);
  }
`;

const AddPlusOneButton = styled.button`
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  &:hover {
    filter: brightness(0.95);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const ErrorMessage = styled.div`
  color: ${(p) => p.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-top: 0.5rem;
  font-style: italic;
`;

const SubmitButton = styled.button<{ primaryColor?: string; secondaryColor?: string }>`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${(props) => props.primaryColor || '#667eea'} 0%, ${(props) => props.secondaryColor || '#764ba2'} 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export interface EnhancedRSVPFormData {
  rsvpStatus: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
  
  // Plus ones
  plusOnes: Array<{
    firstName: string;
    lastName: string;
    dietaryRestrictions?: string;
  }>;
  
  // Enhanced features
  dietaryRestrictions?: string;
  songRequests?: string;
  specialRequests?: string;
  message?: string;
  
  // Transportation
  needsTransportation?: boolean;
  transportationDetails?: string;
  
  // Accommodation
  needsAccommodation?: boolean;
  accommodationDetails?: string;
  
  // Contact preference
  contactPreference: 'email' | 'phone' | 'text';
  
  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface EnhancedRSVPFormProps {
  onSubmit: (data: EnhancedRSVPFormData) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<EnhancedRSVPFormData>;
  maxPlusOnes?: number;
  // Section visibility toggles
  showAttendanceEvents?: boolean;
  showTransportation?: boolean;
  showAccommodation?: boolean;
  showSongRequests?: boolean;
  showPlusOnes?: boolean;
  showDietaryRestrictions?: boolean;
  showContactPreference?: boolean;
  showEmergencyContact?: boolean;
  showSpecialRequests?: boolean;
  showMessage?: boolean;
  allowPlusOnes?: boolean;
  submitLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const EnhancedRSVPForm: React.FC<EnhancedRSVPFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  maxPlusOnes = 2,
  showAttendanceEvents = true,
  showTransportation = true,
  showAccommodation = true,
  showSongRequests = true,
  showPlusOnes = true,
  showDietaryRestrictions = true,
  showContactPreference = true,
  showEmergencyContact = true,
  showSpecialRequests = true,
  showMessage = true,
  allowPlusOnes = true,
  submitLabel,
  primaryColor,
  secondaryColor,
}) => {
  const t = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<EnhancedRSVPFormData>({
    defaultValues: {
      rsvpStatus: '',
      attendingCeremony: true,
      attendingReception: true,
      plusOnes: [],
      contactPreference: 'email',
      needsTransportation: false,
      needsAccommodation: false,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plusOnes',
  });

  const rsvpStatus = watch('rsvpStatus');
  const needsTransportation = watch('needsTransportation');
  const needsAccommodation = watch('needsAccommodation');

  const addPlusOne = () => {
    if (fields.length < maxPlusOnes) {
      append({ firstName: '', lastName: '', dietaryRestrictions: '' });
    }
  };

  const removePlusOne = (index: number) => {
    remove(index);
  };

  const isAttending = rsvpStatus === 'attending';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* RSVP Status */}
      <FormSection>
        <SectionTitle>{t.rsvp.willYouBeAttending}</SectionTitle>
        <RsvpOptionGrid>
          <OptionCard $active={rsvpStatus === 'attending'}>
            <input
              type="radio"
              value="attending"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <OptionText>
              <OptionTitle>{t.rsvp.yesIllBeThere}</OptionTitle>
              <OptionSubtitle>{t.rsvp.cantWaitToCelebrate}</OptionSubtitle>
            </OptionText>
          </OptionCard>

          <OptionCard $active={rsvpStatus === 'not_attending'}>
            <input
              type="radio"
              value="not_attending"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <OptionText>
              <OptionTitle>{t.rsvp.sorryCannotMakeIt}</OptionTitle>
              <OptionSubtitle>{t.rsvp.willBeThereInSpirit}</OptionSubtitle>
            </OptionText>
          </OptionCard>

          <OptionCard $active={rsvpStatus === 'maybe'}>
            <input
              type="radio"
              value="maybe"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <OptionText>
              <OptionTitle>{t.rsvp.maybe}</OptionTitle>
              <OptionSubtitle>{t.rsvp.stillFiguringOut}</OptionSubtitle>
            </OptionText>
          </OptionCard>
        </RsvpOptionGrid>
        {errors.rsvpStatus && (
          <ErrorMessage>{errors.rsvpStatus.message}</ErrorMessage>
        )}
      </FormSection>

      {/* Ceremony and Reception Attendance (only if attending) */}
      {isAttending && showAttendanceEvents && (
        <FormSection>
          <SectionTitle>{t.rsvp.whichEventsWillYouAttend}</SectionTitle>
          <CheckboxGroup>
            <CheckboxOption>
              <input
                type="checkbox"
                {...register('attendingCeremony')}
              />
              {t.rsvp.weddingCeremony}
            </CheckboxOption>
            <CheckboxOption>
              <input
                type="checkbox"
                {...register('attendingReception')}
              />
              {t.rsvp.weddingReception}
            </CheckboxOption>
          </CheckboxGroup>
        </FormSection>
      )}

      {/* Plus Ones (only if attending and allowed) */}
      {isAttending && allowPlusOnes && showPlusOnes && (
        <FormSection>
          <SectionTitle>
            <span>{t.rsvp.plusOnes}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'inherit' }}>
              ({t.rsvp.maximum} {maxPlusOnes})
            </span>
          </SectionTitle>
          
          {fields.map((field, index) => (
            <PlusOneCard key={field.id}>
              <PlusOneHeader>
                <PlusOneTitle>{t.rsvp.plusOne} {index + 1}</PlusOneTitle>
                <RemoveButton onClick={() => removePlusOne(index)} type="button">
                  <Minus size={14} />
                  {t.rsvp.remove}
                </RemoveButton>
              </PlusOneHeader>
              
              <InputGroup>
                <InputField>
                  <Label>{t.rsvp.firstName} *</Label>
                  <Input
                    {...register(`plusOnes.${index}.firstName`, {
                      required: t.rsvp.firstNameRequired,
                    })}
                    placeholder={t.rsvp.enterFirstName}
                  />
                  {errors.plusOnes?.[index]?.firstName && (
                    <ErrorMessage>{errors.plusOnes[index]?.firstName?.message}</ErrorMessage>
                  )}
                </InputField>
                
                <InputField>
                  <Label>{t.rsvp.lastName} *</Label>
                  <Input
                    {...register(`plusOnes.${index}.lastName`, {
                      required: t.rsvp.lastNameRequired,
                    })}
                    placeholder={t.rsvp.enterLastName}
                  />
                  {errors.plusOnes?.[index]?.lastName && (
                    <ErrorMessage>{errors.plusOnes[index]?.lastName?.message}</ErrorMessage>
                  )}
                </InputField>
              </InputGroup>
              
              <InputField>
                <Label>{t.rsvp.dietaryRestrictionsOptional}</Label>
                <Input
                  {...register(`plusOnes.${index}.dietaryRestrictions`)}
                  placeholder={t.rsvp.anyDietaryRestrictions}
                />
              </InputField>
            </PlusOneCard>
          ))}
          
          {fields.length < maxPlusOnes && (
            <AddPlusOneButton onClick={addPlusOne} type="button">
              <Plus size={16} />
              {t.rsvp.addGuest}
            </AddPlusOneButton>
          )}
        </FormSection>
      )}

      {/* Dietary Restrictions */}
      {isAttending && showDietaryRestrictions && (
        <FormSection>
          <SectionTitle>
            <UtensilsCrossed size={20} />
            {t.rsvp.dietaryRestrictionsOptional}
          </SectionTitle>
          <InputField>
            <Label>{t.rsvp.anyDietaryRestrictions}</Label>
            <TextArea
              {...register('dietaryRestrictions')}
              placeholder={t.rsvp.anyDietaryRestrictions}
              rows={3}
            />
            <InfoText>
              {t.rsvp.dietaryInfo}
            </InfoText>
          </InputField>
        </FormSection>
      )}

      {/* Song Requests */}
      {isAttending && showSongRequests && (
        <FormSection>
          <SectionTitle>
            <Music size={20} />
            {t.rsvp.songRequests}
          </SectionTitle>
          <InputField>
            <Label>{t.rsvp.songRequestsPlaceholder}</Label>
            <TextArea
              {...register('songRequests')}
              placeholder={t.rsvp.songRequestsPlaceholder}
              rows={3}
            />
            <InfoText>
              {t.rsvp.songInfo}
            </InfoText>
          </InputField>
        </FormSection>
      )}

      {/* Transportation */}
      {isAttending && showTransportation && (
        <FormSection>
          <SectionTitle>{t.rsvp.transportation}</SectionTitle>
          <CheckboxOption>
            <input
              type="checkbox"
              {...register('needsTransportation')}
            />
            {t.rsvp.needTransportation}
          </CheckboxOption>
          
          {needsTransportation && (
            <InputField style={{ marginTop: '1rem' }}>
              <Label>{t.rsvp.transportationDetails}</Label>
              <TextArea
                {...register('transportationDetails')}
                placeholder={t.rsvp.provideTransportationDetails}
                rows={2}
              />
            </InputField>
          )}
        </FormSection>
      )}

      {/* Accommodation */}
      {isAttending && showAccommodation && (
        <FormSection>
          <SectionTitle>{t.rsvp.accommodation}</SectionTitle>
          <CheckboxOption>
            <input
              type="checkbox"
              {...register('needsAccommodation')}
            />
            {t.rsvp.needAccommodation}
          </CheckboxOption>
          
          {needsAccommodation && (
            <InputField style={{ marginTop: '1rem' }}>
              <Label>{t.rsvp.accommodationDetails}</Label>
              <TextArea
                {...register('accommodationDetails')}
                placeholder={t.rsvp.provideAccommodationDetails}
                rows={2}
              />
            </InputField>
          )}
        </FormSection>
      )}

      {/* Contact Preference */}
      {showContactPreference && (
        <FormSection>
          <SectionTitle>{t.rsvp.contactPreference}</SectionTitle>
          <InputField>
            <Label>{t.rsvp.contactPreferenceLabel}</Label>
            <Select {...register('contactPreference')}>
              <option value="email">{t.rsvp.email}</option>
              <option value="phone">{t.rsvp.phoneCall}</option>
              <option value="text">{t.rsvp.textMessage}</option>
            </Select>
          </InputField>
        </FormSection>
      )}

      {/* Emergency Contact (if attending) */}
      {isAttending && showEmergencyContact && (
        <FormSection>
          <SectionTitle>{t.rsvp.emergencyContactOptional}</SectionTitle>
          <InputGroup>
            <InputField>
              <Label>{t.rsvp.emergencyContactName}</Label>
              <Input
                {...register('emergencyContactName')}
                placeholder={t.rsvp.enterName}
              />
            </InputField>
            <InputField>
              <Label>{t.rsvp.emergencyContactPhone}</Label>
              <Input
                {...register('emergencyContactPhone')}
                placeholder={t.rsvp.enterPhoneNumber}
                type="tel"
              />
            </InputField>
          </InputGroup>
        </FormSection>
      )}

      {/* Special Requests */}
      {showSpecialRequests && (
        <FormSection>
          <SectionTitle>{t.rsvp.specialRequestsTitle}</SectionTitle>
          <InputField>
            <Label>{t.rsvp.specialRequestsLabel}</Label>
            <TextArea
              {...register('specialRequests')}
              placeholder={t.rsvp.specialRequestsPlaceholder}
              rows={3}
            />
          </InputField>
        </FormSection>
      )}

      {/* Personal Message */}
      {showMessage && (
        <FormSection>
          <SectionTitle>
            <MessageSquare size={20} />
            {t.rsvp.additionalMessage}
          </SectionTitle>
          <InputField>
            <Label>{t.rsvp.shareSpecialMessage}</Label>
            <TextArea
              {...register('message')}
              placeholder={t.rsvp.shareSpecialMessage}
              rows={4}
            />
            <InfoText>
              {t.rsvp.heartfeltMessage}
            </InfoText>
          </InputField>
        </FormSection>
      )}

      {/* Submit Button */}
      <SubmitButton
        type="submit"
        disabled={isSubmitting}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      >
        {isSubmitting ? t.rsvp.submitting : (submitLabel || t.rsvp.submit)}
      </SubmitButton>
    </form>
  );
};
