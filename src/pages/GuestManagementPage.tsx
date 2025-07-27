import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/shared/Layout';
import { useWedding } from '../hooks/useWedding';
import { useGuest } from '../hooks/useGuest';
import { AddGuestModal } from '../components/guest/AddGuestModal';
import { EditGuestModal } from '../components/guest/EditGuestModal';
import { SendInvitationsModal } from '../components/guest/SendInvitationsModal';
import { DeletedGuestsModal } from '../components/guest/DeletedGuestsModal';
import { Plus, Users, Upload, Mail, Search, Trash2 } from 'lucide-react';
import type { Guest } from '../types/guest';

const PageContainer = styled.div`
  width: 100%;
  padding: var(--spacing-lg);
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  color: var(--text-primary);
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: var(--primary-color);
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: var(--background);
    color: var(--text-primary);
    border: 1px solid var(--border);
    
    &:hover {
      background: #f3f4f6;
    }
  `}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const SearchAndFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  width: 1rem;
  height: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const GuestsTable = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 2fr 2fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 2fr 2fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const GuestName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const GuestEmail = styled.div`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const RSVPStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'attending':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'not_attending':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'maybe':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const GuestManagementPage: React.FC = () => {
  const { wedding } = useWedding();
  const { guests, loading, error, stats, refreshGuests, getDeletedGuests, restoreGuest } = useGuest(wedding?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isEditGuestModalOpen, setIsEditGuestModalOpen] = useState(false);
  const [isSendInvitationsModalOpen, setIsSendInvitationsModalOpen] = useState(false);
  const [isDeletedGuestsModalOpen, setIsDeletedGuestsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Modal handlers
  const handleAddGuest = () => {
    setIsAddGuestModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditGuestModalOpen(true);
  };

  const handleImportGuests = () => {
    // TODO: Implement import guests functionality
    alert('Import guests functionality coming soon!');
  };

  const handleSendInvitations = () => {
    setIsSendInvitationsModalOpen(true);
  };

  const handleGuestAdded = () => {
    refreshGuests(); // Refresh the guest list
  };

  const handleGuestUpdated = () => {
    refreshGuests(); // Refresh the guest list
    setSelectedGuest(null);
  };

  const handleInvitationsSent = () => {
    refreshGuests(); // Refresh the guest list to update invitation status
  };

  // Filter guests based on search and status
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = !searchTerm || 
      `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || guest.rsvpStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatRSVPStatus = (status: string) => {
    switch (status) {
      case 'attending': return 'Attending';
      case 'not_attending': return 'Not Attending';
      case 'maybe': return 'Maybe';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
            Error: {error}
          </div>
        </PageContainer>
      </Layout>
    );
  }

  if (!wedding) {
    return (
      <Layout>
        <PageContainer>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            No wedding found. Please create a wedding first.
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Guest Management</PageTitle>
          <ActionButtons>
            <ActionButton variant="secondary" onClick={handleImportGuests}>
              <Upload size={16} />
              Import Guests
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleSendInvitations}>
              <Mail size={16} />
              Send Invitations
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => setIsDeletedGuestsModalOpen(true)}>
              <Trash2 size={16} />
              View Deleted
            </ActionButton>
            <ActionButton variant="primary" onClick={handleAddGuest}>
              <Plus size={16} />
              Add Guest
            </ActionButton>
          </ActionButtons>
        </PageHeader>

        {stats && (
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.totalGuests}</StatNumber>
              <StatLabel>Total Guests</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.respondedCount}</StatNumber>
              <StatLabel>Responded</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.attendingCount}</StatNumber>
              <StatLabel>Attending</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.totalPlusOnes}</StatNumber>
              <StatLabel>Plus Ones</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{Math.round(stats.responseRate)}%</StatNumber>
              <StatLabel>Response Rate</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{Math.round(stats.attendanceRate)}%</StatNumber>
              <StatLabel>Attendance Rate</StatLabel>
            </StatCard>
          </StatsGrid>
        )}

        <SearchAndFilter>
          <SearchBox>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search guests by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterSelect 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="attending">Attending</option>
            <option value="not_attending">Not Attending</option>
            <option value="maybe">Maybe</option>
          </FilterSelect>
        </SearchAndFilter>

        <GuestsTable>
          <TableHeader>
            <div>Name</div>
            <div>Email</div>
            <div className="hide-mobile">RSVP Status</div>
            <div className="hide-mobile">Plus Ones</div>
            <div className="hide-tablet">Invite Code</div>
            <div className="hide-tablet">Actions</div>
          </TableHeader>
          
          {filteredGuests.length === 0 ? (
            <EmptyState>
              {guests.length === 0 ? (
                <>
                  <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h3>No guests yet</h3>
                  <p>Start by adding your first guest or importing a guest list.</p>
                </>
              ) : (
                <>
                  <h3>No guests match your search</h3>
                  <p>Try adjusting your search terms or filters.</p>
                </>
              )}
            </EmptyState>
          ) : (
            filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <div>
                  <GuestName>{guest.firstName} {guest.lastName}</GuestName>
                  <GuestEmail className="show-mobile">{guest.email}</GuestEmail>
                </div>
                <div className="hide-mobile">
                  <GuestEmail>{guest.email}</GuestEmail>
                </div>
                <div className="hide-mobile">
                  <RSVPStatus status={guest.rsvpStatus}>
                    {formatRSVPStatus(guest.rsvpStatus)}
                  </RSVPStatus>
                </div>
                <div className="hide-mobile">{guest.plusOnes?.length || 0}</div>
                <div className="hide-tablet" style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {guest.inviteCode}
                </div>
                <div className="hide-tablet">
                  <ActionButton 
                    variant="secondary" 
                    style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleEditGuest(guest)}
                  >
                    Edit
                  </ActionButton>
                </div>
              </TableRow>
            ))
          )}
        </GuestsTable>

        {/* Add Guest Modal */}
        {wedding && (
          <AddGuestModal
            isOpen={isAddGuestModalOpen}
            onClose={() => setIsAddGuestModalOpen(false)}
            weddingId={wedding.id}
            onGuestAdded={handleGuestAdded}
          />
        )}

        {/* Edit Guest Modal */}
        <EditGuestModal
          isOpen={isEditGuestModalOpen}
          onClose={() => setIsEditGuestModalOpen(false)}
          guest={selectedGuest}
          onGuestUpdated={handleGuestUpdated}
        />

        {/* Send Invitations Modal */}
        <SendInvitationsModal
          isOpen={isSendInvitationsModalOpen}
          onClose={() => setIsSendInvitationsModalOpen(false)}
          guests={guests}
          onInvitationsSent={handleInvitationsSent}
        />

        {/* Deleted Guests Modal */}
        <DeletedGuestsModal
          isOpen={isDeletedGuestsModalOpen}
          onClose={() => setIsDeletedGuestsModalOpen(false)}
          getDeletedGuests={getDeletedGuests}
          restoreGuest={restoreGuest}
        />
      </PageContainer>
    </Layout>
  );
};
