import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { Wedding } from '../../../types';

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: #1f2937;
  font-weight: 500;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${props => props.color};
  border: 1px solid #e5e7eb;
  display: inline-block;
  margin-left: 0.5rem;
`;

const TemplatePreview = styled.div<{ primaryColor: string; secondaryColor: string; fontFamily: string }>`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 1rem;
  text-align: center;
  background: linear-gradient(135deg, ${props => props.primaryColor}10, ${props => props.secondaryColor}10);
  font-family: ${props => props.fontFamily}, sans-serif;

  .preview-title {
    font-size: 2rem;
    font-weight: 600;
    color: ${props => props.primaryColor};
    margin-bottom: 1rem;
  }

  .preview-names {
    font-size: 1.5rem;
    color: ${props => props.secondaryColor};
    margin-bottom: 1rem;
  }

  .preview-date {
    font-size: 1.125rem;
    color: #6b7280;
  }
`;

export default function ReviewStep() {
  const { watch } = useFormContext<Partial<Wedding>>();

  const formData = watch();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <StepContainer>
      <h2 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '1rem' }}>
        Review Your Wedding Invitation
      </h2>
      
      <ReviewCard>
        <SectionTitle>Couple Information</SectionTitle>
        <InfoRow>
          <InfoLabel>Bride:</InfoLabel>
          <InfoValue>{formData.brideFirstName} {formData.brideLastName}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Groom:</InfoLabel>
          <InfoValue>{formData.groomFirstName} {formData.groomLastName}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Wedding Date:</InfoLabel>
          <InfoValue>{formatDate(formData.weddingDate)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Invitation URL:</InfoLabel>
          <InfoValue>{formData.subdomain}.yourweddingdomain.com</InfoValue>
        </InfoRow>
      </ReviewCard>

      <ReviewCard>
        <SectionTitle>Ceremony Details</SectionTitle>
        <InfoRow>
          <InfoLabel>Time:</InfoLabel>
          <InfoValue>{formatTime(formData.ceremonyTime)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Venue:</InfoLabel>
          <InfoValue>{formData.ceremonyLocation?.name}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Address:</InfoLabel>
          <InfoValue>
            {formData.ceremonyLocation?.address}, {formData.ceremonyLocation?.city}, {formData.ceremonyLocation?.state} {formData.ceremonyLocation?.zipCode}
          </InfoValue>
        </InfoRow>
      </ReviewCard>

      <ReviewCard>
        <SectionTitle>Reception Details</SectionTitle>
        <InfoRow>
          <InfoLabel>Time:</InfoLabel>
          <InfoValue>{formatTime(formData.receptionTime)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Venue:</InfoLabel>
          <InfoValue>{formData.receptionLocation?.name}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Address:</InfoLabel>
          <InfoValue>
            {formData.receptionLocation?.address}, {formData.receptionLocation?.city}, {formData.receptionLocation?.state} {formData.receptionLocation?.zipCode}
          </InfoValue>
        </InfoRow>
      </ReviewCard>

      <ReviewCard>
        <SectionTitle>Design & Template</SectionTitle>
        <InfoRow>
          <InfoLabel>Template:</InfoLabel>
          <InfoValue>{formData.template?.templateId}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Primary Color:</InfoLabel>
          <InfoValue>
            {formData.template?.primaryColor}
            <ColorPreview color={formData.template?.primaryColor || '#3b82f6'} />
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Secondary Color:</InfoLabel>
          <InfoValue>
            {formData.template?.secondaryColor}
            <ColorPreview color={formData.template?.secondaryColor || '#1f2937'} />
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Font:</InfoLabel>
          <InfoValue>{formData.template?.fontFamily}</InfoValue>
        </InfoRow>
        {formData.settings?.welcomeMessage && (
          <InfoRow>
            <InfoLabel>Welcome Message:</InfoLabel>
            <InfoValue style={{ fontStyle: 'italic' }}>"{formData.settings.welcomeMessage}"</InfoValue>
          </InfoRow>
        )}
      </ReviewCard>

      <ReviewCard>
        <SectionTitle>Invitation Preview</SectionTitle>
        <TemplatePreview
          primaryColor={formData.template?.primaryColor || '#3b82f6'}
          secondaryColor={formData.template?.secondaryColor || '#1f2937'}
          fontFamily={formData.template?.fontFamily || 'Inter'}
        >
          <div className="preview-title">You're Invited!</div>
          <div className="preview-names">
            {formData.brideFirstName} & {formData.groomFirstName}
          </div>
          <div className="preview-date">
            {formatDate(formData.weddingDate)}
          </div>
          {formData.settings?.welcomeMessage && (
            <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '1rem' }}>
              {formData.settings.welcomeMessage}
            </div>
          )}
        </TemplatePreview>
      </ReviewCard>
    </StepContainer>
  );
}
