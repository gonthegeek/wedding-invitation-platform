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
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlusOneSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9fafb;
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
  color: #374151;
`;

const RemoveButton = styled.button`
  background: #dc2626;
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
    background: #b91c1c;
  }
`;

const AddPlusOneButton = styled.button`
  background: #3b82f6;
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
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
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
  color: #374151;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
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

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
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
  showTransportation?: boolean;
  showAccommodation?: boolean;
  showSongRequests?: boolean;
  allowPlusOnes?: boolean;
}

export const EnhancedRSVPForm: React.FC<EnhancedRSVPFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  maxPlusOnes = 2,
  showTransportation = true,
  showAccommodation = true,
  showSongRequests = true,
  allowPlusOnes = true,
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem', 
            border: `2px solid ${rsvpStatus === 'attending' ? '#3b82f6' : '#e5e7eb'}`, 
            borderRadius: '8px',
            cursor: 'pointer',
            background: rsvpStatus === 'attending' ? '#eff6ff' : 'white'
          }}>
            <input
              type="radio"
              value="attending"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                {t.rsvp.yesIllBeThere}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {t.rsvp.cantWaitToCelebrate}
              </div>
            </div>
          </label>

          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem', 
            border: `2px solid ${rsvpStatus === 'not_attending' ? '#3b82f6' : '#e5e7eb'}`, 
            borderRadius: '8px',
            cursor: 'pointer',
            background: rsvpStatus === 'not_attending' ? '#eff6ff' : 'white'
          }}>
            <input
              type="radio"
              value="not_attending"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                {t.rsvp.sorryCannotMakeIt}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {t.rsvp.willBeThereInSpirit}
              </div>
            </div>
          </label>

          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem', 
            border: `2px solid ${rsvpStatus === 'maybe' ? '#3b82f6' : '#e5e7eb'}`, 
            borderRadius: '8px',
            cursor: 'pointer',
            background: rsvpStatus === 'maybe' ? '#eff6ff' : 'white'
          }}>
            <input
              type="radio"
              value="maybe"
              {...register('rsvpStatus', { required: t.rsvp.pleaseSelectAttendanceStatus })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                {t.rsvp.maybe}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {t.rsvp.stillFiguringOut}
              </div>
            </div>
          </label>
        </div>
        {errors.rsvpStatus && (
          <ErrorMessage>{errors.rsvpStatus.message}</ErrorMessage>
        )}
      </FormSection>

      {/* Ceremony and Reception Attendance (only if attending) */}
      {isAttending && (
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
      {isAttending && allowPlusOnes && (
        <FormSection>
          <SectionTitle>
            <span>{t.rsvp.plusOnes}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280' }}>
              ({t.rsvp.maximum} {maxPlusOnes})
            </span>
          </SectionTitle>
          
          {fields.map((field, index) => (
            <PlusOneSection key={field.id}>
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
            </PlusOneSection>
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
      {isAttending && (
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

      {/* Emergency Contact (if attending) */}
      {isAttending && (
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

      {/* Personal Message */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '1rem 2rem',
          background: isSubmitting ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          marginTop: '1rem',
        }}
      >
        {isSubmitting ? t.rsvp.submitting : t.rsvp.submit}
      </button>
    </form>
  );
};
