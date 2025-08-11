import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { Wedding } from '../../../types';
import { useTranslation } from '../../../hooks/useLanguage';

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
  const t = useTranslation();

  return (
    <StepContainer>
      <div>
        <SectionTitle>{t.wizard?.ceremonyDetails || 'Ceremony Details'}</SectionTitle>
        
        <LocationSection>
          <FormRow>
            <FormGroup>
              <Label htmlFor="ceremonyTime">{t.wedding.ceremonyTime}</Label>
              <Input
                {...register('ceremonyTime')}
                id="ceremonyTime"
                type="time"
                className={errors.ceremonyTime ? 'error' : ''}
              />
              {errors.ceremonyTime && (
                <ErrorMessage>{errors.ceremonyTime.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.name">{t.customization.venueName}</Label>
              <Input
                {...register('ceremonyLocation.name')}
                id="ceremonyLocation.name"
                type="text"
                className={errors.ceremonyLocation?.name ? 'error' : ''}
                placeholder={t.wizard?.venueNamePlaceholder || 'Enter venue name'}
              />
              {errors.ceremonyLocation?.name && (
                <ErrorMessage>{errors.ceremonyLocation.name.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.address">{t.customization.venueAddress}</Label>
              <Input
                {...register('ceremonyLocation.address')}
                id="ceremonyLocation.address"
                type="text"
                className={errors.ceremonyLocation?.address ? 'error' : ''}
                placeholder={t.wizard?.addressPlaceholder || 'Enter address'}
              />
              {errors.ceremonyLocation?.address && (
                <ErrorMessage>{errors.ceremonyLocation.address.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.city">{t.customization.city}</Label>
              <Input
                {...register('ceremonyLocation.city')}
                id="ceremonyLocation.city"
                type="text"
                className={errors.ceremonyLocation?.city ? 'error' : ''}
                placeholder={t.wizard?.cityPlaceholder || 'Enter city'}
              />
              {errors.ceremonyLocation?.city && (
                <ErrorMessage>{errors.ceremonyLocation.city.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.state">{t.customization.state}</Label>
              <Input
                {...register('ceremonyLocation.state')}
                id="ceremonyLocation.state"
                type="text"
                className={errors.ceremonyLocation?.state ? 'error' : ''}
                placeholder={t.wizard?.statePlaceholder || 'Enter state'}
              />
              {errors.ceremonyLocation?.state && (
                <ErrorMessage>{errors.ceremonyLocation.state.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ceremonyLocation.zipCode">{t.customization.zipCode}</Label>
              <Input
                {...register('ceremonyLocation.zipCode')}
                id="ceremonyLocation.zipCode"
                type="text"
                className={errors.ceremonyLocation?.zipCode ? 'error' : ''}
                placeholder={t.wizard?.zipPlaceholder || 'Enter zip code'}
              />
              {errors.ceremonyLocation?.zipCode && (
                <ErrorMessage>{errors.ceremonyLocation.zipCode.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="ceremonyLocation.googleMapsUrl">{t.customization.googleMapsOptional}</Label>
              <Input
                {...register('ceremonyLocation.googleMapsUrl')}
                id="ceremonyLocation.googleMapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                {t.wizard?.googleMapsHint || 'Go to Google Maps, search your venue, click "Share" and copy the link'}
              </small>
            </FormGroup>
          </FormRow>
        </LocationSection>
      </div>

      <div>
        <SectionTitle>{t.wizard?.receptionDetails || 'Reception Details'}</SectionTitle>
        
        <LocationSection>
          <FormRow>
            <FormGroup>
              <Label htmlFor="receptionTime">{t.wedding.receptionTime}</Label>
              <Input
                {...register('receptionTime')}
                id="receptionTime"
                type="time"
                className={errors.receptionTime ? 'error' : ''}
              />
              {errors.receptionTime && (
                <ErrorMessage>{errors.receptionTime.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.name">{t.customization.venueName}</Label>
              <Input
                {...register('receptionLocation.name')}
                id="receptionLocation.name"
                type="text"
                className={errors.receptionLocation?.name ? 'error' : ''}
                placeholder={t.wizard?.venueNamePlaceholder || 'Enter venue name'}
              />
              {errors.receptionLocation?.name && (
                <ErrorMessage>{errors.receptionLocation.name.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.address">{t.customization.venueAddress}</Label>
              <Input
                {...register('receptionLocation.address')}
                id="receptionLocation.address"
                type="text"
                className={errors.receptionLocation?.address ? 'error' : ''}
                placeholder={t.wizard?.addressPlaceholder || 'Enter address'}
              />
              {errors.receptionLocation?.address && (
                <ErrorMessage>{errors.receptionLocation.address.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.city">{t.customization.city}</Label>
              <Input
                {...register('receptionLocation.city')}
                id="receptionLocation.city"
                type="text"
                className={errors.receptionLocation?.city ? 'error' : ''}
                placeholder={t.wizard?.cityPlaceholder || 'Enter city'}
              />
              {errors.receptionLocation?.city && (
                <ErrorMessage>{errors.receptionLocation.city.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.state">{t.customization.state}</Label>
              <Input
                {...register('receptionLocation.state')}
                id="receptionLocation.state"
                type="text"
                className={errors.receptionLocation?.state ? 'error' : ''}
                placeholder={t.wizard?.statePlaceholder || 'Enter state'}
              />
              {errors.receptionLocation?.state && (
                <ErrorMessage>{errors.receptionLocation.state.message as string}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="receptionLocation.zipCode">{t.customization.zipCode}</Label>
              <Input
                {...register('receptionLocation.zipCode')}
                id="receptionLocation.zipCode"
                type="text"
                className={errors.receptionLocation?.zipCode ? 'error' : ''}
                placeholder={t.wizard?.zipPlaceholder || 'Enter zip code'}
              />
              {errors.receptionLocation?.zipCode && (
                <ErrorMessage>{errors.receptionLocation.zipCode.message as string}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="receptionLocation.googleMapsUrl">{t.customization.googleMapsOptional}</Label>
              <Input
                {...register('receptionLocation.googleMapsUrl')}
                id="receptionLocation.googleMapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                {t.wizard?.googleMapsHint || 'Go to Google Maps, search your venue, click "Share" and copy the link'}
              </small>
            </FormGroup>
          </FormRow>
        </LocationSection>
      </div>
    </StepContainer>
  );
}
