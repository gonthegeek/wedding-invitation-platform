import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, Eye, Edit3, Heart, Palette, Settings, MapPin, Users } from 'lucide-react';
import { useTranslation } from '../../hooks/useLanguage';
import type { Wedding, WeddingSettings, SectionVisibility } from '../../types';
import WeddingPartyManagement from './WeddingPartyManagement';
import { ImageUpload } from '../shared/ImageUpload';
import { GalleryUpload } from '../shared/GalleryUpload';
import { StorageService } from '../../services/storageService';

const EditorContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Georgia', serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-style: italic;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.$active ? '#667eea' : '#f3f4f6'};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const PreviewSection = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ColorInput = styled.input`
  width: 100px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PreviewTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const PreviewText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: ${props => props.variant === 'primary' ? 'none' : '2px solid #667eea'};
  background: ${props => props.variant === 'primary' ? '#667eea' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#667eea'};
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Additional styled components for new sections
const GiftOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GiftOptionItem = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
`;

const GiftInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .gift-header {
    display: grid;
    grid-template-columns: auto 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
  }
  
  .gift-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;
  }
`;

const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #218838;
  }
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: #c82333;
  }
`;

interface WeddingDetailsEditorProps {
  wedding: Wedding;
  onSave: (settings: WeddingSettings) => Promise<void>;
  onWeddingUpdate?: (wedding: Partial<Wedding>) => Promise<void>;
  onPreview: () => void;
}

export const WeddingDetailsEditor: React.FC<WeddingDetailsEditorProps> = ({
  wedding: initialWedding,
  onSave,
  onWeddingUpdate,
  onPreview
}) => {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'additional' | 'venues' | 'weddingParty' | 'settings'>('content');
  const [wedding, setWedding] = useState<Wedding>(initialWedding);
  const [settings, setSettings] = useState<WeddingSettings>({
    ...initialWedding.settings,
    loveQuote: initialWedding.settings?.loveQuote || "Love is composed of a single soul inhabiting two bodies.",
    brideFatherName: initialWedding.settings?.brideFatherName || "",
    brideMotherName: initialWedding.settings?.brideMotherName || "",
    groomFatherName: initialWedding.settings?.groomFatherName || "",
    groomMotherName: initialWedding.settings?.groomMotherName || "",
    dressCode: initialWedding.settings?.dressCode || "Formal",
    dressCodeDescription: initialWedding.settings?.dressCodeDescription || "Men: Suit\nWomen: Cocktail Dress",
    rsvpTitle: initialWedding.settings?.rsvpTitle || "We Want to Share This Special Moment With You!",
    rsvpMessage: initialWedding.settings?.rsvpMessage || "Please help us by confirming your attendance.",
    rsvpButtonText: initialWedding.settings?.rsvpButtonText || "CONFIRM ATTENDANCE",
    childrenNote: initialWedding.settings?.childrenNote || "We would love for you to bring your children,",
    childrenNoteDetails: initialWedding.settings?.childrenNoteDetails || "but we ask that you take care of them during the event.",
    giftMessage: initialWedding.settings?.giftMessage || "Your presence at our wedding is the greatest gift we could ask for. If you wish to honor us with a gift, we have prepared some suggestions for you.",
    footerMessage: initialWedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!",
    footerSignature: initialWedding.settings?.footerSignature || "With love:",
    primaryColor: initialWedding.settings?.primaryColor || "#667eea",
    secondaryColor: initialWedding.settings?.secondaryColor || "#ff6b9d",
  });
  const [saving, setSaving] = useState(false);

  // Update settings when wedding prop changes
  useEffect(() => {
    // Sync local state when parent wedding changes (e.g., after save)
    setWedding(initialWedding);
    setSettings(prev => ({
      ...prev,
      ...initialWedding.settings,
      sectionVisibility: {
        ...(prev.sectionVisibility || {}),
        ...(initialWedding.settings?.sectionVisibility || {}),
      },
      hotelInfo: {
        ...(prev.hotelInfo || {}),
        ...(initialWedding.settings?.hotelInfo || {}),
      },
      giftOptions: initialWedding.settings?.giftOptions ?? prev.giftOptions,
      photoGallery: initialWedding.settings?.photoGallery ?? prev.photoGallery,
      primaryColor: initialWedding.settings?.primaryColor || prev.primaryColor || '#667eea',
      secondaryColor: initialWedding.settings?.secondaryColor || prev.secondaryColor || '#ff6b9d',
    }));
  }, [initialWedding]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionVisibilityChange = (newVisibility: Partial<SectionVisibility>) => {
    setSettings(prev => ({ 
      ...prev, 
      sectionVisibility: {
        ...prev.sectionVisibility,
        ...newVisibility
      }
    }));
  };

  const handleVenueChange = (locationType: 'ceremony' | 'reception', field: string, value: string) => {
    const locationField = locationType === 'ceremony' ? 'ceremonyLocation' : 'receptionLocation';
    setWedding(prev => ({
      ...prev,
      [locationField]: {
        ...prev[locationField],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('WeddingDetailsEditor: Saving settings:', settings);
      await onSave(settings);
      
      // If wedding data has changed and we have a wedding update handler, save it too
      if (onWeddingUpdate && JSON.stringify(wedding) !== JSON.stringify(initialWedding)) {
        console.log('WeddingDetailsEditor: Saving wedding data:', wedding);
        await onWeddingUpdate(wedding);
      }
    } catch (error) {
      console.error('WeddingDetailsEditor: Error saving wedding data:', error);
    } finally {
      setSaving(false);
    }
  };

  // Gift options management functions
  const addGiftOption = () => {
    const newGiftOption = {
      id: Date.now().toString(),
      type: 'bank' as const,
      title: '',
      description: ''
    };
    setSettings(prev => ({
      ...prev,
      giftOptions: [...(prev.giftOptions || []), newGiftOption]
    }));
  };

  const updateGiftOption = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      giftOptions: prev.giftOptions?.map((gift, i) => 
        i === index ? { ...gift, [field]: value } : gift
      ) || []
    }));
  };

  const removeGiftOption = (index: number) => {
    setSettings(prev => ({
      ...prev,
      giftOptions: prev.giftOptions?.filter((_, i) => i !== index) || []
    }));
  };

  // Hotel info management function
  const updateHotelInfo = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      hotelInfo: {
        name: '',
        address: '',
        ...prev.hotelInfo,
        [field]: value
      }
    }));
  };

  return (
    <EditorContainer>
      <Header>
        <Title>{t.customization.customizeInvitation}</Title>
        <Subtitle>{t.customization.makeItYours}</Subtitle>
      </Header>

      <TabContainer>
        <Tab 
          $active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          <Edit3 size={20} />
          {t.customization.contentAndText}
        </Tab>
        <Tab 
          $active={activeTab === 'design'} 
          onClick={() => setActiveTab('design')}
        >
          <Palette size={20} />
          {t.customization.designAndColors}
        </Tab>
        <Tab 
          $active={activeTab === 'additional'} 
          onClick={() => setActiveTab('additional')}
        >
          <Heart size={20} />
          {t.customization.additionalSections}
        </Tab>
        <Tab 
          $active={activeTab === 'venues'} 
          onClick={() => setActiveTab('venues')}
        >
          <MapPin size={20} />
          {t.customization.venueDetails}
        </Tab>
        <Tab 
          $active={activeTab === 'weddingParty'} 
          onClick={() => setActiveTab('weddingParty')}
        >
          <Users size={20} />
          {t.customization.weddingPartyTab}
        </Tab>
        <Tab 
          $active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          {t.customization.settingsAndVisibility}
        </Tab>
      </TabContainer>

      <ContentGrid>
        <FormSection>
          {activeTab === 'content' && (
            <>
              <SectionTitle>
                <Heart size={20} />
                {t.customization.invitationContent}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.loveQuote}</Label>
                <TextArea
                  value={settings.loveQuote || ''}
                  onChange={(e) => handleInputChange('loveQuote', e.target.value)}
                  placeholder={t.customization.welcomeMessagePlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.invitation.bridesFather}</Label>
                <Input
                  value={settings.brideFatherName || ''}
                  onChange={(e) => handleInputChange('brideFatherName', e.target.value)}
                  placeholder={t.customization.enterText}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.invitation.bridesMother}</Label>
                <Input
                  value={settings.brideMotherName || ''}
                  onChange={(e) => handleInputChange('brideMotherName', e.target.value)}
                  placeholder={t.customization.enterText}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.invitation.groomsFather}</Label>
                <Input
                  value={settings.groomFatherName || ''}
                  onChange={(e) => handleInputChange('groomFatherName', e.target.value)}
                  placeholder={t.customization.enterText}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.invitation.groomsMother}</Label>
                <Input
                  value={settings.groomMotherName || ''}
                  onChange={(e) => handleInputChange('groomMotherName', e.target.value)}
                  placeholder={t.customization.enterText}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.dressCode}</Label>
                <Input
                  value={settings.dressCode || ''}
                  onChange={(e) => handleInputChange('dressCode', e.target.value)}
                  placeholder={t.customization.dressCodePlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.dressCodeDescription}</Label>
                <TextArea
                  value={settings.dressCodeDescription || ''}
                  onChange={(e) => handleInputChange('dressCodeDescription', e.target.value)}
                  placeholder={t.customization.dressCodeDescriptionPlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.rsvpTitle}</Label>
                <Input
                  value={settings.rsvpTitle || ''}
                  onChange={(e) => handleInputChange('rsvpTitle', e.target.value)}
                  placeholder={t.invitation.rsvpTitle}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.rsvpMessage}</Label>
                <TextArea
                  value={settings.rsvpMessage || ''}
                  onChange={(e) => handleInputChange('rsvpMessage', e.target.value)}
                  placeholder={t.invitation.rsvpMessage}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.rsvpButtonText}</Label>
                <Input
                  value={settings.rsvpButtonText || ''}
                  onChange={(e) => handleInputChange('rsvpButtonText', e.target.value)}
                  placeholder={t.invitation.confirmAttendance}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.giftMessage}</Label>
                <TextArea
                  value={settings.giftMessage || ''}
                  onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                  placeholder={t.customization.giftMessagePlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.footerMessage}</Label>
                <TextArea
                  value={settings.footerMessage || ''}
                  onChange={(e) => handleInputChange('footerMessage', e.target.value)}
                  placeholder={t.customization.footerMessagePlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.footerSignature}</Label>
                <Input
                  value={settings.footerSignature || ''}
                  onChange={(e) => handleInputChange('footerSignature', e.target.value)}
                  placeholder="e.g., With love:, Sincerely:"
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'design' && (
            <>
              <SectionTitle>
                <Palette size={20} />
                {t.customization.invitationDesign}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.primaryColor}</Label>
                <ColorInput
                  type="color"
                  value={settings.primaryColor || '#667eea'}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.secondaryColor}</Label>
                <ColorInput
                  type="color"
                  value={settings.secondaryColor || '#ff6b9d'}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
              </FormGroup>

              <SectionTitle style={{ marginTop: '2rem' }}>
                <Heart size={20} />
                {t.customization.couplePhotos}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.bridePhoto}</Label>
                <ImageUpload
                  value={settings.bridePhoto}
                  onChange={(imageUrl) => handleInputChange('bridePhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'bride')}
                  label={t.customization.uploadBridePhoto}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.groomPhoto}</Label>
                <ImageUpload
                  value={settings.groomPhoto}
                  onChange={(imageUrl) => handleInputChange('groomPhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'groom')}
                  label={t.customization.uploadGroomPhoto}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.couplePhoto}</Label>
                <ImageUpload
                  value={settings.couplePhoto}
                  onChange={(imageUrl) => handleInputChange('couplePhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'couple')}
                  label={t.customization.uploadCouplePhoto}
                />
              </FormGroup>

              <SectionTitle style={{ marginTop: '2rem' }}>
                <Palette size={20} />
                {t.customization.photoGallery}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.galleryImages}</Label>
                <GalleryUpload
                  value={settings.photoGallery || []}
                  onChange={(images) => handleInputChange('photoGallery', images)}
                  onUpload={(file) => StorageService.uploadGalleryPhoto(wedding.id, file)}
                  maxImages={12}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.fontFamily}</Label>
                <select
                  value={settings.fontFamily || 'Georgia, serif'}
                  onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    width: '100%',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Georgia, serif">{t.customization.fontGeorgia}</option>
                  <option value="Times New Roman, serif">{t.customization.fontTimesNewRoman}</option>
                  <option value="Playfair Display, serif">{t.customization.fontPlayfairDisplay}</option>
                  <option value="Merriweather, serif">{t.customization.fontMerriweather}</option>
                  <option value="Arial, sans-serif">{t.customization.fontArial}</option>
                  <option value="Helvetica, sans-serif">{t.customization.fontHelvetica}</option>
                  <option value="Open Sans, sans-serif">{t.customization.fontOpenSans}</option>
                  <option value="Lato, sans-serif">{t.customization.fontLato}</option>
                  <option value="Montserrat, sans-serif">{t.customization.fontMontserrat}</option>
                  <option value="Dancing Script, cursive">{t.customization.fontDancingScript}</option>
                  <option value="Great Vibes, cursive">{t.customization.fontGreatVibes}</option>
                  <option value="Pacifico, cursive">{t.customization.fontPacifico}</option>
                  <option value="Satisfy, cursive">{t.customization.fontSatisfy}</option>
                </select>
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.customMessage}</Label>
                <TextArea
                  value={settings.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  placeholder={t.customization.customMessagePlaceholder}
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'additional' && (
            <>
              <SectionTitle>
                <Heart size={20} />
                {t.customization.giftOptions}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.giftMessage}</Label>
                <TextArea
                  value={settings.giftMessage || ''}
                  onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                  placeholder={t.customization.giftMessagePlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.giftOptions}</Label>
                <GiftOptionsList>
                  {(settings.giftOptions || []).map((gift, index) => (
                    <GiftOptionItem key={gift.id}>
                      <GiftInputs>
                        <div className="gift-header">
                          <select
                            value={gift.type}
                            onChange={(e) => updateGiftOption(index, 'type', e.target.value)}
                          >
                            <option value="bank">{t.customization.bankTransfer}</option>
                            <option value="store">{t.customization.storeRegistry}</option>
                            <option value="cash">{t.customization.cash}</option>
                            <option value="other">{t.customization.other}</option>
                          </select>
                          <Input
                            placeholder={t.customization.giftTitle}
                            value={gift.title}
                            onChange={(e) => updateGiftOption(index, 'title', e.target.value)}
                          />
                          <Input
                            placeholder={t.customization.giftDescription}
                            value={gift.description || ''}
                            onChange={(e) => updateGiftOption(index, 'description', e.target.value)}
                          />
                          <RemoveButton onClick={() => removeGiftOption(index)}>×</RemoveButton>
                        </div>
                        
                        {(gift.type === 'bank' || gift.type === 'store') && (
                          <div className="gift-details">
                            {gift.type === 'bank' && (
                              <>
                                <Input
                                  placeholder={t.customization.bankName}
                                  value={gift.bankName || ''}
                                  onChange={(e) => updateGiftOption(index, 'bankName', e.target.value)}
                                />
                                <Input
                                  placeholder={t.customization.accountNumber}
                                  value={gift.accountNumber || ''}
                                  onChange={(e) => updateGiftOption(index, 'accountNumber', e.target.value)}
                                />
                                <Input
                                  placeholder={t.customization.accountHolder}
                                  value={gift.accountHolder || ''}
                                  onChange={(e) => updateGiftOption(index, 'accountHolder', e.target.value)}
                                  style={{ gridColumn: '1 / -1' }}
                                />
                              </>
                            )}
                            {gift.type === 'store' && (
                              <>
                                <Input
                                  placeholder={t.customization.storeName}
                                  value={gift.storeName || ''}
                                  onChange={(e) => updateGiftOption(index, 'storeName', e.target.value)}
                                />
                                <Input
                                  placeholder={t.customization.storeUrl}
                                  value={gift.storeUrl || ''}
                                  onChange={(e) => updateGiftOption(index, 'storeUrl', e.target.value)}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </GiftInputs>
                    </GiftOptionItem>
                  ))}
                </GiftOptionsList>
                <AddButton onClick={addGiftOption}>{t.customization.addGiftOption}</AddButton>
              </FormGroup>

              <SectionTitle style={{ marginTop: '3rem' }}>
                <Heart size={20} />
                {t.customization.hotelInformation}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.hotelName}</Label>
                <Input
                  value={settings.hotelInfo?.name || ''}
                  onChange={(e) => updateHotelInfo('name', e.target.value)}
                  placeholder={t.customization.hotelName}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.hotelAddress}</Label>
                <TextArea
                  value={settings.hotelInfo?.address || ''}
                  onChange={(e) => updateHotelInfo('address', e.target.value)}
                  placeholder={t.customization.hotelAddress}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.hotelDescription}</Label>
                <TextArea
                  value={settings.hotelInfo?.description || ''}
                  onChange={(e) => updateHotelInfo('description', e.target.value)}
                  placeholder={t.customization.hotelDescriptionPlaceholder}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.hotelPhone}</Label>
                <Input
                  value={settings.hotelInfo?.phone || ''}
                  onChange={(e) => updateHotelInfo('phone', e.target.value)}
                  placeholder={t.customization.hotelPhone}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.bookingUrl}</Label>
                <Input
                  value={settings.hotelInfo?.bookingUrl || ''}
                  onChange={(e) => updateHotelInfo('bookingUrl', e.target.value)}
                  placeholder={t.customization.enterUrl}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.specialRate}</Label>
                <Input
                  value={settings.hotelInfo?.specialRate || ''}
                  onChange={(e) => updateHotelInfo('specialRate', e.target.value)}
                  placeholder={t.customization.specialRate}
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'venues' && (
            <>
              <SectionTitle>
                <MapPin size={20} />
                {t.customization.venueDetails}
              </SectionTitle>

              {/* Ceremony Location */}
              <FormGroup>
                <Label>{t.customization.ceremonyVenue}</Label>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <Input
                    value={wedding.ceremonyLocation?.name || ''}
                    onChange={(e) => handleVenueChange('ceremony', 'name', e.target.value)}
                    placeholder={t.customization.venueName}
                  />
                  <Input
                    value={wedding.ceremonyLocation?.address || ''}
                    onChange={(e) => handleVenueChange('ceremony', 'address', e.target.value)}
                    placeholder={t.customization.venueAddress}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <Input
                      value={wedding.ceremonyLocation?.city || ''}
                      onChange={(e) => handleVenueChange('ceremony', 'city', e.target.value)}
                      placeholder={t.customization.city}
                    />
                    <Input
                      value={wedding.ceremonyLocation?.state || ''}
                      onChange={(e) => handleVenueChange('ceremony', 'state', e.target.value)}
                      placeholder={t.customization.state}
                    />
                    <Input
                      value={wedding.ceremonyLocation?.zipCode || ''}
                      onChange={(e) => handleVenueChange('ceremony', 'zipCode', e.target.value)}
                      placeholder={t.customization.zipCode}
                    />
                  </div>
                  <Input
                    value={wedding.ceremonyLocation?.googleMapsUrl || ''}
                    onChange={(e) => handleVenueChange('ceremony', 'googleMapsUrl', e.target.value)}
                    placeholder={t.customization.googleMapsOptional}
                    type="url"
                  />
                </div>
              </FormGroup>

              {/* Ceremony Time */}
              <FormGroup>
                <Label>{t.customization.ceremonyTime}</Label>
                <Input
                  value={wedding.ceremonyTime || ''}
                  onChange={(e) => setWedding(prev => ({ ...prev, ceremonyTime: e.target.value }))}
                  placeholder="e.g., 4:00 PM"
                />
              </FormGroup>

              {/* Reception Location */}
              <FormGroup>
                <Label>{t.customization.receptionVenue}</Label>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <Input
                    value={wedding.receptionLocation?.name || ''}
                    onChange={(e) => handleVenueChange('reception', 'name', e.target.value)}
                    placeholder={t.customization.venueName}
                  />
                  <Input
                    value={wedding.receptionLocation?.address || ''}
                    onChange={(e) => handleVenueChange('reception', 'address', e.target.value)}
                    placeholder={t.customization.venueAddress}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <Input
                      value={wedding.receptionLocation?.city || ''}
                      onChange={(e) => handleVenueChange('reception', 'city', e.target.value)}
                      placeholder={t.customization.city}
                    />
                    <Input
                      value={wedding.receptionLocation?.state || ''}
                      onChange={(e) => handleVenueChange('reception', 'state', e.target.value)}
                      placeholder={t.customization.state}
                    />
                    <Input
                      value={wedding.receptionLocation?.zipCode || ''}
                      onChange={(e) => handleVenueChange('reception', 'zipCode', e.target.value)}
                      placeholder={t.customization.zipCode}
                    />
                  </div>
                  <Input
                    value={wedding.receptionLocation?.googleMapsUrl || ''}
                    onChange={(e) => handleVenueChange('reception', 'googleMapsUrl', e.target.value)}
                    placeholder={t.customization.googleMapsOptional}
                    type="url"
                  />
                </div>
              </FormGroup>

              {/* Reception Time */}
              <FormGroup>
                <Label>{t.customization.receptionTime}</Label>
                <Input
                  value={wedding.receptionTime || ''}
                  onChange={(e) => setWedding(prev => ({ ...prev, receptionTime: e.target.value }))}
                  placeholder="e.g., 6:00 PM"
                />
              </FormGroup>

              {/* Wedding Date */}
              <FormGroup>
                <Label>{t.customization.weddingDate}</Label>
                <Input
                  type="date"
                  value={wedding.weddingDate ? new Date(wedding.weddingDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setWedding(prev => ({ ...prev, weddingDate: new Date(e.target.value) }))}
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'weddingParty' && (
            <WeddingPartyManagement 
              weddingId={wedding.id}
              wedding={wedding}
              onUpdate={() => {
                // Refresh any data if needed
                // This could trigger a parent component refresh
                if (onWeddingUpdate) {
                  // Optionally refresh wedding data
                }
              }}
            />
          )}

          {activeTab === 'settings' && (
            <>
              <SectionTitle>
                <Settings size={20} />
                {t.customization.sectionVisibility} & {t.customization.backgroundSettings}
              </SectionTitle>

              <FormGroup>
                <Label>{t.customization.sectionVisibility}</Label>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {[
                    { key: 'parents', label: t.customization.parentsNames },
                    { key: 'weddingParty', label: t.customization.weddingPartySection },
                    { key: 'couplePhoto', label: t.customization.couplePhotoSection },
                    { key: 'countdown', label: t.customization.countdownTimer },
                    { key: 'eventDetails', label: t.customization.eventDetails },
                    { key: 'dressCode', label: 'Dress Code' },
                    { key: 'rsvp', label: t.customization.rsvpSection },
                    { key: 'giftOptions', label: 'Gift Options' },
                    { key: 'photoGallery', label: t.customization.photoGallerySection },
                    { key: 'hotelInfo', label: 'Hotel Information' },
                    { key: 'loveQuote', label: t.customization.loveQuoteSection },
                    { key: 'specialInstructions', label: t.customization.specialInstructionsSection }
                  ].map(section => (
                    <label key={section.key} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.sectionVisibility?.[section.key as keyof SectionVisibility] ?? true}
                        onChange={(e) => {
                          const newVisibility = {
                            [section.key]: e.target.checked
                          };
                          handleSectionVisibilityChange(newVisibility);
                        }}
                      />
                      {section.label}
                    </label>
                  ))}
                </div>
              </FormGroup>

              <FormGroup>
                <Label>{t.customization.backgroundType}</Label>
                <select
                  value={settings.backgroundType || 'gradient'}
                  onChange={(e) => handleInputChange('backgroundType', e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  <option value="solid">{t.customization.solidBackground}</option>
                  <option value="gradient">{t.customization.gradientBackground}</option>
                  <option value="image">{t.customization.imageBackground}</option>
                </select>
              </FormGroup>

              {settings.backgroundType === 'image' && (
                <>
                  <FormGroup>
                    <Label>{t.customization.backgroundImage}</Label>
                    <ImageUpload
                      value={settings.backgroundImageUrl || ''}
                      onChange={(imageUrl) => handleInputChange('backgroundImageUrl', imageUrl || '')}
                      onUpload={async (file: File) => {
                        return await StorageService.uploadImage(file, `weddings/${wedding.id}/backgrounds`);
                      }}
                      label={t.customization.uploadBackgroundImage}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t.customization.backgroundPosition}</Label>
                    <select
                      value={settings.backgroundPosition || 'center'}
                      onChange={(e) => handleInputChange('backgroundPosition', e.target.value)}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    >
                      <option value="center">{t.customization.centerPosition}</option>
                      <option value="top">{t.customization.topPosition}</option>
                      <option value="bottom">{t.customization.bottomPosition}</option>
                      <option value="left">{t.customization.leftPosition}</option>
                      <option value="right">{t.customization.rightPosition}</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <Label>{t.customization.backgroundSize}</Label>
                    <select
                      value={settings.backgroundSize || 'cover'}
                      onChange={(e) => handleInputChange('backgroundSize', e.target.value)}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    >
                      <option value="cover">{t.customization.coverSize}</option>
                      <option value="contain">{t.customization.containSize}</option>
                      <option value="auto">{t.customization.autoSize}</option>
                    </select>
                  </FormGroup>
                </>
              )}
            </>
          )}
        </FormSection>

        <PreviewSection>
          <SectionTitle>
            <Eye size={20} />
            Preview
          </SectionTitle>

          {activeTab === 'content' && (
            <>
              <PreviewCard>
                <PreviewTitle style={{ color: settings.primaryColor }}>Love Quote</PreviewTitle>
                <PreviewText style={{ 
                  fontStyle: 'italic',
                  color: settings.secondaryColor,
                  borderLeft: `3px solid ${settings.primaryColor}`,
                  paddingLeft: '1rem'
                }}>
                  "{settings.loveQuote}"
                </PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle style={{ color: settings.primaryColor }}>Parents</PreviewTitle>
                <PreviewText>
                  <strong style={{ color: settings.secondaryColor }}>Bride's Parents:</strong><br />
                  {settings.brideFatherName} & {settings.brideMotherName}
                </PreviewText>
                <PreviewText>
                  <strong style={{ color: settings.secondaryColor }}>Groom's Parents:</strong><br />
                  {settings.groomFatherName} & {settings.groomMotherName}
                </PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle style={{ color: settings.primaryColor }}>Dress Code</PreviewTitle>
                <PreviewText>
                  <strong style={{ color: settings.secondaryColor }}>{settings.dressCode}</strong><br />
                  {settings.dressCodeDescription}
                </PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle style={{ color: settings.primaryColor }}>RSVP Section</PreviewTitle>
                <PreviewText>
                  <strong style={{ color: settings.secondaryColor }}>{settings.rsvpTitle}</strong><br />
                  {settings.rsvpMessage}
                </PreviewText>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: settings.primaryColor,
                  color: 'white',
                  borderRadius: '25px',
                  display: 'inline-block',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {settings.rsvpButtonText}
                </div>
              </PreviewCard>
            </>
          )}

          {activeTab === 'design' && (
            <>
              <PreviewCard style={{ 
                background: `linear-gradient(135deg, ${settings.primaryColor}15, ${settings.secondaryColor}15)`,
                border: `2px solid ${settings.primaryColor}30`
              }}>
                <PreviewTitle style={{ color: settings.primaryColor }}>Color Scheme Preview</PreviewTitle>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: settings.primaryColor,
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} />
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: settings.secondaryColor,
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} />
                </div>
                <PreviewText style={{ color: settings.primaryColor, fontWeight: 'bold' }}>
                  Primary Color: {settings.primaryColor}
                </PreviewText>
                <PreviewText style={{ color: settings.secondaryColor, fontWeight: 'bold' }}>
                  Secondary Color: {settings.secondaryColor}
                </PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle style={{ color: settings.primaryColor }}>Invitation Elements</PreviewTitle>
                <div style={{ 
                  padding: '1rem',
                  background: `linear-gradient(45deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  borderRadius: '10px',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {wedding.brideFirstName} & {wedding.groomFirstName}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Wedding Invitation Header
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: settings.primaryColor,
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    Save the Date
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: settings.secondaryColor,
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    RSVP Button
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    border: `2px solid ${settings.primaryColor}`,
                    color: settings.primaryColor,
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    Details
                  </div>
                </div>
              </PreviewCard>
            </>
          )}

          {activeTab === 'venues' && (
            <>
              <PreviewTitle style={{ color: settings.primaryColor }}>Venue Preview</PreviewTitle>
              <PreviewCard>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem', color: settings.primaryColor, fontSize: '1.1rem' }}>
                    📅 {wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Wedding Date'}
                  </h4>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 0.5rem', color: settings.primaryColor, fontSize: '1rem' }}>
                      ⛪ Ceremony
                    </h5>
                    <div style={{ fontSize: '0.9rem', color: '#333' }}>
                      <div style={{ fontWeight: '600' }}>{wedding.ceremonyLocation?.name || 'Ceremony Venue'}</div>
                      <div>{wedding.ceremonyTime || 'Ceremony Time'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {wedding.ceremonyLocation?.address && (
                          <>
                            {wedding.ceremonyLocation.address}
                            {wedding.ceremonyLocation.city && `, ${wedding.ceremonyLocation.city}`}
                            {wedding.ceremonyLocation.state && `, ${wedding.ceremonyLocation.state}`}
                            {wedding.ceremonyLocation.zipCode && ` ${wedding.ceremonyLocation.zipCode}`}
                          </>
                        )}
                      </div>
                      {wedding.ceremonyLocation?.googleMapsUrl && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: settings.primaryColor, 
                            textDecoration: 'underline' 
                          }}>
                            📍 View on Maps
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 0.5rem', color: settings.primaryColor, fontSize: '1rem' }}>
                      🎉 Reception
                    </h5>
                    <div style={{ fontSize: '0.9rem', color: '#333' }}>
                      <div style={{ fontWeight: '600' }}>{wedding.receptionLocation?.name || 'Reception Venue'}</div>
                      <div>{wedding.receptionTime || 'Reception Time'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {wedding.receptionLocation?.address && (
                          <>
                            {wedding.receptionLocation.address}
                            {wedding.receptionLocation.city && `, ${wedding.receptionLocation.city}`}
                            {wedding.receptionLocation.state && `, ${wedding.receptionLocation.state}`}
                            {wedding.receptionLocation.zipCode && ` ${wedding.receptionLocation.zipCode}`}
                          </>
                        )}
                      </div>
                      {wedding.receptionLocation?.googleMapsUrl && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: settings.primaryColor, 
                            textDecoration: 'underline' 
                          }}>
                            📍 View on Maps
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </PreviewCard>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <PreviewTitle style={{ color: settings.primaryColor }}>Preview Settings</PreviewTitle>
              <PreviewCard>
                <div style={{
                  padding: '1rem',
                  background: settings.backgroundType === 'image' && settings.backgroundImageUrl
                    ? `url(${settings.backgroundImageUrl})`
                    : `linear-gradient(45deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  backgroundPosition: settings.backgroundPosition || 'center',
                  backgroundSize: settings.backgroundSize || 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  minHeight: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {wedding.brideFirstName} & {wedding.groomFirstName}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      Background Preview
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: '#666', padding: '1rem' }}>
                  <strong>Visible Sections:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {Object.entries(settings.sectionVisibility || {})
                      .filter(([, visible]) => visible)
                      .map(([key]) => (
                        <span key={key} style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: settings.primaryColor,
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      ))}
                  </div>
                </div>
              </PreviewCard>
            </>
          )}
        </PreviewSection>
      </ContentGrid>

      <ActionButtons>
        <Button variant="secondary" onClick={onPreview}>
          <Eye size={20} />
          {t.customization.previewInvitation}
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save size={20} />
          {saving ? t.customization.saving : t.customization.saveChanges}
        </Button>
      </ActionButtons>
    </EditorContainer>
  );
};
