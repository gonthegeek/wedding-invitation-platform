import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2, GripVertical, Save, X, RefreshCw } from 'lucide-react';
import { WeddingPartyService } from '../../services/weddingPartyService';
import type { WeddingParty, WeddingPartyRole, Wedding, Padrino } from '../../types';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
  }
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MemberCard = styled.div<{ isDragging?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.isDragging ? '#f3f4f6' : '#f9fafb'};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    background: #f3f4f6;
  }
`;

const DragHandle = styled.div`
  color: #9ca3af;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const MemberRole = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MemberRelationship = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Modal = styled.div`
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #d1d5db'};
  background: ${props => props.variant === 'primary' ? '#667eea' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SyncButton = styled.button<{ $syncing: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.$syncing ? '#f0f8ff' : '#0066cc'};
  color: ${props => props.$syncing ? '#0066cc' : 'white'};
  border: 1px solid #0066cc;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.$syncing ? 'wait' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #0052a3;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  svg {
    animation: ${props => props.$syncing ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;

  button {
    background: none;
    border: none;
    color: #dc2626;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;

    &:hover {
      opacity: 0.7;
    }
  }
`;

interface WeddingPartyManagementProps {
  weddingId: string;
  currentUserId: string;
  wedding?: Wedding;
  onUpdate?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  role: WeddingPartyRole;
  relationship: string;
  photo: string;
}

const defaultFormData: FormData = {
  firstName: '',
  lastName: '',
  role: 'bridesmaid',
  relationship: '',
  photo: '',
};

const weddingPartyRoles: { value: WeddingPartyRole; label: string }[] = [
  { value: 'maid_of_honor', label: 'Maid of Honor' },
  { value: 'best_man', label: 'Best Man' },
  { value: 'bridesmaid', label: 'Bridesmaid' },
  { value: 'groomsman', label: 'Groomsman' },
  { value: 'flower_girl', label: 'Flower Girl' },
  { value: 'ring_bearer', label: 'Ring Bearer' },
  { value: 'officiant', label: 'Officiant' },
  { value: 'padrinos_velacion', label: 'Padrinos de Velación' },
  { value: 'padrinos_anillos', label: 'Padrinos de Anillos' },
  { value: 'padrinos_arras', label: 'Padrinos de Arras' },
  { value: 'padrinos_lazo', label: 'Padrinos de Lazo' },
  { value: 'padrinos_biblia', label: 'Padrinos de Biblia' },
  { value: 'padrinos_cojines', label: 'Padrinos de Cojines' },
  { value: 'padrinos_ramo', label: 'Padrinos de Ramo' },
];

export default function WeddingPartyManagement({
  weddingId,
  currentUserId,
  wedding,
  onUpdate
}: WeddingPartyManagementProps) {
  const [members, setMembers] = useState<WeddingParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<WeddingParty | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncingPadrinos, setSyncingPadrinos] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const weddingPartyMembers = await WeddingPartyService.getWeddingPartyMembers(weddingId);
      setMembers(weddingPartyMembers);
    } catch (error) {
      console.error('Error loading wedding party members:', error);
      setError('Failed to load wedding party members');
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  // Sync padrinos from wedding settings to wedding party collection
  const syncPadrinosToWeddingParty = async () => {
    if (!wedding?.settings?.padrinos || wedding.settings.padrinos.length === 0) {
      return;
    }

    setSyncingPadrinos(true);
    try {
      const existingMembers = await WeddingPartyService.getWeddingPartyMembers(weddingId);
      const existingPadrinoIds = new Set(
        existingMembers
          .filter(m => m.isPadrino)
          .map(m => m.padrinoId)
          .filter(Boolean)
      );

      for (const padrino of wedding.settings.padrinos) {
        // Skip if already synced
        if (existingPadrinoIds.has(padrino.id)) continue;

        const weddingPartyMember: Omit<WeddingParty, 'id'> = {
          weddingId,
          firstName: padrino.name,
          lastName: padrino.lastName || '',
          role: mapPadrinoTypeToRole(padrino.type),
          relationship: padrino.type,
          isPadrino: true,
          padrinoId: padrino.id,
          order: existingMembers.length + wedding.settings.padrinos.indexOf(padrino),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await WeddingPartyService.addWeddingPartyMember(weddingId, weddingPartyMember);
      }

      await loadMembers();
      onUpdate?.();
    } catch (error) {
      console.error('Error syncing padrinos:', error);
      setError('Failed to sync padrinos from wedding settings');
    } finally {
      setSyncingPadrinos(false);
    }
  };

  // Map padrino type to wedding party role
  const mapPadrinoTypeToRole = (padrinoType: string): WeddingPartyRole => {
    switch (padrinoType) {
      case 'velacion':
        return 'padrinos_velacion';
      case 'anillos':
        return 'padrinos_anillos';
      case 'arras':
        return 'padrinos_arras';
      case 'lazo':
        return 'padrinos_lazo';
      case 'biblia':
        return 'padrinos_biblia';
      case 'cojines':
        return 'padrinos_cojines';
      case 'ramo':
        return 'padrinos_ramo';
      default:
        return 'other';
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const handleEdit = (member: WeddingParty) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
      relationship: member.relationship || '',
      photo: member.photo || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wedding party member?')) return;
    
    try {
      await WeddingPartyService.deleteWeddingPartyMember(id);
      await loadMembers();
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Failed to delete wedding party member');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    try {
      if (editingMember) {
        await WeddingPartyService.updateWeddingPartyMember(editingMember.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          relationship: formData.relationship,
          photo: formData.photo,
        });
      } else {
        await WeddingPartyService.addWeddingPartyMember(weddingId, {
          weddingId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          relationship: formData.relationship,
          photo: formData.photo,
          order: members.length,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setShowModal(false);
      setFormData(defaultFormData);
      await loadMembers();
      onUpdate?.();
    } catch (error) {
      console.error('Error saving member:', error);
      setError('Failed to save wedding party member');
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const handleEdit = (member: WeddingParty) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
      relationship: member.relationship || '',
      photo: member.photo || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this wedding party member?')) {
      try {
        await WeddingPartyService.deleteWeddingPartyMember(memberId);
        await fetchMembers();
        onUpdate?.();
      } catch (error) {
        console.error('Error deleting wedding party member:', error);
        alert('Failed to delete wedding party member');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const memberData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
        relationship: formData.relationship.trim() || undefined,
        photo: formData.photo.trim() || undefined,
        order: editingMember ? editingMember.order : members.length,
        weddingId,
      };

      if (editingMember) {
        await WeddingPartyService.updateWeddingPartyMember(editingMember.id, memberData);
      } else {
        await WeddingPartyService.addWeddingPartyMember(weddingId, memberData);
      }

      await fetchMembers();
      onUpdate?.();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving wedding party member:', error);
      alert('Failed to save wedding party member');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData(defaultFormData);
  };

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Wedding Party</Title>
          <Subtitle>Loading wedding party members...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Wedding Party</Title>
            <Subtitle>Manage your bridesmaids, groomsmen, and other wedding party members</Subtitle>
          </HeaderContent>
          <ActionButtons>
            {wedding?.settings?.padrinos && wedding.settings.padrinos.length > 0 && (
              <SyncButton 
                onClick={syncPadrinosToWeddingParty}
                disabled={syncingPadrinos}
                $syncing={syncingPadrinos}
              >
                <RefreshCw size={16} />
                {syncingPadrinos ? 'Syncing...' : 'Sync Padrinos'}
              </SyncButton>
            )}
            <AddButton onClick={handleAdd}>
              <Plus size={16} />
              Add Wedding Party Member
            </AddButton>
          </ActionButtons>
        </Header>

        {error && (
          <ErrorMessage>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </ErrorMessage>
        )}
        
        <Content>
          {members.length > 0 ? (
            <MembersList>
              {members.map((member) => (
                <MemberCard key={member.id}>
                  <DragHandle>
                    <GripVertical size={16} />
                  </DragHandle>
                  
                  <MemberInfo>
                    <MemberName>
                      {member.firstName} {member.lastName}
                    </MemberName>
                    <MemberRole>
                      <span>{WeddingPartyService.getWeddingPartyRoleIcon(member.role)}</span>
                      {WeddingPartyService.getWeddingPartyRoleDisplayName(member.role)}
                    </MemberRole>
                    {member.relationship && (
                      <MemberRelationship>{member.relationship}</MemberRelationship>
                    )}
                  </MemberInfo>

                  <Actions>
                    <ActionButton onClick={() => handleEdit(member)} title="Edit">
                      <Edit2 size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(member.id)} title="Delete">
                      <Trash2 size={16} />
                    </ActionButton>
                  </Actions>
                </MemberCard>
              ))}
            </MembersList>
          ) : (
            <EmptyState>
              <EmptyIcon>👥</EmptyIcon>
              <h4 style={{ margin: '0 0 0.5rem', color: '#374151' }}>No Wedding Party Members</h4>
              <p style={{ margin: 0 }}>Add your bridesmaids, groomsmen, and other special members</p>
            </EmptyState>
          )}
        </Content>
      </Container>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingMember ? 'Edit Wedding Party Member' : 'Add Wedding Party Member'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>First Name *</Label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Last Name *</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as WeddingPartyRole }))}
                  required
                >
                  {weddingPartyRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Relationship</Label>
                <Input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="e.g., Sister, Best Friend, Cousin"
                />
              </FormGroup>

              <FormGroup>
                <Label>Photo URL</Label>
                <Input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                />
              </FormGroup>

              <ModalActions>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  <Save size={16} style={{ marginRight: '0.5rem' }} />
                  {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
