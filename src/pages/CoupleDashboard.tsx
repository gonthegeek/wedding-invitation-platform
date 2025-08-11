import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { useWedding } from '../hooks/useWedding';
import styled from 'styled-components';
import { useTranslation } from '../hooks/useLanguage';

const DashboardContainer = styled.div`
  width: 100%;
  padding: var(--spacing-lg);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DashboardCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25rem;
    font-weight: 600;
  }

  .metric {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }

  .description {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0.5rem 0;
  }
`;

const ActionSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0 0 1.5rem 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled(Link)<{ variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      filter: brightness(0.95);
      transform: translateY(-1px);
    }
  ` : `
    background: ${props.theme.colors.surfaceAlt};
    color: ${props.theme.colors.textPrimary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surfaceAlt};
      transform: translateY(-1px);
      filter: brightness(0.98);
    }
  `}
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.125rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const CoupleDashboard: React.FC = () => {
  const { wedding, loading } = useWedding();
  const navigate = useNavigate();
  const t = useTranslation();

  const handleCreateWedding = () => {
    navigate('/couple/create-wedding');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilWedding = (weddingDate: Date) => {
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <Layout>
        <DashboardContainer>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </DashboardContainer>
      </Layout>
    );
  }

  if (!wedding) {
    return (
      <Layout>
        <DashboardContainer>
          <WelcomeSection>
            <h1>{t.dashboard.welcomeTitle}</h1>
            <p className="subtitle">{t.dashboard.welcomeSubtitle}</p>
          </WelcomeSection>

          <DashboardCard style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3>{t.dashboard.readyToGetStarted}</h3>
            <p className="description">
              {t.dashboard.readyDescription}
            </p>
            <button 
              onClick={handleCreateWedding}
              style={{
                marginTop: '1rem',
                padding: '1rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t.dashboard.createInvitationCTA}
            </button>
          </DashboardCard>

          <ActionSection>
            <h3>{t.dashboard.whatYouCanDo}</h3>
            <ActionButtons>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{t.dashboard.designCustomizeTitle}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {t.dashboard.designCustomizeDesc}
                </p>
              </div>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{t.dashboard.weddingManagementTitle}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {t.dashboard.weddingManagementDesc}
                </p>
              </div>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{t.dashboard.shareOnlineTitle}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {t.dashboard.shareOnlineDesc}
                </p>
              </div>
            </ActionButtons>
          </ActionSection>
        </DashboardContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardContainer>
        <WelcomeSection>
          <h1>{wedding.brideFirstName} & {wedding.groomFirstName}</h1>
          <p className="subtitle">{formatDate(wedding.weddingDate)}</p>
        </WelcomeSection>

        <DashboardGrid>
          <DashboardCard>
            <h3>{t.dashboard.yourWedding}</h3>
            <p className="description">
              {wedding.ceremonyLocation.name}
            </p>
            <ActionButton to="/couple/wedding-details" variant="primary">
              {t.dashboard.editWeddingDetails}
            </ActionButton>
          </DashboardCard>
          
          <DashboardCard>
            <h3>{t.dashboard.rsvpsReceived}</h3>
            <p className="metric">0</p>
            <p className="description">{t.dashboard.ofInvited.replace('{total}', '0')}</p>
          </DashboardCard>
          
          <DashboardCard>
            <h3>{t.dashboard.guestsInvited}</h3>
            <p className="metric">0</p>
            <p className="description">{t.dashboard.noGuestsYet}</p>
          </DashboardCard>
          
          <DashboardCard>
            <h3>{t.dashboard.daysUntilWedding}</h3>
            <p className="metric">{getDaysUntilWedding(wedding.weddingDate)}</p>
            <p className="description">{t.dashboard.daysToGo}</p>
          </DashboardCard>
        </DashboardGrid>

        <ActionSection>
          <h3>{t.dashboard.manageYourWedding}</h3>
          <ActionButtons>
            <ActionButton to="/couple/wedding-management" variant="primary">
              {t.dashboard.managementHub}
            </ActionButton>
            <ActionButton to="/couple/rsvp-dashboard" variant="primary">
              {t.dashboard.rsvpAnalyticsDashboard}
            </ActionButton>
            <ActionButton to="/couple/customize" variant="primary">
              {t.customization.customizeInvitation}
            </ActionButton>
            <ActionButton to={`/wedding/${wedding.id}`} variant="secondary" target="_blank">
              {t.dashboard.viewInvitation}
            </ActionButton>
          </ActionButtons>
        </ActionSection>
      </DashboardContainer>
    </Layout>
  );
};
