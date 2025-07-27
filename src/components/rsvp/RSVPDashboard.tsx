import React from 'react';
import styled from 'styled-components';
import { useRSVPAnalytics } from '../../hooks/useRSVPAnalytics';

interface RSVPDashboardProps {
  weddingId: string;
}

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  
  &.primary {
    color: #3b82f6;
  }
  
  &.success {
    color: #10b981;
  }
  
  &.warning {
    color: #f59e0b;
  }
  
  &.danger {
    color: #ef4444;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatSubtext = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 4px;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const ActivityDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 2px;
`;

const ActivityDate = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'attending':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'not_attending':
        return 'background-color: #fee2e2; color: #991b1b;';
      case 'maybe':
        return 'background-color: #fef3c7; color: #92400e;';
      default:
        return 'background-color: #f3f4f6; color: #374151;';
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const DietaryRestrictionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DietaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
`;

const DietaryRestriction = styled.span`
  font-weight: 500;
  color: #374151;
  text-transform: capitalize;
`;

const DietaryCount = styled.span`
  background-color: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ weddingId }) => {
  const { analytics, loading, error } = useRSVPAnalytics(weddingId);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Loading RSVP analytics...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          Error loading RSVP analytics: {error}
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!analytics) {
    return (
      <DashboardContainer>
        <LoadingSpinner>No RSVP data available</LoadingSpinner>
      </DashboardContainer>
    );
  }

  const formatRSVPStatus = (status: string) => {
    switch (status) {
      case 'attending':
        return 'Attending';
      case 'not_attending':
        return 'Not Attending';
      case 'maybe':
        return 'Maybe';
      default:
        return 'Pending';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardContainer>
      <PageTitle>RSVP Dashboard</PageTitle>
      <PageDescription>
        Track guest responses and manage your wedding attendance in real-time
      </PageDescription>

      <StatsGrid>
        <StatCard>
          <StatValue className="primary">{analytics.respondedCount}</StatValue>
          <StatLabel>Responses Received</StatLabel>
          <StatSubtext>
            {analytics.responseRate.toFixed(1)}% response rate
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="success">{analytics.attendingCeremony}</StatValue>
          <StatLabel>Attending Ceremony</StatLabel>
          <StatSubtext>
            Plus {analytics.plusOnesData.attending} plus ones
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="warning">{analytics.pendingCount}</StatValue>
          <StatLabel>Pending Responses</StatLabel>
          <StatSubtext>
            Out of {analytics.totalInvited} invited
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="primary">{analytics.attendingReception}</StatValue>
          <StatLabel>Attending Reception</StatLabel>
          <StatSubtext>
            {analytics.attendanceRate.toFixed(1)}% attendance rate
          </StatSubtext>
        </StatCard>
      </StatsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartTitle>Response Progress</ChartTitle>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Attending ({analytics.attendingCeremony})</span>
              <span>{((analytics.attendingCeremony / analytics.totalGuests) * 100).toFixed(1)}%</span>
            </div>
            <ProgressBar>
              <ProgressFill 
                percentage={(analytics.attendingCeremony / analytics.totalGuests) * 100}
                color="#10b981"
              />
            </ProgressBar>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Not Attending ({analytics.notAttending})</span>
              <span>{((analytics.notAttending / analytics.totalGuests) * 100).toFixed(1)}%</span>
            </div>
            <ProgressBar>
              <ProgressFill 
                percentage={(analytics.notAttending / analytics.totalGuests) * 100}
                color="#ef4444"
              />
            </ProgressBar>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Maybe ({analytics.maybeCount})</span>
              <span>{((analytics.maybeCount / analytics.totalGuests) * 100).toFixed(1)}%</span>
            </div>
            <ProgressBar>
              <ProgressFill 
                percentage={(analytics.maybeCount / analytics.totalGuests) * 100}
                color="#f59e0b"
              />
            </ProgressBar>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Pending ({analytics.pendingCount})</span>
              <span>{((analytics.pendingCount / analytics.totalGuests) * 100).toFixed(1)}%</span>
            </div>
            <ProgressBar>
              <ProgressFill 
                percentage={(analytics.pendingCount / analytics.totalGuests) * 100}
                color="#6b7280"
              />
            </ProgressBar>
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Dietary Restrictions</ChartTitle>
          {analytics.dietaryRestrictions.length > 0 ? (
            <DietaryRestrictionsList>
              {analytics.dietaryRestrictions.slice(0, 8).map((restriction, index) => (
                <DietaryItem key={index}>
                  <DietaryRestriction>{restriction.restriction}</DietaryRestriction>
                  <DietaryCount>{restriction.count}</DietaryCount>
                </DietaryItem>
              ))}
              {analytics.dietaryRestrictions.length > 8 && (
                <DietaryItem>
                  <DietaryRestriction>
                    +{analytics.dietaryRestrictions.length - 8} more restrictions
                  </DietaryRestriction>
                  <DietaryCount>
                    {analytics.dietaryRestrictions.slice(8).reduce((sum, r) => sum + r.count, 0)}
                  </DietaryCount>
                </DietaryItem>
              )}
            </DietaryRestrictionsList>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No dietary restrictions reported yet
            </div>
          )}
        </ChartCard>
      </ChartsSection>

      <RecentActivity>
        <ChartTitle>Recent RSVP Activity</ChartTitle>
        {analytics.recentResponses.length > 0 ? (
          analytics.recentResponses.map((response, index) => (
            <ActivityItem key={index}>
              <ActivityInfo>
                <ActivityName>{response.guestName}</ActivityName>
                <ActivityDetails>
                  {response.attendingCeremony && response.attendingReception 
                    ? 'Attending ceremony and reception'
                    : response.attendingCeremony 
                    ? 'Attending ceremony only'
                    : response.attendingReception
                    ? 'Attending reception only'
                    : 'Not attending'
                  }
                </ActivityDetails>
              </ActivityInfo>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <StatusBadge status={response.status}>
                  {formatRSVPStatus(response.status)}
                </StatusBadge>
                <ActivityDate>{formatDate(response.date)}</ActivityDate>
              </div>
            </ActivityItem>
          ))
        ) : (
          <div style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
            No RSVP responses yet
          </div>
        )}
      </RecentActivity>
    </DashboardContainer>
  );
};
