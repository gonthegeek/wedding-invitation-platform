import React from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, Music, MessageSquare, UtensilsCrossed } from 'lucide-react';

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
        <SectionTitle>Will you be attending?</SectionTitle>
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
              {...register('rsvpStatus', { required: 'Please select your attendance status' })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                Yes, I'll be there!
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Can't wait to celebrate with you
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
              {...register('rsvpStatus', { required: 'Please select your attendance status' })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                Sorry, can't make it
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Will be there in spirit
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
              {...register('rsvpStatus', { required: 'Please select your attendance status' })}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                Maybe
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Still figuring it out
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
          <SectionTitle>Which events will you attend?</SectionTitle>
          <CheckboxGroup>
            <CheckboxOption>
              <input
                type="checkbox"
                {...register('attendingCeremony')}
              />
              Wedding Ceremony
            </CheckboxOption>
            <CheckboxOption>
              <input
                type="checkbox"
                {...register('attendingReception')}
              />
              Wedding Reception
            </CheckboxOption>
          </CheckboxGroup>
        </FormSection>
      )}

      {/* Plus Ones (only if attending and allowed) */}
      {isAttending && allowPlusOnes && (
        <FormSection>
          <SectionTitle>
            <span>Plus Ones</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280' }}>
              (Maximum {maxPlusOnes})
            </span>
          </SectionTitle>
          
          {fields.map((field, index) => (
            <PlusOneSection key={field.id}>
              <PlusOneHeader>
                <PlusOneTitle>Plus One {index + 1}</PlusOneTitle>
                <RemoveButton onClick={() => removePlusOne(index)} type="button">
                  <Minus size={14} />
                  Remove
                </RemoveButton>
              </PlusOneHeader>
              
              <InputGroup>
                <InputField>
                  <Label>First Name *</Label>
                  <Input
                    {...register(`plusOnes.${index}.firstName`, {
                      required: 'First name is required',
                    })}
                    placeholder="Enter first name"
                  />
                  {errors.plusOnes?.[index]?.firstName && (
                    <ErrorMessage>{errors.plusOnes[index]?.firstName?.message}</ErrorMessage>
                  )}
                </InputField>
                
                <InputField>
                  <Label>Last Name *</Label>
                  <Input
                    {...register(`plusOnes.${index}.lastName`, {
                      required: 'Last name is required',
                    })}
                    placeholder="Enter last name"
                  />
                  {errors.plusOnes?.[index]?.lastName && (
                    <ErrorMessage>{errors.plusOnes[index]?.lastName?.message}</ErrorMessage>
                  )}
                </InputField>
              </InputGroup>
              
              <InputField>
                <Label>Dietary Restrictions</Label>
                <Input
                  {...register(`plusOnes.${index}.dietaryRestrictions`)}
                  placeholder="e.g., Vegetarian, Gluten-free, Allergies..."
                />
              </InputField>
            </PlusOneSection>
          ))}
          
          {fields.length < maxPlusOnes && (
            <AddPlusOneButton onClick={addPlusOne} type="button">
              <Plus size={16} />
              Add Plus One
            </AddPlusOneButton>
          )}
        </FormSection>
      )}

      {/* Dietary Restrictions */}
      {isAttending && (
        <FormSection>
          <SectionTitle>
            <UtensilsCrossed size={20} />
            Dietary Restrictions & Allergies
          </SectionTitle>
          <InputField>
            <Label>Do you have any dietary restrictions or food allergies?</Label>
            <TextArea
              {...register('dietaryRestrictions')}
              placeholder="Please list any dietary restrictions, allergies, or special meal requests..."
              rows={3}
            />
            <InfoText>
              This helps us ensure everyone has a delicious meal they can enjoy!
            </InfoText>
          </InputField>
        </FormSection>
      )}

      {/* Song Requests */}
      {isAttending && showSongRequests && (
        <FormSection>
          <SectionTitle>
            <Music size={20} />
            Song Requests
          </SectionTitle>
          <InputField>
            <Label>Any songs you'd love to hear at the reception?</Label>
            <TextArea
              {...register('songRequests')}
              placeholder="Share your favorite songs that will get you on the dance floor..."
              rows={3}
            />
            <InfoText>
              Help us create the perfect playlist for an unforgettable celebration!
            </InfoText>
          </InputField>
        </FormSection>
      )}

      {/* Transportation */}
      {isAttending && showTransportation && (
        <FormSection>
          <SectionTitle>Transportation</SectionTitle>
          <CheckboxOption>
            <input
              type="checkbox"
              {...register('needsTransportation')}
            />
            I would like information about transportation options
          </CheckboxOption>
          
          {needsTransportation && (
            <InputField style={{ marginTop: '1rem' }}>
              <Label>Transportation Details</Label>
              <TextArea
                {...register('transportationDetails')}
                placeholder="Let us know your transportation needs or questions..."
                rows={2}
              />
            </InputField>
          )}
        </FormSection>
      )}

      {/* Accommodation */}
      {isAttending && showAccommodation && (
        <FormSection>
          <SectionTitle>Accommodation</SectionTitle>
          <CheckboxOption>
            <input
              type="checkbox"
              {...register('needsAccommodation')}
            />
            I would like information about recommended accommodations
          </CheckboxOption>
          
          {needsAccommodation && (
            <InputField style={{ marginTop: '1rem' }}>
              <Label>Accommodation Preferences</Label>
              <TextArea
                {...register('accommodationDetails')}
                placeholder="Let us know your accommodation preferences or special needs..."
                rows={2}
              />
            </InputField>
          )}
        </FormSection>
      )}

      {/* Contact Preference */}
      <FormSection>
        <SectionTitle>Contact Preference</SectionTitle>
        <InputField>
          <Label>How would you prefer to receive wedding updates?</Label>
          <Select {...register('contactPreference')}>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="text">Text Message</option>
          </Select>
        </InputField>
      </FormSection>

      {/* Emergency Contact (if attending) */}
      {isAttending && (
        <FormSection>
          <SectionTitle>Emergency Contact (Optional)</SectionTitle>
          <InputGroup>
            <InputField>
              <Label>Emergency Contact Name</Label>
              <Input
                {...register('emergencyContactName')}
                placeholder="Enter name"
              />
            </InputField>
            <InputField>
              <Label>Emergency Contact Phone</Label>
              <Input
                {...register('emergencyContactPhone')}
                placeholder="Enter phone number"
                type="tel"
              />
            </InputField>
          </InputGroup>
        </FormSection>
      )}

      {/* Special Requests */}
      <FormSection>
        <SectionTitle>Special Requests</SectionTitle>
        <InputField>
          <Label>Any special requests or accommodations needed?</Label>
          <TextArea
            {...register('specialRequests')}
            placeholder="Accessibility needs, seating preferences, or any other special requests..."
            rows={3}
          />
        </InputField>
      </FormSection>

      {/* Personal Message */}
      <FormSection>
        <SectionTitle>
          <MessageSquare size={20} />
          Message for the Couple
        </SectionTitle>
        <InputField>
          <Label>Share a message, memory, or well wishes (Optional)</Label>
          <TextArea
            {...register('message')}
            placeholder="Share your excitement, a favorite memory, or well wishes for the happy couple..."
            rows={4}
          />
          <InfoText>
            Your heartfelt words mean the world to us! ❤️
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
        {isSubmitting ? 'Submitting RSVP...' : 'Submit RSVP'}
      </button>
    </form>
  );
};
