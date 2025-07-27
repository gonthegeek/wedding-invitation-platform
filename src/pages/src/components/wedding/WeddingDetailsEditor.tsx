import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, Eye, Edit3, Heart, Palette } from 'lucide-react';
import type { Wedding, WeddingSettings } from '../../types';
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
const PadrinosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PadrinoItem = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
`;

const PadrinoInputs = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
  
  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;
  }
`;

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
  onPreview: () => void;
}

export const WeddingDetailsEditor: React.FC<WeddingDetailsEditorProps> = ({
  wedding,
  onSave,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'additional'>('content');
  const [settings, setSettings] = useState<WeddingSettings>({
    ...wedding.settings,
    // Ensure all customizable fields have default values
    loveQuote: wedding.settings?.loveQuote || "Love is composed of a single soul inhabiting two bodies.",
    brideFatherName: wedding.settings?.brideFatherName || "",
    brideMotherName: wedding.settings?.brideMotherName || "",
    groomFatherName: wedding.settings?.groomFatherName || "",
    groomMotherName: wedding.settings?.groomMotherName || "",
    dressCode: wedding.settings?.dressCode || "Formal",
    dressCodeDescription: wedding.settings?.dressCodeDescription || "Men: Suit\nWomen: Cocktail Dress",
    rsvpTitle: wedding.settings?.rsvpTitle || "We Want to Share This Special Moment With You!",
    rsvpMessage: wedding.settings?.rsvpMessage || "Please help us by confirming your attendance.",
    rsvpButtonText: wedding.settings?.rsvpButtonText || "CONFIRM ATTENDANCE",
    childrenNote: wedding.settings?.childrenNote || "We would love for you to bring your children,",
    childrenNoteDetails: wedding.settings?.childrenNoteDetails || "but we ask that you take care of them during the event.",
    giftMessage: wedding.settings?.giftMessage || "Your presence at our wedding is the greatest gift we could ask for. If you wish to honor us with a gift, we have prepared some suggestions for you.",
    footerMessage: wedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!",
    footerSignature: wedding.settings?.footerSignature || "With love:",
    primaryColor: wedding.settings?.primaryColor || "#667eea",
    secondaryColor: wedding.settings?.secondaryColor || "#ff6b9d",
  });
  const [saving, setSaving] = useState(false);

  // Update settings when wedding prop changes
  useEffect(() => {
    setSettings({
      ...wedding.settings,
      // Ensure all customizable fields have default values
      loveQuote: wedding.settings?.loveQuote || "Love is composed of a single soul inhabiting two bodies.",
      brideFatherName: wedding.settings?.brideFatherName || "",
      brideMotherName: wedding.settings?.brideMotherName || "",
      groomFatherName: wedding.settings?.groomFatherName || "",
      groomMotherName: wedding.settings?.groomMotherName || "",
      dressCode: wedding.settings?.dressCode || "Formal",
      dressCodeDescription: wedding.settings?.dressCodeDescription || "Men: Suit\nWomen: Cocktail Dress",
      rsvpTitle: wedding.settings?.rsvpTitle || "We Want to Share This Special Moment With You!",
      rsvpMessage: wedding.settings?.rsvpMessage || "Please help us by confirming your attendance.",
      rsvpButtonText: wedding.settings?.rsvpButtonText || "CONFIRM ATTENDANCE",
      childrenNote: wedding.settings?.childrenNote || "We would love for you to bring your children,",
      childrenNoteDetails: wedding.settings?.childrenNoteDetails || "but we ask that you take care of them during the event.",
      giftMessage: wedding.settings?.giftMessage || "Your presence at our wedding is the greatest gift we could ask for. If you wish to honor us with a gift, we have prepared some suggestions for you.",
      footerMessage: wedding.settings?.footerMessage || "Thank you for being part of one of the best days of our lives!",
      footerSignature: wedding.settings?.footerSignature || "With love:",
      primaryColor: wedding.settings?.primaryColor || "#667eea",
      secondaryColor: wedding.settings?.secondaryColor || "#ff6b9d",
    });
  }, [wedding]);

  const handleInputChange = (field: keyof WeddingSettings, value: string | string[]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('WeddingDetailsEditor: Saving settings:', settings);
      await onSave(settings);
    } catch (error) {
      console.error('WeddingDetailsEditor: Error saving wedding settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Padrinos management functions
  const addPadrino = () => {
    const newPadrino = {
      id: Date.now().toString(),
      type: 'velacion' as const,
      name: '',
      lastName: ''
    };
    setSettings(prev => ({
      ...prev,
      padrinos: [...(prev.padrinos || []), newPadrino]
    }));
  };

  const updatePadrino = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      padrinos: prev.padrinos?.map((padrino, i) => 
        i === index ? { ...padrino, [field]: value } : padrino
      ) || []
    }));
  };

  const removePadrino = (index: number) => {
    setSettings(prev => ({
      ...prev,
      padrinos: prev.padrinos?.filter((_, i) => i !== index) || []
    }));
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
        <Title>Customize Your Wedding Invitation</Title>
        <Subtitle>Make your invitation uniquely yours</Subtitle>
      </Header>

      <TabContainer>
        <Tab 
          $active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          <Edit3 size={20} />
          Content & Text
        </Tab>
        <Tab 
          $active={activeTab === 'design'} 
          onClick={() => setActiveTab('design')}
        >
          <Palette size={20} />
          Design & Colors
        </Tab>
        <Tab 
          $active={activeTab === 'additional'} 
          onClick={() => setActiveTab('additional')}
        >
          <Heart size={20} />
          Additional Sections
        </Tab>
      </TabContainer>

      <ContentGrid>
        <FormSection>
          {activeTab === 'content' && (
            <>
              <SectionTitle>
                <Heart size={20} />
                Invitation Content
              </SectionTitle>

              <FormGroup>
                <Label>Love Quote</Label>
                <TextArea
                  value={settings.loveQuote || ''}
                  onChange={(e) => handleInputChange('loveQuote', e.target.value)}
                  placeholder="A romantic quote for your invitation"
                />
              </FormGroup>

              <FormGroup>
                <Label>Bride's Father Name</Label>
                <Input
                  value={settings.brideFatherName || ''}
                  onChange={(e) => handleInputChange('brideFatherName', e.target.value)}
                  placeholder="Father's name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Bride's Mother Name</Label>
                <Input
                  value={settings.brideMotherName || ''}
                  onChange={(e) => handleInputChange('brideMotherName', e.target.value)}
                  placeholder="Mother's name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Groom's Father Name</Label>
                <Input
                  value={settings.groomFatherName || ''}
                  onChange={(e) => handleInputChange('groomFatherName', e.target.value)}
                  placeholder="Father's name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Groom's Mother Name</Label>
                <Input
                  value={settings.groomMotherName || ''}
                  onChange={(e) => handleInputChange('groomMotherName', e.target.value)}
                  placeholder="Mother's name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Dress Code</Label>
                <Input
                  value={settings.dressCode || ''}
                  onChange={(e) => handleInputChange('dressCode', e.target.value)}
                  placeholder="e.g., Formal, Cocktail, Black Tie"
                />
              </FormGroup>

              <FormGroup>
                <Label>Dress Code Description</Label>
                <TextArea
                  value={settings.dressCodeDescription || ''}
                  onChange={(e) => handleInputChange('dressCodeDescription', e.target.value)}
                  placeholder="Detailed dress code instructions"
                />
              </FormGroup>

              <FormGroup>
                <Label>RSVP Title</Label>
                <Input
                  value={settings.rsvpTitle || ''}
                  onChange={(e) => handleInputChange('rsvpTitle', e.target.value)}
                  placeholder="RSVP section title"
                />
              </FormGroup>

              <FormGroup>
                <Label>RSVP Message</Label>
                <TextArea
                  value={settings.rsvpMessage || ''}
                  onChange={(e) => handleInputChange('rsvpMessage', e.target.value)}
                  placeholder="Message asking guests to confirm attendance"
                />
              </FormGroup>

              <FormGroup>
                <Label>RSVP Button Text</Label>
                <Input
                  value={settings.rsvpButtonText || ''}
                  onChange={(e) => handleInputChange('rsvpButtonText', e.target.value)}
                  placeholder="Text for the RSVP button"
                />
              </FormGroup>

              <FormGroup>
                <Label>Gift Message</Label>
                <TextArea
                  value={settings.giftMessage || ''}
                  onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                  placeholder="Message about gifts"
                />
              </FormGroup>

              <FormGroup>
                <Label>Footer Message</Label>
                <TextArea
                  value={settings.footerMessage || ''}
                  onChange={(e) => handleInputChange('footerMessage', e.target.value)}
                  placeholder="Thank you message for the footer"
                />
              </FormGroup>

              <FormGroup>
                <Label>Footer Signature</Label>
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
                Colors & Theme
              </SectionTitle>

              <FormGroup>
                <Label>Primary Color</Label>
                <ColorInput
                  type="color"
                  value={settings.primaryColor || '#667eea'}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Secondary Color</Label>
                <ColorInput
                  type="color"
                  value={settings.secondaryColor || '#ff6b9d'}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
              </FormGroup>

              <SectionTitle style={{ marginTop: '2rem' }}>
                <Heart size={20} />
                Couple Photos
              </SectionTitle>

              <FormGroup>
                <Label>Bride Photo</Label>
                <ImageUpload
                  value={settings.bridePhoto}
                  onChange={(imageUrl) => handleInputChange('bridePhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'bride')}
                  label="Upload Bride Photo"
                />
              </FormGroup>

              <FormGroup>
                <Label>Groom Photo</Label>
                <ImageUpload
                  value={settings.groomPhoto}
                  onChange={(imageUrl) => handleInputChange('groomPhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'groom')}
                  label="Upload Groom Photo"
                />
              </FormGroup>

              <FormGroup>
                <Label>Couple Photo</Label>
                <ImageUpload
                  value={settings.couplePhoto}
                  onChange={(imageUrl) => handleInputChange('couplePhoto', imageUrl || '')}
                  onUpload={(file) => StorageService.uploadCouplePhoto(wedding.id, file, 'couple')}
                  label="Upload Couple Photo"
                />
              </FormGroup>

              <SectionTitle style={{ marginTop: '2rem' }}>
                <Palette size={20} />
                Photo Gallery
              </SectionTitle>

              <FormGroup>
                <Label>Gallery Images</Label>
                <GalleryUpload
                  value={settings.photoGallery || []}
                  onChange={(images) => handleInputChange('photoGallery', images)}
                  onUpload={(file) => StorageService.uploadGalleryPhoto(wedding.id, file)}
                  maxImages={12}
                />
              </FormGroup>

              <FormGroup>
                <Label>Font Family</Label>
                <Input
                  value={settings.fontFamily || ''}
                  onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                  placeholder="e.g., Georgia, Times New Roman, Arial"
                />
              </FormGroup>

              <FormGroup>
                <Label>Custom Message</Label>
                <TextArea
                  value={settings.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  placeholder="Any additional custom message for your guests"
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'additional' && (
            <>
              <SectionTitle>
                <Heart size={20} />
                Padrinos (Godparents)
              </SectionTitle>

              <FormGroup>
                <Label>Add Padrinos</Label>
                <PadrinosList>
                  {(settings.padrinos || []).map((padrino, index) => (
                    <PadrinoItem key={padrino.id}>
                      <PadrinoInputs>
                        <select
                          value={padrino.type}
                          onChange={(e) => updatePadrino(index, 'type', e.target.value)}
                        >
                          <option value="velacion">Velación</option>
                          <option value="anillos">Anillos</option>
                          <option value="arras">Arras</option>
                          <option value="lazo">Lazo</option>
                          <option value="biblia">Biblia y Rosario</option>
                          <option value="cojines">Cojines</option>
                          <option value="ramo">Ramo</option>
                        </select>
                        <Input
                          placeholder="First Name"
                          value={padrino.name}
                          onChange={(e) => updatePadrino(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Last Name (optional)"
                          value={padrino.lastName || ''}
                          onChange={(e) => updatePadrino(index, 'lastName', e.target.value)}
                        />
                        <RemoveButton onClick={() => removePadrino(index)}>×</RemoveButton>
                      </PadrinoInputs>
                    </PadrinoItem>
                  ))}
                </PadrinosList>
                <AddButton onClick={addPadrino}>+ Add Padrino</AddButton>
              </FormGroup>

              <SectionTitle style={{ marginTop: '3rem' }}>
                <Heart size={20} />
                Gift Options
              </SectionTitle>

              <FormGroup>
                <Label>Gift Message</Label>
                <TextArea
                  value={settings.giftMessage || ''}
                  onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                  placeholder="Our best gift is sharing this great day with you..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Gift Options</Label>
                <GiftOptionsList>
                  {(settings.giftOptions || []).map((gift, index) => (
                    <GiftOptionItem key={gift.id}>
                      <GiftInputs>
                        <div className="gift-header">
                          <select
                            value={gift.type}
                            onChange={(e) => updateGiftOption(index, 'type', e.target.value)}
                          >
                            <option value="bank">Bank Transfer</option>
                            <option value="store">Store Registry</option>
                            <option value="cash">Cash</option>
                            <option value="other">Other</option>
                          </select>
                          <Input
                            placeholder="Title"
                            value={gift.title}
                            onChange={(e) => updateGiftOption(index, 'title', e.target.value)}
                          />
                          <Input
                            placeholder="Description"
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
                                  placeholder="Bank Name"
                                  value={gift.bankName || ''}
                                  onChange={(e) => updateGiftOption(index, 'bankName', e.target.value)}
                                />
                                <Input
                                  placeholder="Account Number"
                                  value={gift.accountNumber || ''}
                                  onChange={(e) => updateGiftOption(index, 'accountNumber', e.target.value)}
                                />
                                <Input
                                  placeholder="Account Holder"
                                  value={gift.accountHolder || ''}
                                  onChange={(e) => updateGiftOption(index, 'accountHolder', e.target.value)}
                                  style={{ gridColumn: '1 / -1' }}
                                />
                              </>
                            )}
                            {gift.type === 'store' && (
                              <>
                                <Input
                                  placeholder="Store Name"
                                  value={gift.storeName || ''}
                                  onChange={(e) => updateGiftOption(index, 'storeName', e.target.value)}
                                />
                                <Input
                                  placeholder="Store URL"
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
                <AddButton onClick={addGiftOption}>+ Add Gift Option</AddButton>
              </FormGroup>

              <SectionTitle style={{ marginTop: '3rem' }}>
                <Heart size={20} />
                Hotel Information
              </SectionTitle>

              <FormGroup>
                <Label>Hotel Name</Label>
                <Input
                  value={settings.hotelInfo?.name || ''}
                  onChange={(e) => updateHotelInfo('name', e.target.value)}
                  placeholder="Hotel name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Address</Label>
                <TextArea
                  value={settings.hotelInfo?.address || ''}
                  onChange={(e) => updateHotelInfo('address', e.target.value)}
                  placeholder="Hotel address"
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={settings.hotelInfo?.description || ''}
                  onChange={(e) => updateHotelInfo('description', e.target.value)}
                  placeholder="Hotel description for guests"
                />
              </FormGroup>

              <FormGroup>
                <Label>Phone</Label>
                <Input
                  value={settings.hotelInfo?.phone || ''}
                  onChange={(e) => updateHotelInfo('phone', e.target.value)}
                  placeholder="Hotel phone number"
                />
              </FormGroup>

              <FormGroup>
                <Label>Booking URL</Label>
                <Input
                  value={settings.hotelInfo?.bookingUrl || ''}
                  onChange={(e) => updateHotelInfo('bookingUrl', e.target.value)}
                  placeholder="Direct booking link"
                />
              </FormGroup>

              <FormGroup>
                <Label>Special Rate/Code</Label>
                <Input
                  value={settings.hotelInfo?.specialRate || ''}
                  onChange={(e) => updateHotelInfo('specialRate', e.target.value)}
                  placeholder="Special rate or booking code"
                />
              </FormGroup>
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
        </PreviewSection>
      </ContentGrid>

      <ActionButtons>
        <Button variant="secondary" onClick={onPreview}>
          <Eye size={20} />
          Preview Invitation
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </ActionButtons>
    </EditorContainer>
  );
};
