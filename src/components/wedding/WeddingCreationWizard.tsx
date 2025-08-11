import { useState } from 'react';
import styled from 'styled-components';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '../../hooks/useWedding';
import type { Wedding } from '../../types';
import { useTranslation } from '../../hooks/useLanguage';

// Step components
import { BasicInfoStep, DetailsStep, DesignStep, ReviewStep } from './steps';

// Validation schemas for each step
const basicInfoSchema = yup.object({
  brideFirstName: yup.string().required('Bride first name is required'),
  brideLastName: yup.string().required('Bride last name is required'),
  groomFirstName: yup.string().required('Groom first name is required'),
  groomLastName: yup.string().required('Groom last name is required'),
  weddingDate: yup.date().required('Wedding date is required').min(new Date(), 'Wedding date must be in the future'),
  subdomain: yup.string().required('URL subdomain is required').matches(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
});

const detailsSchema = yup.object({
  ceremonyLocation: yup.object({
    name: yup.string().required('Ceremony venue name is required'),
    address: yup.string().required('Ceremony venue address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
  }),
  receptionLocation: yup.object({
    name: yup.string().required('Reception venue name is required'),
    address: yup.string().required('Reception venue address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
  }),
  ceremonyTime: yup.string().required('Ceremony time is required'),
  receptionTime: yup.string().required('Reception time is required'),
});

const designSchema = yup.object({
  template: yup.object({
    templateId: yup.string().required('Please select a template'),
    primaryColor: yup.string().required('Primary color is required'),
    secondaryColor: yup.string().required('Secondary color is required'),
    fontFamily: yup.string().required('Font family is required'),
  }),
  settings: yup.object({
    welcomeMessage: yup.string().max(500, 'Welcome message must be less than 500 characters'),
  }),
});

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 25%;
    right: 25%;
    height: 2px;
    background: #e5e7eb;
    z-index: 1;
  }
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isActive', 'isCompleted'].includes(prop),
})<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;

  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;

    ${props => props.isCompleted && `
      background: #10b981;
      color: white;
    `}

    ${props => props.isActive && !props.isCompleted && `
      background: #3b82f6;
      color: white;
    `}

    ${props => !props.isActive && !props.isCompleted && `
      background: #e5e7eb;
      color: #6b7280;
    `}
  }

  .step-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.isActive ? '#3b82f6' : '#6b7280'};
  }
`;

const StepContent = styled.div`
  min-height: 400px;
  margin-bottom: 2rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    
    &:hover:not(:disabled) {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const steps = [
  { key: 'basic', labelKey: 'stepBasicInfo' as const, schema: basicInfoSchema },
  { key: 'details', labelKey: 'stepDetails' as const, schema: detailsSchema },
  { key: 'design', labelKey: 'stepDesign' as const, schema: designSchema },
  { key: 'review', labelKey: 'stepReview' as const, schema: yup.object() },
];

export default function WeddingCreationWizard() {
  const t = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { createWedding, loading } = useWedding();
  const navigate = useNavigate();

  const methods = useForm<Partial<Wedding>>({
    resolver: yupResolver(steps[currentStep].schema),
    mode: 'onChange',
    defaultValues: {
      brideFirstName: '',
      brideLastName: '',
      groomFirstName: '',
      groomLastName: '',
      ceremonyLocation: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      receptionLocation: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      ceremonyTime: '',
      receptionTime: '',
      template: {
        templateId: 'classic',
        primaryColor: '#3b82f6',
        secondaryColor: '#1f2937',
        fontFamily: 'Inter',
      },
      settings: {
        allowPlusOnes: true,
        allowChildrenAttendance: true,
        requireRSVPDeadline: new Date(),
        sendEmailNotifications: true,
        allowGiftRegistry: false,
        isPublic: true,
        requireApproval: false,
      },
    },
  });

  const { handleSubmit, trigger, formState: { isValid } } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    
    if (isStepValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const onSubmit = async (data: Partial<Wedding>) => {
    const id = await createWedding(data);
    if (id) {
      navigate(`/weddings/${id}`);
    }
  };

  return (
    <WizardContainer>
      <h1 style={{ textAlign: 'center', color: '#111827', marginBottom: '2rem' }}>
        {t.wizard?.title || 'Create Your Wedding Invitation'}
      </h1>

      <StepIndicator>
        {steps.map((s, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = completedSteps.includes(idx);
          return (
            <Step
              key={s.key}
              isActive={isActive}
              isCompleted={isCompleted}
              onClick={() => handleStepClick(idx)}
              style={{ cursor: idx <= currentStep || isCompleted ? 'pointer' : 'default', width: '25%' }}
            >
              <div className="step-circle">{idx + 1}</div>
              <div className="step-label">{t.wizard?.[s.labelKey] || s.key}</div>
            </Step>
          );
        })}
      </StepIndicator>

      <FormProvider {...methods}>
        <StepContent>
          {currentStep === 0 && <BasicInfoStep />}
          {currentStep === 1 && <DetailsStep />}
          {currentStep === 2 && <DesignStep />}
          {currentStep === 3 && <ReviewStep />}
        </StepContent>

        <NavigationButtons>
          <Button variant="secondary" onClick={handlePrevious} disabled={currentStep === 0}>
            {t.wizard?.previous || 'Previous'}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext} disabled={!isValid}>
              {t.wizard?.next || 'Next'}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>
              {loading && <LoadingSpinner />}
              {t.wizard?.createWedding || 'Create Wedding'}
            </Button>
          )}
        </NavigationButtons>
      </FormProvider>
    </WizardContainer>
  );
}
