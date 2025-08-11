import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { Guest } from '../../types';
import { useTranslation } from '../../hooks/useLanguage';

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
  background: ${({ theme }) => theme.colors.surface};
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-radius: 6px;
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const GuestInfo = styled.div`
  flex: 1;
`;

const GuestName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.25rem;
`;

const GuestDetails = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const DeletedDate = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const RestoreButton = styled.button`
  background: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.error};
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
  const t = useTranslation();
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
      setError(t.guestManagement.loadDeletedGuestsFailed || 'Failed to load deleted guests');
    } finally {
      setLoading(false);
    }
  }, [getDeletedGuests, t]);

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
    if (!date) return t.common.unknown || 'Unknown';
    return new Intl.DateTimeFormat(undefined, {
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
          <Title>{t.guestManagement.deletedGuestsTitle || 'Deleted Guests'}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {loading && (
          <LoadingState>{t.guestManagement.loadingDeletedGuests || 'Loading deleted guests...'}</LoadingState>
        )}

        {error && (
          <ErrorState>{error}</ErrorState>
        )}

        {!loading && !error && deletedGuests.length === 0 && (
          <EmptyState>
            {t.guestManagement.noDeletedGuestsFound || 'No deleted guests found.'}
            <div>{t.guestManagement.allGuestsActive || 'All guests are active!'}</div>
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
                    {guest.phone || t.guestManagement.noPhone}
                    {guest.email && ` • ${guest.email}`}
                  </GuestDetails>
                  <DeletedDate>
                    {(t.guestManagement.deletedLabel || 'Deleted') + ': '}{formatDate(guest.deletedAt)}
                  </DeletedDate>
                </GuestInfo>
                <RestoreButton
                  onClick={() => handleRestore(guest.id)}
                  disabled={restoringId === guest.id}
                >
                  {restoringId === guest.id ? (t.guestManagement.restoring || 'Restoring...') : (t.guestManagement.restore || 'Restore')}
                </RestoreButton>
              </GuestCard>
            ))}
          </GuestList>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
