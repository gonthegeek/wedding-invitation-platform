import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, Users, UserPlus, Send, Filter, RefreshCw, Upload, Trash2, MessageSquare } from 'lucide-react';
import { Layout } from '../components/shared/Layout';
import { RSVPDashboard } from '../components/rsvp/RSVPDashboard';
import { DetailedRSVPResponses } from '../components/rsvp/DetailedRSVPResponses';
import { GuestManagementContent } from '../components/guest/GuestManagementSection';
import { AddGuestModal } from '../components/guest/AddGuestModal';
import { EditGuestModal } from '../components/guest/EditGuestModal';
import { SendInvitationsModal } from '../components/guest/SendInvitationsModal';
import { DeletedGuestsModal } from '../components/guest/DeletedGuestsModal';
import { GuestImportExport } from '../components/guest/GuestImportExport';
import { useWedding } from '../hooks/useWedding';
import { useGuest } from '../hooks/useGuest';
import type { Guest } from '../types/guest';
import { useTranslation } from '../hooks/useLanguage';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${(p) => p.theme.colors.background};
`;

const Header = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textPrimary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      filter: brightness(0.95);
    }
  `
      : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surfaceAlt};
      color: ${props.theme.colors.textPrimary};
    }
  `}
`;

const TabsContainer = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const TabsList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 2rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textSecondary)};
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ActionBar = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const StatusFilter = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const SectionHeading = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const SectionSubtext = styled.p`
  margin: 0.5rem 0 0;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  flex-direction: column;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const ThemedLink = styled(Link)`
  margin-top: 1rem;
  color: ${(p) => p.theme.colors.primary};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContainer = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  color: ${(p) => p.theme.colors.textSecondary};
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.textPrimary};
  }
`;

const WeddingManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'responses'>('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal state for guest management
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isEditGuestModalOpen, setIsEditGuestModalOpen] = useState(false);
  const [isSendInvitationsModalOpen, setIsSendInvitationsModalOpen] = useState(false);
  const [isDeletedGuestsModalOpen, setIsDeletedGuestsModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  // Get current user's wedding data
  const { wedding, loading: weddingLoading, error: weddingError } = useWedding();
  
  // Get wedding ID from the hook instead of hardcoding
  const weddingId = wedding?.id;
  
  // Get guest data for modals and share with GuestManagementContent
  const { guests, loading, error, stats, refreshGuests, getDeletedGuests, restoreGuest, deleteGuest } = useGuest(weddingId);

  const t = useTranslation();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleGuestAdded = () => {
    refreshGuests();
  };

  const handleGuestUpdated = () => {
    refreshGuests();
    setSelectedGuest(null);
  };

  const handleInvitationsSent = () => {
    refreshGuests();
  };

  const handleImportComplete = () => {
    refreshGuests();
    setIsImportExportModalOpen(false);
  };
  
  // Show loading state while wedding data is being fetched
  if (weddingLoading) {
    return (
      <Layout>
        <PageContainer>
          <CenteredContainer>
            <p>{t.customization.loadingWeddingDetails}</p>
          </CenteredContainer>
        </PageContainer>
      </Layout>
    );
  }
  
  // Show error state if no wedding found
  if (weddingError || !weddingId) {
    return (
      <Layout>
        <PageContainer>
          <CenteredContainer>
            <p>{t.customization.noWeddingFound}</p>
            <ThemedLink to="/couple/create-wedding">{t.customization.createWedding}</ThemedLink>
          </CenteredContainer>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderContent>
            <HeaderTitle>{t.nav.weddingManagement}</HeaderTitle>
            <HeaderActions>
              <ActionButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                {t.common.refresh}
              </ActionButton>
            </HeaderActions>
          </HeaderContent>
        </Header>

      <TabsContainer>
        <TabsList>
          <Tab 
            $active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={16} />
            {t.weddingManagement.tabAnalytics}
          </Tab>
          <Tab 
            $active={activeTab === 'responses'} 
            onClick={() => setActiveTab('responses')}
          >
            <MessageSquare size={16} />
            {t.weddingManagement.tabResponses}
          </Tab>
          <Tab 
            $active={activeTab === 'guests'} 
            onClick={() => setActiveTab('guests')}
          >
            <Users size={16} />
            {t.weddingManagement.tabGuests}
          </Tab>
        </TabsList>
      </TabsContainer>

      <ContentContainer>
        {activeTab === 'dashboard' && (
          <>
            <ActionBar>
              <div>
                <SectionHeading>{t.dashboard.rsvpAnalyticsDashboard}</SectionHeading>
                <SectionSubtext>
                  {t.rsvpAnalytics.pageDescription}
                </SectionSubtext>
              </div>
              <ActionGroup>
                <StatusFilter 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">{t.rsvpAnalytics.filterAllGuests}</option>
                  <option value="pending">{t.rsvpAnalytics.statusPending}</option>
                  <option value="attending">{t.rsvpAnalytics.statusAttending}</option>
                  <option value="not_attending">{t.rsvpAnalytics.statusNotAttending}</option>
                  <option value="maybe">{t.rsvpAnalytics.statusMaybe}</option>
                </StatusFilter>
                <ActionButton>
                  <Filter size={16} />
                  {t.rsvpAnalytics.moreFilters}
                </ActionButton>
              </ActionGroup>
            </ActionBar>

            <RSVPDashboard weddingId={weddingId} />
          </>
        )}

        {activeTab === 'responses' && (
          <DetailedRSVPResponses weddingId={weddingId} />
        )}

        {activeTab === 'guests' && (
          <>
            <ActionBar>
              <div>
                <SectionHeading>{t.guestManagement.sectionTitle}</SectionHeading>
                <SectionSubtext>
                  {t.guestManagement.sectionSubtext}
                </SectionSubtext>
              </div>
              <ActionGroup>
                <ActionButton variant="primary" onClick={() => setIsAddGuestModalOpen(true)}>
                  <UserPlus size={16} />
                  {t.guestManagement.addGuestBtn}
                </ActionButton>
                <ActionButton onClick={() => setIsSendInvitationsModalOpen(true)}>
                  <Send size={16} />
                  {t.guestManagement.sendInvitationsBtn}
                </ActionButton>
                <ActionButton onClick={() => setIsDeletedGuestsModalOpen(true)}>
                  <Trash2 size={16} />
                  {t.guestManagement.viewDeletedBtn}
                </ActionButton>
                <ActionButton onClick={() => setIsImportExportModalOpen(true)}>
                  <Upload size={16} />
                  {t.guestManagement.importGuestsBtn}
                </ActionButton>
              </ActionGroup>
            </ActionBar>

            <GuestManagementContent 
              weddingId={weddingId} 
              onEditGuest={(g) => { setSelectedGuest(g); setIsEditGuestModalOpen(true); }}
              guests={guests}
              loading={loading}
              error={error}
              stats={stats}
              refreshGuests={refreshGuests}
              getDeletedGuests={getDeletedGuests}
              restoreGuest={restoreGuest}
              deleteGuest={deleteGuest}
            />
          </>
        )}
      </ContentContainer>

      {/* Guest Management Modals */}
      {weddingId && (
        <>
          <AddGuestModal
            isOpen={isAddGuestModalOpen}
            onClose={() => setIsAddGuestModalOpen(false)}
            weddingId={weddingId}
            onGuestAdded={handleGuestAdded}
          />

          <EditGuestModal
            isOpen={isEditGuestModalOpen}
            onClose={() => setIsEditGuestModalOpen(false)}
            guest={selectedGuest}
            onGuestUpdated={handleGuestUpdated}
          />

          <SendInvitationsModal
            isOpen={isSendInvitationsModalOpen}
            onClose={() => setIsSendInvitationsModalOpen(false)}
            guests={guests}
            onInvitationsSent={handleInvitationsSent}
          />

          <DeletedGuestsModal
            isOpen={isDeletedGuestsModalOpen}
            onClose={() => setIsDeletedGuestsModalOpen(false)}
            getDeletedGuests={getDeletedGuests}
            restoreGuest={restoreGuest}
          />

          {/* Import/Export Modal */}
          {isImportExportModalOpen && (
            <Overlay>
              <ModalContainer>
                <CloseButton onClick={() => setIsImportExportModalOpen(false)}>
                  ×
                </CloseButton>
                <GuestImportExport
                  weddingId={weddingId}
                  guests={guests}
                  onImportComplete={handleImportComplete}
                />
              </ModalContainer>
            </Overlay>
          )}
        </>
      )}
    </PageContainer>
    </Layout>
  );
};

export default WeddingManagementPage;
