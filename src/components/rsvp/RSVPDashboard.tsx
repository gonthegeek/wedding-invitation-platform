import React from 'react';
import styled from 'styled-components';
import { useRSVPAnalytics } from '../../hooks/useRSVPAnalytics';
import { useTranslation } from '../../hooks/useLanguage';

interface RSVPDashboardProps {
  weddingId: string;
}

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textPrimary};
  
  &.primary {
    color: ${(p) => p.theme.colors.primary};
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
  color: ${(p) => p.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatSubtext = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
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
  background: ${(p) => p.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
  transition: width 0.3s ease;
`;

const RecentActivity = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityName = styled.div`
  font-weight: 500;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const ActivityDetails = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-top: 2px;
`;

const ActivityDate = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${(props) => {
    switch (props.status) {
      case 'attending':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'not_attending':
        return 'background-color: #fee2e2; color: #991b1b;';
      case 'maybe':
        return 'background-color: #fef3c7; color: #92400e;';
      default:
        return `background-color: ${props.theme.colors.surfaceAlt}; color: ${props.theme.colors.textSecondary};`;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textSecondary};
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
  background-color: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 6px;
`;

const DietaryRestriction = styled.span`
  font-weight: 500;
  color: ${(p) => p.theme.colors.textPrimary};
  text-transform: capitalize;
`;

const DietaryCount = styled.span`
  background-color: ${(p) => p.theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ weddingId }) => {
  const { analytics, loading, error } = useRSVPAnalytics(weddingId);
  const t = useTranslation();

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>{t.rsvpAnalytics.loading}</LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          {t.rsvpAnalytics.errorPrefix} {error}
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!analytics) {
    return (
      <DashboardContainer>
        <LoadingSpinner>{t.rsvpAnalytics.noData}</LoadingSpinner>
      </DashboardContainer>
    );
  }

  const formatRSVPStatus = (status: string) => {
    switch (status) {
      case 'attending':
        return t.rsvpAnalytics.statusAttending;
      case 'not_attending':
        return t.rsvpAnalytics.statusNotAttending;
      case 'maybe':
        return t.rsvpAnalytics.statusMaybe;
      default:
        return t.rsvpAnalytics.statusPending;
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
      <PageTitle>{t.rsvpAnalytics.pageTitle}</PageTitle>
      <PageDescription>
        {t.rsvpAnalytics.pageDescription}
      </PageDescription>

      <StatsGrid>
        <StatCard>
          <StatValue className="primary">{analytics.respondedCount}</StatValue>
          <StatLabel>{t.rsvpAnalytics.responsesReceived}</StatLabel>
          <StatSubtext>
            {t.rsvpAnalytics.responseRate.replace('{rate}', analytics.responseRate.toFixed(1))}
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="success">{analytics.attendingCeremony}</StatValue>
          <StatLabel>{t.rsvpAnalytics.attendingCeremony}</StatLabel>
          <StatSubtext>
            {t.rsvpAnalytics.plusNPlusOnes.replace('{count}', String(analytics.plusOnesData.attending))}
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="warning">{analytics.pendingCount}</StatValue>
          <StatLabel>{t.rsvpAnalytics.pendingResponses}</StatLabel>
          <StatSubtext>
            {t.rsvpAnalytics.outOfInvited.replace('{total}', String(analytics.totalInvited))}
          </StatSubtext>
        </StatCard>

        <StatCard>
          <StatValue className="primary">{analytics.attendingReception}</StatValue>
          <StatLabel>{t.rsvpAnalytics.attendingReception}</StatLabel>
          <StatSubtext>
            {t.rsvpAnalytics.attendanceRate.replace('{rate}', analytics.attendanceRate.toFixed(1))}
          </StatSubtext>
        </StatCard>
      </StatsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartTitle>{t.rsvpAnalytics.responseProgressTitle}</ChartTitle>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280' }}>
              <span>{`${t.rsvpAnalytics.attending} (${analytics.attendingCeremony})`}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280' }}>
              <span>{`${t.rsvpAnalytics.notAttending} (${analytics.notAttending})`}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280' }}>
              <span>{`${t.rsvpAnalytics.maybe} (${analytics.maybeCount})`}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280' }}>
              <span>{`${t.rsvpAnalytics.pending} (${analytics.pendingCount})`}</span>
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
          <ChartTitle>{t.rsvpAnalytics.dietaryRestrictionsTitle}</ChartTitle>
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
                    {t.rsvpAnalytics.moreRestrictions.replace('{count}', String(analytics.dietaryRestrictions.length - 8))}
                  </DietaryRestriction>
                  <DietaryCount>
                    {analytics.dietaryRestrictions.slice(8).reduce((sum, r) => sum + r.count, 0)}
                  </DietaryCount>
                </DietaryItem>
              )}
            </DietaryRestrictionsList>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
              {t.rsvpAnalytics.noDietaryRestrictions}
            </div>
          )}
        </ChartCard>
      </ChartsSection>

      <RecentActivity>
        <ChartTitle>{t.rsvpAnalytics.recentActivityTitle}</ChartTitle>
        {analytics.recentResponses.length > 0 ? (
          analytics.recentResponses.map((response, index) => (
            <ActivityItem key={index}>
              <ActivityInfo>
                <ActivityName>{response.guestName}</ActivityName>
                <ActivityDetails>
                  {response.attendingCeremony && response.attendingReception 
                    ? t.rsvpAnalytics.attendingCeremonyAndReception
                    : response.attendingCeremony 
                    ? t.rsvpAnalytics.attendingCeremonyOnly
                    : response.attendingReception
                    ? t.rsvpAnalytics.attendingReceptionOnly
                    : t.rsvpAnalytics.notAttendingLong
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
            {t.rsvpAnalytics.noResponsesYet}
          </div>
        )}
      </RecentActivity>
    </DashboardContainer>
  );
};
