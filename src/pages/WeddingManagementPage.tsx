import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, Users, UserPlus, Send, Calendar, Download, Filter, RefreshCw, Upload, Trash2, MessageSquare } from 'lucide-react';
import { Layout } from '../components/shared/Layout';
import { RSVPDashboard } from '../components/rsvp/RSVPDashboard';
import { DetailedRSVPResponses } from '../components/rsvp/DetailedRSVPResponses';
import { GuestManagementContent } from '../components/guest/GuestManagementSection';
import { AddGuestModal } from '../components/guest/AddGuestModal';
import { EditGuestModal } from '../components/guest/EditGuestModal';
import { SendInvitationsModal } from '../components/guest/SendInvitationsModal';
import { DeletedGuestsModal } from '../components/guest/DeletedGuestsModal';
import { useWedding } from '../hooks/useWedding';
import { useGuest } from '../hooks/useGuest';
import type { Guest } from '../types/guest';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
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
  color: #1f2937;
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
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}
`;

const TabsContainer = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
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
  color: ${props => props.$active ? '#3b82f6' : '#6b7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ActionBar = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
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
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  // Get current user's wedding data
  const { wedding, loading: weddingLoading, error: weddingError } = useWedding();
  
  // Get wedding ID from the hook instead of hardcoding
  const weddingId = wedding?.id;
  
  // Get guest data for modals
  const { guests, refreshGuests, getDeletedGuests, restoreGuest } = useGuest(weddingId);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Guest management handlers
  const handleAddGuest = () => {
    setIsAddGuestModalOpen(true);
  };

  const handleSendInvitations = () => {
    setIsSendInvitationsModalOpen(true);
  };

  const handleViewDeleted = () => {
    setIsDeletedGuestsModalOpen(true);
  };

  const handleImportGuests = () => {
    alert('Import guests functionality coming soon!');
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditGuestModalOpen(true);
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
  
  // Show loading state while wedding data is being fetched
  if (weddingLoading) {
    return (
      <Layout>
        <PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <p>Loading wedding data...</p>
          </div>
        </PageContainer>
      </Layout>
    );
  }
  
  // Show error state if no wedding found
  if (weddingError || !weddingId) {
    return (
      <Layout>
        <PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column' }}>
            <p>No wedding found for this account.</p>
            <Link to="/couple/create-wedding" style={{ marginTop: '1rem', color: '#3b82f6' }}>
              Create a wedding first
            </Link>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  const handleExportData = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon!');
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderContent>
            <HeaderTitle>Wedding Management</HeaderTitle>
            <HeaderActions>
              <ActionButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </ActionButton>
              <ActionButton onClick={handleExportData}>
                <Download size={16} />
                Export Data
              </ActionButton>
              <ActionButton variant="primary" as={Link} to="/admin/settings">
                <Calendar size={16} />
                Wedding Settings
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
            RSVP Analytics
          </Tab>
          <Tab 
            $active={activeTab === 'responses'} 
            onClick={() => setActiveTab('responses')}
          >
            <MessageSquare size={16} />
            Detailed Responses
          </Tab>
          <Tab 
            $active={activeTab === 'guests'} 
            onClick={() => setActiveTab('guests')}
          >
            <Users size={16} />
            Guest Management
          </Tab>
        </TabsList>
      </TabsContainer>

      <ContentContainer>
        {activeTab === 'dashboard' && (
          <>
            <ActionBar>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                  RSVP Analytics & Insights
                </h2>
                <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Track guest responses and wedding attendance in real-time
                </p>
              </div>
              <ActionGroup>
                <StatusFilter 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Guests</option>
                  <option value="attending">Attending</option>
                  <option value="not_attending">Not Attending</option>
                  <option value="maybe">Maybe</option>
                  <option value="pending">Pending</option>
                </StatusFilter>
                <ActionButton>
                  <Filter size={16} />
                  More Filters
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
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                  Guest List Management
                </h2>
                <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Manage your guest list, send invitations, and track responses
                </p>
              </div>
              <ActionGroup>
                <ActionButton variant="primary" onClick={handleAddGuest}>
                  <UserPlus size={16} />
                  Add Guest
                </ActionButton>
                <ActionButton onClick={handleSendInvitations}>
                  <Send size={16} />
                  Send Invitations
                </ActionButton>
                <ActionButton onClick={handleViewDeleted}>
                  <Trash2 size={16} />
                  View Deleted
                </ActionButton>
                <ActionButton onClick={handleImportGuests}>
                  <Upload size={16} />
                  Import Guests
                </ActionButton>
              </ActionGroup>
            </ActionBar>

            <GuestManagementContent 
              weddingId={weddingId} 
              onEditGuest={handleEditGuest}
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
        </>
      )}
    </PageContainer>
    </Layout>
  );
};

export default WeddingManagementPage;
