import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWedding } from '../hooks/useWedding';
import { WeddingService } from '../services/weddingService';
import { Layout } from '../components/shared/Layout';
import styled from 'styled-components';
import { 
  Save, 
  Eye, 
  Calendar, 
  MapPin, 
  Settings,
  ExternalLink
} from 'lucide-react';
import type { Wedding, WeddingLocation } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  flex-grow: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
    }
  `}
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
`;

const CardTitle = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.25rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const PreviewCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const PreviewTitle = styled.h3`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 300;
`;

const PreviewDate = styled.p`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const PreviewUrl = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #666;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`;

export const WeddingDetailsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { wedding, loading: weddingLoading } = useWedding();
  const [formData, setFormData] = useState<Partial<Wedding>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (wedding) {
      setFormData({
        brideFirstName: wedding.brideFirstName,
        brideLastName: wedding.brideLastName,
        groomFirstName: wedding.groomFirstName,
        groomLastName: wedding.groomLastName,
        weddingDate: wedding.weddingDate,
        ceremonyTime: wedding.ceremonyTime,
        ceremonyLocation: wedding.ceremonyLocation,
        receptionTime: wedding.receptionTime,
        receptionLocation: wedding.receptionLocation,
        subdomain: wedding.subdomain,
      });
    }
  }, [wedding]);

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleLocationChange = (type: 'ceremony' | 'reception', field: keyof WeddingLocation, value: string) => {
    const locationField = type === 'ceremony' ? 'ceremonyLocation' : 'receptionLocation';
    setFormData(prev => ({
      ...prev,
      [locationField]: {
        ...prev[locationField],
        [field]: value
      }
    }));
    setMessage(null);
  };

  const handleSave = async () => {
    if (!wedding || !currentUser) return;

    setLoading(true);
    try {
      const updatedWedding: Wedding = {
        ...wedding,
        ...formData,
        weddingDate: formData.weddingDate ? new Date(formData.weddingDate) : wedding.weddingDate,
        updatedAt: new Date()
      };

      await WeddingService.updateWedding(wedding.id, updatedWedding);
      setMessage({ type: 'success', text: 'Wedding details updated successfully!' });
    } catch (error) {
      console.error('Error updating wedding:', error);
      setMessage({ type: 'error', text: 'Failed to update wedding details. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getPublicInvitationUrl = () => {
    if (!wedding) return '#';
    return `${window.location.origin}/wedding/${wedding.id}`;
  };

  const formatDateForInput = (date: Date) => {
    return date instanceof Date ? date.toISOString().split('T')[0] : '';
  };

  if (weddingLoading) {
    return (
      <Layout>
        <Container>
          <LoadingSpinner>Loading wedding details...</LoadingSpinner>
        </Container>
      </Layout>
    );
  }

  if (!wedding) {
    return (
      <Layout>
        <Container>
          <Card>
            <p>No wedding found. Please create a wedding first.</p>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>Wedding Details</Title>
          <ActionButtons>
            <Button 
              as="a" 
              href={getPublicInvitationUrl()} 
              target="_blank" 
              variant="outline"
            >
              <Eye size={18} />
              Preview Invitation
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </ActionButtons>
        </Header>

        {message && (
          message.type === 'success' ? 
            <SuccessMessage>{message.text}</SuccessMessage> :
            <ErrorMessage>{message.text}</ErrorMessage>
        )}

        {/* Preview Card */}
        <PreviewCard>
          <PreviewTitle>
            {formData.brideFirstName || wedding.brideFirstName} & {formData.groomFirstName || wedding.groomFirstName}
          </PreviewTitle>
          <PreviewDate>
            {formData.weddingDate ? 
              new Date(formData.weddingDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) :
              wedding.weddingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          </PreviewDate>
          <PreviewUrl href={getPublicInvitationUrl()} target="_blank">
            <ExternalLink size={16} />
            View Public Invitation
          </PreviewUrl>
        </PreviewCard>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <Settings size={24} />
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <FormGrid>
            <FormGroup>
              <Label>Bride's First Name</Label>
              <Input
                type="text"
                value={formData.brideFirstName || ''}
                onChange={(e) => handleInputChange('brideFirstName', e.target.value)}
                placeholder="Enter bride's first name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Bride's Last Name</Label>
              <Input
                type="text"
                value={formData.brideLastName || ''}
                onChange={(e) => handleInputChange('brideLastName', e.target.value)}
                placeholder="Enter bride's last name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Groom's First Name</Label>
              <Input
                type="text"
                value={formData.groomFirstName || ''}
                onChange={(e) => handleInputChange('groomFirstName', e.target.value)}
                placeholder="Enter groom's first name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Groom's Last Name</Label>
              <Input
                type="text"
                value={formData.groomLastName || ''}
                onChange={(e) => handleInputChange('groomLastName', e.target.value)}
                placeholder="Enter groom's last name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Wedding Date</Label>
              <Input
                type="date"
                value={formatDateForInput(formData.weddingDate as Date || wedding.weddingDate)}
                onChange={(e) => handleInputChange('weddingDate', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Subdomain</Label>
              <Input
                type="text"
                value={formData.subdomain || ''}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                placeholder="e.g., john-mary-2024"
              />
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Ceremony Details */}
        <Card>
          <CardHeader>
            <Calendar size={24} />
            <CardTitle>Ceremony Details</CardTitle>
          </CardHeader>
          <FormGrid>
            <FormGroup>
              <Label>Ceremony Time</Label>
              <Input
                type="time"
                value={formData.ceremonyTime || ''}
                onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Venue Name</Label>
              <Input
                type="text"
                value={formData.ceremonyLocation?.name || ''}
                onChange={(e) => handleLocationChange('ceremony', 'name', e.target.value)}
                placeholder="Enter ceremony venue name"
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Address</Label>
              <Textarea
                value={formData.ceremonyLocation?.address || ''}
                onChange={(e) => handleLocationChange('ceremony', 'address', e.target.value)}
                placeholder="Enter ceremony venue address"
              />
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Reception Details */}
        <Card>
          <CardHeader>
            <MapPin size={24} />
            <CardTitle>Reception Details</CardTitle>
          </CardHeader>
          <FormGrid>
            <FormGroup>
              <Label>Reception Time</Label>
              <Input
                type="time"
                value={formData.receptionTime || ''}
                onChange={(e) => handleInputChange('receptionTime', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Venue Name</Label>
              <Input
                type="text"
                value={formData.receptionLocation?.name || ''}
                onChange={(e) => handleLocationChange('reception', 'name', e.target.value)}
                placeholder="Enter reception venue name"
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Address</Label>
              <Textarea
                value={formData.receptionLocation?.address || ''}
                onChange={(e) => handleLocationChange('reception', 'address', e.target.value)}
                placeholder="Enter reception venue address"
              />
            </FormGroup>
          </FormGrid>
        </Card>
      </Container>
    </Layout>
  );
};
