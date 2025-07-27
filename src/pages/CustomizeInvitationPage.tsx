import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Eye, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useLanguage';
import { WeddingService } from '../services/weddingService';
import { WeddingDetailsEditor } from '../components/wedding/WeddingDetailsEditor';
import type { Wedding, WeddingSettings } from '../types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f1f5ff 100%);
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: between;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const HeaderTitle = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #667eea'};
  background: ${props => props.variant === 'primary' ? '#667eea' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#667eea'};
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  text-align: center;
  color: #dc2626;
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #059669;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const CustomizeInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const t = useTranslation();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchWedding = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);

        // Get the user's wedding
        const weddingData = await WeddingService.getWeddingByCouple(currentUser.uid);
        if (!weddingData) {
          setError(t.customization.noWeddingFound);
          return;
        }

        setWedding(weddingData);
      } catch (err) {
        console.error('Error fetching wedding:', err);
        setError(t.customization.failedToLoad);
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [currentUser, t]);

  const handleSave = async (settings: WeddingSettings) => {
    if (!wedding) return;

    try {
      setError(null);

      console.log('Saving wedding settings:', settings);
      console.log('Wedding ID:', wedding.id);

      // Update the wedding with new settings
      await WeddingService.updateWedding(wedding.id, {
        settings: settings
      });

      console.log('Wedding updated successfully');

      // Update local state
      const updatedWedding = { ...wedding, settings };
      setWedding(updatedWedding);
      console.log('Local state updated:', updatedWedding);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving wedding settings:', err);
      setError(t.customization.failedToSave);
    }
  };

  const handleWeddingUpdate = async (updatedWedding: Partial<Wedding>) => {
    if (!wedding) return;

    try {
      setError(null);

      console.log('Updating wedding data:', updatedWedding);

      // Update the wedding with new data
      await WeddingService.updateWedding(wedding.id, updatedWedding);

      console.log('Wedding updated successfully');

      // Update local state
      const newWedding = { ...wedding, ...updatedWedding };
      setWedding(newWedding);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error('Error updating wedding:', err);
      setError(t.customization.failedToSave);
    }
  };

  const handlePreview = () => {
    if (!wedding) return;
    
    // Open the wedding preview in a new tab
    const previewUrl = `/wedding/${wedding.id}`;
    window.open(previewUrl, '_blank');
  };

  const handleBack = () => {
    navigate('/couple/dashboard');
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={handleBack}>
              <ArrowLeft size={16} />
              {t.customization.backToDashboard}
            </BackButton>
            <HeaderTitle>
              <Title>{t.customization.customizeInvitation}</Title>
              <Subtitle>{t.customization.loadingWeddingDetails}</Subtitle>
            </HeaderTitle>
          </HeaderContent>
        </Header>
        <LoadingContainer>
          {t.customization.loadingWeddingDetails}
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={handleBack}>
              <ArrowLeft size={16} />
              {t.customization.backToDashboard}
            </BackButton>
            <HeaderTitle>
              <Title>{t.customization.customizeInvitation}</Title>
              <Subtitle>{t.customization.errorLoadingDetails}</Subtitle>
            </HeaderTitle>
          </HeaderContent>
        </Header>
        <ErrorContainer>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>{t.customization.unableToLoadWedding}</h3>
          <p style={{ margin: '0 0 1rem' }}>{error}</p>
          <Button onClick={() => window.location.reload()}>
            {t.customization.tryAgain}
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }

  if (!wedding) {
    return (
      <PageContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={handleBack}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </BackButton>
            <HeaderTitle>
              <Title>{t.customization.customizeInvitation}</Title>
              <Subtitle>{t.customization.noWeddingFound}</Subtitle>
            </HeaderTitle>
          </HeaderContent>
        </Header>
        <ErrorContainer>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>{t.customization.noWeddingFound}</h3>
          <p style={{ margin: '0 0 1rem' }}>
            {t.customization.createWeddingFirst}
          </p>
          <Button onClick={() => navigate('/couple/create-wedding')}>
            {t.customization.createWedding}
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {showSuccess && (
        <SuccessMessage>
          <Save size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {t.customization.settingsSavedSuccessfully}
        </SuccessMessage>
      )}

      <Header>
        <HeaderContent>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={16} />
            {t.customization.backToDashboard}
          </BackButton>
          <HeaderTitle>
            <Title>{t.customization.customizeInvitation}</Title>
            <Subtitle>
              {t.customization.personalizeInvitation} {wedding.brideFirstName} & {wedding.groomFirstName}
            </Subtitle>
          </HeaderTitle>
          <ActionButtons>
            <Button variant="secondary" onClick={handlePreview}>
              <Eye size={16} />
              {t.customization.preview}
            </Button>
          </ActionButtons>
        </HeaderContent>
      </Header>

      <WeddingDetailsEditor
        wedding={wedding}
        onSave={handleSave}
        onPreview={handlePreview}
        onWeddingUpdate={handleWeddingUpdate}
      />
    </PageContainer>
  );
};
