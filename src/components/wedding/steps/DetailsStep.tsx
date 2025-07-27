import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { Wedding } from '../../../types';

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const LocationSection = styled.div`
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

export default function DetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Partial<Wedding>>();

  return (
    <StepContainer>
      <div>
        <SectionTitle>Ceremony Details</SectionTitle>
        
        <LocationSection>
          <FormRow>
            <FormGroup>
              <Label htmlFor="ceremonyTime">Ceremony Time</Label>
              <Input
                {...register('ceremonyTime')}
                id="ceremonyTime"
                type="time"
                className={errors.ceremonyTime ? 'error' : ''}
              />
              {errors.ceremonyTime && (
                <ErrorMessage>{errors.ceremonyTime.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.name">Venue Name</Label>
              <Input
                {...register('ceremonyLocation.name')}
                id="ceremonyLocation.name"
                type="text"
                className={errors.ceremonyLocation?.name ? 'error' : ''}
                placeholder="Enter ceremony venue name"
              />
              {errors.ceremonyLocation?.name && (
                <ErrorMessage>{errors.ceremonyLocation.name.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.address">Address</Label>
              <Input
                {...register('ceremonyLocation.address')}
                id="ceremonyLocation.address"
                type="text"
                className={errors.ceremonyLocation?.address ? 'error' : ''}
                placeholder="Enter ceremony venue address"
              />
              {errors.ceremonyLocation?.address && (
                <ErrorMessage>{errors.ceremonyLocation.address.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.city">City</Label>
              <Input
                {...register('ceremonyLocation.city')}
                id="ceremonyLocation.city"
                type="text"
                className={errors.ceremonyLocation?.city ? 'error' : ''}
                placeholder="Enter city"
              />
              {errors.ceremonyLocation?.city && (
                <ErrorMessage>{errors.ceremonyLocation.city.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.state">State</Label>
              <Input
                {...register('ceremonyLocation.state')}
                id="ceremonyLocation.state"
                type="text"
                className={errors.ceremonyLocation?.state ? 'error' : ''}
                placeholder="Enter state"
              />
              {errors.ceremonyLocation?.state && (
                <ErrorMessage>{errors.ceremonyLocation.state.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.zipCode">Zip Code</Label>
              <Input
                {...register('ceremonyLocation.zipCode')}
                id="ceremonyLocation.zipCode"
                type="text"
                className={errors.ceremonyLocation?.zipCode ? 'error' : ''}
                placeholder="Enter zip code"
              />
              {errors.ceremonyLocation?.zipCode && (
                <ErrorMessage>{errors.ceremonyLocation.zipCode.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.googleMapsUrl">Google Maps Link (Optional)</Label>
              <Input
                {...register('ceremonyLocation.googleMapsUrl')}
                id="ceremonyLocation.googleMapsUrl"
                type="url"
                placeholder="https://maps.google.com/... (paste from Google Maps)"
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Go to Google Maps, search your venue, click "Share" and copy the link
              </small>
            </FormGroup>
          </FormRow>
        </LocationSection>
      </div>

      <div>
        <SectionTitle>Reception Details</SectionTitle>
        
        <LocationSection>
          <FormRow>
            <FormGroup>
              <Label htmlFor="receptionTime">Reception Time</Label>
              <Input
                {...register('receptionTime')}
                id="receptionTime"
                type="time"
                className={errors.receptionTime ? 'error' : ''}
              />
              {errors.receptionTime && (
                <ErrorMessage>{errors.receptionTime.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.name">Venue Name</Label>
              <Input
                {...register('receptionLocation.name')}
                id="receptionLocation.name"
                type="text"
                className={errors.receptionLocation?.name ? 'error' : ''}
                placeholder="Enter reception venue name"
              />
              {errors.receptionLocation?.name && (
                <ErrorMessage>{errors.receptionLocation.name.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.address">Address</Label>
              <Input
                {...register('receptionLocation.address')}
                id="receptionLocation.address"
                type="text"
                className={errors.receptionLocation?.address ? 'error' : ''}
                placeholder="Enter reception venue address"
              />
              {errors.receptionLocation?.address && (
                <ErrorMessage>{errors.receptionLocation.address.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.city">City</Label>
              <Input
                {...register('receptionLocation.city')}
                id="receptionLocation.city"
                type="text"
                className={errors.receptionLocation?.city ? 'error' : ''}
                placeholder="Enter city"
              />
              {errors.receptionLocation?.city && (
                <ErrorMessage>{errors.receptionLocation.city.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.state">State</Label>
              <Input
                {...register('receptionLocation.state')}
                id="receptionLocation.state"
                type="text"
                className={errors.receptionLocation?.state ? 'error' : ''}
                placeholder="Enter state"
              />
              {errors.receptionLocation?.state && (
                <ErrorMessage>{errors.receptionLocation.state.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.zipCode">Zip Code</Label>
              <Input
                {...register('receptionLocation.zipCode')}
                id="receptionLocation.zipCode"
                type="text"
                className={errors.receptionLocation?.zipCode ? 'error' : ''}
                placeholder="Enter zip code"
              />
              {errors.receptionLocation?.zipCode && (
                <ErrorMessage>{errors.receptionLocation.zipCode.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.googleMapsUrl">Google Maps Link (Optional)</Label>
              <Input
                {...register('receptionLocation.googleMapsUrl')}
                id="receptionLocation.googleMapsUrl"
                type="url"
                placeholder="https://maps.google.com/... (paste from Google Maps)"
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Go to Google Maps, search your venue, click "Share" and copy the link
              </small>
            </FormGroup>
          </FormRow>
        </LocationSection>
      </div>
    </StepContainer>
  );
}
