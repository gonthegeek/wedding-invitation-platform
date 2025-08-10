import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import { WeddingPartyService } from '../../services/weddingPartyService';
import { StorageService } from '../../services/storageService';
import { ImageUpload } from '../shared/ImageUpload';
import type { WeddingParty, WeddingPartyRole, Wedding } from '../../types';

const Container = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceAlt};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textSecondary};
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
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.95);
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
  background: ${(p) => (p.isDragging ? p.theme.colors.surfaceAlt : p.theme.colors.surface)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.border};
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
`;

const DragHandle = styled.div`
  color: ${(p) => p.theme.colors.textSecondary};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const MemberRole = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MemberRelationship = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.textPrimary};
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
  background: ${(p) => p.theme.colors.surface};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${(p) => p.theme.colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(p) => p.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  
  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.textPrimary};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
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
  border: ${(p) => (p.variant === 'primary' ? 'none' : `1px solid ${p.theme.colors.border}`)};
  background: ${(p) => (p.variant === 'primary' ? p.theme.colors.primary : p.theme.colors.surface)};
  color: ${(p) => (p.variant === 'primary' ? 'white' : p.theme.colors.textPrimary)};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    filter: ${(p) => (p.variant === 'primary' ? 'brightness(0.95)' : 'none')};
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
  color: ${(p) => p.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h4`
  margin: 0 0 0.5rem;
  color: ${(p) => p.theme.colors.textPrimary};
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textSecondary};
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

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid ${(p) => p.theme.colors.error};
  border-radius: 8px;
  color: ${(p) => p.theme.colors.error};
  font-size: 14px;
  margin-bottom: 16px;

  button {
    background: none;
    border: none;
    color: inherit;
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
  wedding,
  onUpdate
}: WeddingPartyManagementProps) {
  const [members, setMembers] = useState<WeddingParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<WeddingParty | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
              <EmptyTitle>No Wedding Party Members</EmptyTitle>
              <EmptyText>Add your bridesmaids, groomsmen, and other special members</EmptyText>
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
                  onChange={(e) => setFormData(prev => ({ ...prev, role: (e.target as HTMLSelectElement).value as WeddingPartyRole }))}
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
                <Label>Photo</Label>
                <ImageUpload
                  value={formData.photo}
                  onChange={(imageUrl) => setFormData(prev => ({ ...prev, photo: imageUrl || '' }))}
                  onUpload={(file) => StorageService.uploadWeddingPartyPhoto(wedding?.id || '', file, editingMember?.id || 'temp')}
                  label="Upload Photo"
                />
              </FormGroup>

              <ModalActions>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <Save size={16} style={{ marginRight: '0.5rem' }} />
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
