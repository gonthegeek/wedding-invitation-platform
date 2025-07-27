import React, { useState } from 'react';
import styled from 'styled-components';
import { useGuest } from '../../hooks/useGuest';
import { AddGuestModal } from './AddGuestModal';
import { EditGuestModal } from './EditGuestModal';
import { SendInvitationsModal } from './SendInvitationsModal';
import { DeletedGuestsModal } from './DeletedGuestsModal';
import { Users, Search } from 'lucide-react';
import type { Guest } from '../../types/guest';

const ContentContainer = styled.div`
  width: 100%;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const SearchAndFilters = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1rem;
  height: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const GuestTable = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
`;

const TableRow = styled.div<{ isEven?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: ${props => props.isEven ? '#f9fafb' : 'white'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const GuestName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const GuestEmail = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'attending':
        return 'background: #dcfce7; color: #166534;';
      case 'not_attending':
        return 'background: #fee2e2; color: #dc2626;';
      case 'maybe':
        return 'background: #fef3c7; color: #d97706;';
      default:
        return 'background: #f3f4f6; color: #6b7280;';
    }
  }}
`;

const ActionButtonsCell = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallActionButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
`;

interface GuestManagementContentProps {
  weddingId: string;
  onEditGuest?: (guest: Guest) => void;
}

export const GuestManagementContent: React.FC<GuestManagementContentProps> = ({ 
  weddingId, 
  onEditGuest: externalOnEditGuest
}) => {
  const { guests, loading, error, stats, refreshGuests, getDeletedGuests, restoreGuest, deleteGuest } = useGuest(weddingId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isEditGuestModalOpen, setIsEditGuestModalOpen] = useState(false);
  const [isSendInvitationsModalOpen, setIsSendInvitationsModalOpen] = useState(false);
  const [isDeletedGuestsModalOpen, setIsDeletedGuestsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Filter guests based on search and status
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || guest.rsvpStatus === statusFilter;
    
    // Check if guest is not deleted (safe property access)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNotDeleted = !(guest as any).isDeleted;
    
    return matchesSearch && matchesStatus && isNotDeleted;
  });

  const handleEditGuest = (guest: Guest) => {
    if (externalOnEditGuest) {
      externalOnEditGuest(guest);
    } else {
      setSelectedGuest(guest);
      setIsEditGuestModalOpen(true);
    }
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

  const handleDeleteGuest = async (guest: Guest) => {
    if (confirm(`Are you sure you want to delete ${guest.firstName} ${guest.lastName}?`)) {
      try {
        const success = await deleteGuest(guest.id);
        if (success) {
          refreshGuests(); // Refresh the guest list
        } else {
          alert('Failed to delete guest. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting guest:', error);
        alert('Failed to delete guest. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <ContentContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading guests...
        </div>
      </ContentContainer>
    );
  }

  if (error) {
    return (
      <ContentContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
          Error loading guests: {error}
        </div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      {/* Stats */}
      <StatsContainer>
        <StatCard>
          <StatIcon color="#3b82f6">
            <Users size={20} />
          </StatIcon>
          <StatValue>{stats?.totalGuests || 0}</StatValue>
          <StatLabel>Total Guests</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#10b981">
            <Users size={20} />
          </StatIcon>
          <StatValue>{stats?.respondedCount || 0}</StatValue>
          <StatLabel>Responded</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f59e0b">
            <Users size={20} />
          </StatIcon>
          <StatValue>{stats?.attendingCount || 0}</StatValue>
          <StatLabel>Attending</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#8b5cf6">
            <Users size={20} />
          </StatIcon>
          <StatValue>{guests.reduce((sum, g) => sum + (g.plusOnes?.length || 0), 0)}</StatValue>
          <StatLabel>Plus Ones</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Search and Filters */}
      <SearchAndFilters>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search guests by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="attending">Attending</option>
          <option value="not_attending">Not Attending</option>
          <option value="maybe">Maybe</option>
        </FilterSelect>
      </SearchAndFilters>

      {/* Guest Table */}
      <GuestTable>
        <TableHeader>
          <div>Name</div>
          <div>Email</div>
          <div>Status</div>
          <div>Plus Ones</div>
          <div>Invite Code</div>
          <div>Actions</div>
        </TableHeader>
        
        {filteredGuests.length === 0 ? (
          <EmptyState>
            {searchTerm || statusFilter !== 'all' ? 
              'No guests match your search criteria.' : 
              'No guests added yet. Start by adding your first guest!'
            }
          </EmptyState>
        ) : (
          filteredGuests.map((guest, index) => (
            <TableRow key={guest.id} isEven={index % 2 === 1}>
              <GuestName>{guest.firstName} {guest.lastName}</GuestName>
              <GuestEmail>{guest.email}</GuestEmail>
              <div>
                <StatusBadge status={guest.rsvpStatus}>
                  {guest.rsvpStatus.replace('_', ' ')}
                </StatusBadge>
              </div>
              <div>{guest.plusOnes?.length || 0}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {guest.inviteCode}
              </div>
              <ActionButtonsCell>
                <SmallActionButton
                  onClick={() => handleEditGuest(guest)}
                  title="Edit guest"
                >
                  ✏️
                </SmallActionButton>
                <SmallActionButton
                  onClick={() => handleDeleteGuest(guest)}
                  title="Delete guest"
                >
                  🗑️
                </SmallActionButton>
              </ActionButtonsCell>
            </TableRow>
          ))
        )}
      </GuestTable>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddGuestModalOpen}
        onClose={() => setIsAddGuestModalOpen(false)}
        weddingId={weddingId}
        onGuestAdded={handleGuestAdded}
      />

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
    </ContentContainer>
  );
};

// Keep the old export for backward compatibility but mark as deprecated
/** @deprecated Use GuestManagementContent instead */
export const GuestManagementSection = GuestManagementContent;
