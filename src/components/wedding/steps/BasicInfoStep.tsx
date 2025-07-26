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

const HelpText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export default function BasicInfoStep() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<Partial<Wedding>>();

  const brideFirstName = watch('brideFirstName');
  const groomFirstName = watch('groomFirstName');
  const subdomain = watch('subdomain');

  // Generate suggested subdomain
  const generateSubdomain = () => {
    if (brideFirstName && groomFirstName && typeof brideFirstName === 'string' && typeof groomFirstName === 'string') {
      return `${brideFirstName.toLowerCase()}and${groomFirstName.toLowerCase()}`.replace(/\s+/g, '');
    }
    return '';
  };

  return (
    <StepContainer>
      <div>
        <SectionTitle>Couple Information</SectionTitle>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="brideFirstName">Bride's First Name</Label>
            <Input
              {...register('brideFirstName')}
              id="brideFirstName"
              type="text"
              className={errors.brideFirstName ? 'error' : ''}
              placeholder="Enter bride's first name"
            />
            {errors.brideFirstName && (
              <ErrorMessage>{errors.brideFirstName.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="brideLastName">Bride's Last Name</Label>
            <Input
              {...register('brideLastName')}
              id="brideLastName"
              type="text"
              className={errors.brideLastName ? 'error' : ''}
              placeholder="Enter bride's last name"
            />
            {errors.brideLastName && (
              <ErrorMessage>{errors.brideLastName.message}</ErrorMessage>
            )}
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="groomFirstName">Groom's First Name</Label>
            <Input
              {...register('groomFirstName')}
              id="groomFirstName"
              type="text"
              className={errors.groomFirstName ? 'error' : ''}
              placeholder="Enter groom's first name"
            />
            {errors.groomFirstName && (
              <ErrorMessage>{errors.groomFirstName.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="groomLastName">Groom's Last Name</Label>
            <Input
              {...register('groomLastName')}
              id="groomLastName"
              type="text"
              className={errors.groomLastName ? 'error' : ''}
              placeholder="Enter groom's last name"
            />
            {errors.groomLastName && (
              <ErrorMessage>{errors.groomLastName.message}</ErrorMessage>
            )}
          </FormGroup>
        </FormRow>
      </div>

      <div>
        <SectionTitle>Wedding Details</SectionTitle>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="weddingDate">Wedding Date</Label>
            <Input
              {...register('weddingDate')}
              id="weddingDate"
              type="date"
              className={errors.weddingDate ? 'error' : ''}
            />
            {errors.weddingDate && (
              <ErrorMessage>{errors.weddingDate.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="subdomain">Invitation URL</Label>
            <Input
              {...register('subdomain')}
              id="subdomain"
              type="text"
              className={errors.subdomain ? 'error' : ''}
              placeholder={generateSubdomain() || 'yourwedding'}
            />
            <HelpText>
              Your invitation will be available at: {subdomain || generateSubdomain() || 'yourwedding'}.yourweddingdomain.com
            </HelpText>
            {errors.subdomain && (
              <ErrorMessage>{errors.subdomain.message}</ErrorMessage>
            )}
          </FormGroup>
        </FormRow>
      </div>
    </StepContainer>
  );
}
