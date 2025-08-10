import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { Guest } from '../../types';

// Extended Guest type for deleted guests
interface DeletedGuest extends Guest {
  deletedAt?: Date;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  
  &:hover {
    color: #374151;
  }
`;

const GuestList = styled.div`
  margin-bottom: 1.5rem;
`;

const GuestCard = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: #f9fafb;
`;

const GuestInfo = styled.div`
  flex: 1;
`;

const GuestName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const GuestDetails = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const DeletedDate = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const RestoreButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

interface DeletedGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  getDeletedGuests: () => Promise<DeletedGuest[]>;
  restoreGuest: (guestId: string) => Promise<boolean>;
}

export function DeletedGuestsModal({
  isOpen,
  onClose,
  getDeletedGuests,
  restoreGuest,
}: DeletedGuestsModalProps) {
  const [deletedGuests, setDeletedGuests] = useState<DeletedGuest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchDeletedGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const guests = await getDeletedGuests();
      setDeletedGuests(guests);
    } catch (err) {
      console.error('Error fetching deleted guests:', err);
      setError('Failed to load deleted guests');
    } finally {
      setLoading(false);
    }
  }, [getDeletedGuests]);

  useEffect(() => {
    if (isOpen) {
      fetchDeletedGuests();
    }
  }, [isOpen, fetchDeletedGuests]);

  const handleRestore = async (guestId: string) => {
    try {
      setRestoringId(guestId);
      const success = await restoreGuest(guestId);
      
      if (success) {
        // Remove the restored guest from the list
        setDeletedGuests(prev => prev.filter(guest => guest.id !== guestId));
      }
    } catch (err) {
      console.error('Error restoring guest:', err);
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Deleted Guests</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {loading && (
          <LoadingState>Loading deleted guests...</LoadingState>
        )}

        {error && (
          <ErrorState>{error}</ErrorState>
        )}

        {!loading && !error && deletedGuests.length === 0 && (
          <EmptyState>
            No deleted guests found. All guests are active!
          </EmptyState>
        )}

        {!loading && !error && deletedGuests.length > 0 && (
          <GuestList>
            {deletedGuests.map((guest) => (
              <GuestCard key={guest.id}>
                <GuestInfo>
                  <GuestName>
                    {guest.firstName} {guest.lastName}
                  </GuestName>
                  <GuestDetails>
                    {guest.phone || 'No phone provided'}
                    {guest.email && ` • ${guest.email}`}
                  </GuestDetails>
                  <DeletedDate>
                    Deleted: {formatDate(guest.deletedAt)}
                  </DeletedDate>
                </GuestInfo>
                <RestoreButton
                  onClick={() => handleRestore(guest.id)}
                  disabled={restoringId === guest.id}
                >
                  {restoringId === guest.id ? 'Restoring...' : 'Restore'}
                </RestoreButton>
              </GuestCard>
            ))}
          </GuestList>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
