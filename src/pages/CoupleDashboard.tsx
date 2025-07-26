import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { useWedding } from '../hooks/useWedding';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .metric {
    font-size: 2rem;
    font-weight: 700;
    color: #3b82f6;
    margin: 0;
  }

  .description {
    color: #6b7280;
    margin: 0.5rem 0;
  }
`;

const ActionSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  h3 {
    margin: 0 0 1.5rem 0;
    color: #1f2937;
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
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
  `}
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #1f2937;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    color: #6b7280;
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
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
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
            <h1>Welcome to Your Wedding Dashboard</h1>
            <p className="subtitle">Let's create your beautiful wedding invitation!</p>
          </WelcomeSection>

          <DashboardCard style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3>🎉 Ready to Get Started?</h3>
            <p className="description">
              Create your wedding invitation and share it with your guests. 
              Our easy-to-use wizard will guide you through the process step by step.
            </p>
            <ActionButton to="/couple/create-wedding" variant="primary" style={{ marginTop: '1rem' }}>
              Create Your Wedding Invitation
            </ActionButton>
          </DashboardCard>

          <ActionSection>
            <h3>What You Can Do</h3>
            <ActionButtons>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>📝 Design & Customize</h4>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  Choose templates, colors, and fonts that match your style
                </p>
              </div>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>👥 Manage Guests</h4>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  Add guests, track RSVPs, and send invitations
                </p>
              </div>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>🌐 Share Online</h4>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  Get a custom URL to share your invitation easily
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
            <h3>Your Wedding</h3>
            <p className="description">
              {wedding.ceremonyLocation.name}
            </p>
            <ActionButton to="/couple/edit-wedding" variant="primary">
              Edit Details
            </ActionButton>
          </DashboardCard>
          
          <DashboardCard>
            <h3>RSVPs Received</h3>
            <p className="metric">0</p>
            <p className="description">of 0 invited</p>
          </DashboardCard>
          
          <DashboardCard>
            <h3>Guests Invited</h3>
            <p className="metric">0</p>
            <p className="description">No guests added yet</p>
          </DashboardCard>
          
          <DashboardCard>
            <h3>Days Until Wedding</h3>
            <p className="metric">{getDaysUntilWedding(wedding.weddingDate)}</p>
            <p className="description">days to go!</p>
          </DashboardCard>
        </DashboardGrid>

        <ActionSection>
          <h3>Manage Your Wedding</h3>
          <ActionButtons>
            <ActionButton to="/couple/customize" variant="primary">
              Customize Invitation
            </ActionButton>
            <ActionButton to="/couple/guests" variant="secondary">
              Manage Guest List
            </ActionButton>
            <ActionButton to="/couple/rsvps" variant="secondary">
              View RSVPs
            </ActionButton>
            <ActionButton to={`/invitation/${wedding.subdomain}`} variant="secondary" target="_blank">
              Preview Invitation
            </ActionButton>
          </ActionButtons>
        </ActionSection>
      </DashboardContainer>
    </Layout>
  );
};
