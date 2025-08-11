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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
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

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TemplateCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? '#f0f9ff' : 'white'};

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  .template-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .template-description {
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

const ColorPreview = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.color};
  border: 1px solid #e5e7eb;
  margin-top: 0.5rem;
`;

const ColorGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
`;

export default function DesignStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<Partial<Wedding>>();
  const t = useTranslation();

  const templates = [
    { id: 'classic', name: t.wizard?.templateClassicName || 'Classic', description: t.wizard?.templateClassicDesc || 'Elegant and timeless design' },
    { id: 'modern', name: t.wizard?.templateModernName || 'Modern', description: t.wizard?.templateModernDesc || 'Clean and contemporary style' },
    { id: 'rustic', name: t.wizard?.templateRusticName || 'Rustic', description: t.wizard?.templateRusticDesc || 'Natural and cozy feel' },
    { id: 'elegant', name: t.wizard?.templateElegantName || 'Elegant', description: t.wizard?.templateElegantDesc || 'Sophisticated and luxurious' },
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern Sans-serif)' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
    { value: 'Dancing Script', label: 'Dancing Script (Script)' },
    { value: 'Montserrat', label: 'Montserrat (Clean Sans-serif)' },
    { value: 'Crimson Text', label: 'Crimson Text (Classic Serif)' },
  ];

  const selectedTemplate = watch('template.templateId');
  const primaryColor = watch('template.primaryColor');
  const secondaryColor = watch('template.secondaryColor');

  const handleTemplateSelect = (templateId: string) => {
    setValue('template.templateId', templateId);
  };

  return (
    <StepContainer>
      <div>
        <SectionTitle>{t.wizard?.chooseTemplate || 'Choose Template'}</SectionTitle>
        <TemplateGrid>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              isSelected={selectedTemplate === template.id}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="template-name">{template.name}</div>
              <div className="template-description">{template.description}</div>
            </TemplateCard>
          ))}
        </TemplateGrid>
        {errors.template?.templateId && (
          <ErrorMessage>{errors.template.templateId.message as string}</ErrorMessage>
        )}
      </div>

      <div>
        <SectionTitle>{t.wizard?.colorScheme || 'Color Scheme'}</SectionTitle>
        <FormRow>
          <ColorGroup>
            <FormGroup>
              <Label htmlFor="template.primaryColor">{t.customization.primaryColor}</Label>
              <Input
                {...register('template.primaryColor')}
                id="template.primaryColor"
                type="color"
                className={errors.template?.primaryColor ? 'error' : ''}
              />
              {errors.template?.primaryColor && (
                <ErrorMessage>{errors.template.primaryColor.message as string}</ErrorMessage>
              )}
            </FormGroup>
            <ColorPreview color={primaryColor || '#3b82f6'} />
          </ColorGroup>

          <ColorGroup>
            <FormGroup>
              <Label htmlFor="template.secondaryColor">{t.customization.secondaryColor}</Label>
              <Input
                {...register('template.secondaryColor')}
                id="template.secondaryColor"
                type="color"
                className={errors.template?.secondaryColor ? 'error' : ''}
              />
              {errors.template?.secondaryColor && (
                <ErrorMessage>{errors.template.secondaryColor.message as string}</ErrorMessage>
              )}
            </FormGroup>
            <ColorPreview color={secondaryColor || '#1f2937'} />
          </ColorGroup>
        </FormRow>
      </div>

      <div>
        <SectionTitle>{t.wizard?.typography || 'Typography'}</SectionTitle>
        <FormRow>
          <FormGroup>
            <Label htmlFor="template.fontFamily">{t.customization.fontFamily}</Label>
            <Select
              {...register('template.fontFamily')}
              id="template.fontFamily"
              className={errors.template?.fontFamily ? 'error' : ''}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </Select>
            {errors.template?.fontFamily && (
              <ErrorMessage>{errors.template.fontFamily.message as string}</ErrorMessage>
            )}
          </FormGroup>
        </FormRow>
      </div>

      <div>
        <SectionTitle>{t.wizard?.welcomeMessage || 'Welcome Message'}</SectionTitle>
        <FormGroup>
          <Label htmlFor="settings.welcomeMessage">{t.wizard?.welcomeMessageLabel || 'Custom Welcome Message (Optional)'}</Label>
          <TextArea
            {...register('settings.welcomeMessage')}
            id="settings.welcomeMessage"
            className={errors.settings?.welcomeMessage ? 'error' : ''}
            placeholder={t.customization.welcomeMessagePlaceholder}
          />
          {errors.settings?.welcomeMessage && (
            <ErrorMessage>{errors.settings.welcomeMessage.message as string}</ErrorMessage>
          )}
        </FormGroup>
      </div>
    </StepContainer>
  );
}
