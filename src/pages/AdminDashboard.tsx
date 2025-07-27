import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { WeddingService } from '../services/weddingService';
import { GuestService } from '../services/guestService';
import styled from 'styled-components';
import { Heart, Users, BarChart3, Calendar, Trash2, Eye } from 'lucide-react';
import type { Wedding } from '../types';

const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const WeddingsTable = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  
  &:hover {
    background: #f9fafb;
  }
`;

const WeddingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const WeddingTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const WeddingSubtitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'upcoming' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#dcfce7';
      case 'upcoming': return '#fef3c7';
      case 'inactive': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#166534';
      case 'upcoming': return '#92400e';
      case 'inactive': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const ActionButtons = styled.div`
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
`;

interface AdminStats {
  totalWeddings: number;
  activeCouples: number;
  totalRSVPs: number;
  totalGuests: number;
}

interface WeddingWithStats extends Wedding {
  guestCount?: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState<WeddingWithStats[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all weddings (admin can see all)
        const allWeddings = await WeddingService.getAllWeddings();
        
        // Fetch guest counts for each wedding
        const weddingsWithStats = await Promise.all(
          allWeddings.map(async (wedding) => {
            try {
              const weddingStats = await GuestService.getWeddingStats(wedding.id);
              return {
                ...wedding,
                guestCount: weddingStats.totalGuests
              };
            } catch (error) {
              console.error(`Error fetching stats for wedding ${wedding.id}:`, error);
              return {
                ...wedding,
                guestCount: 0
              };
            }
          })
        );
        
        setWeddings(weddingsWithStats);

        // Calculate stats
        const totalWeddings = weddingsWithStats.length;
        const activeCouples = weddingsWithStats.filter(w => w.isActive).length;
        
        // Get total RSVPs and guests count
        let totalRSVPs = 0;
        let totalGuests = 0;
        
        for (const wedding of weddingsWithStats) {
          try {
            const weddingStats = await GuestService.getWeddingStats(wedding.id);
            totalRSVPs += weddingStats.respondedCount;
            totalGuests += weddingStats.totalGuests;
          } catch (error) {
            console.error(`Error fetching RSVP stats for wedding ${wedding.id}:`, error);
          }
        }

        setStats({
          totalWeddings,
          activeCouples,
          totalRSVPs,
          totalGuests,
        });

      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getWeddingStatus = (wedding: WeddingWithStats): 'active' | 'inactive' | 'upcoming' => {
    if (!wedding.isActive) return 'inactive';
    
    const weddingDate = new Date(wedding.weddingDate);
    const today = new Date();
    
    if (weddingDate > today) return 'upcoming';
    return 'active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const viewWedding = (weddingId: string) => {
    navigate(`/wedding/${weddingId}`);
  };

  const deleteWedding = async (weddingId: string) => {
    if (window.confirm('Are you sure you want to delete this wedding? This action cannot be undone.')) {
      try {
        // Find the wedding being deleted to check if it was active
        const weddingToDelete = weddings.find(w => w.id === weddingId);
        const wasActive = weddingToDelete?.isActive || false;
        
        await WeddingService.deleteWedding(weddingId);
        setWeddings(prev => prev.filter(w => w.id !== weddingId));
        
        // Recalculate stats properly
        if (stats) {
          const updatedStats = { ...stats };
          updatedStats.totalWeddings -= 1;
          if (wasActive) {
            updatedStats.activeCouples -= 1;
          }
          // Subtract guest count from total
          if (weddingToDelete?.guestCount) {
            updatedStats.totalGuests -= weddingToDelete.guestCount;
          }
          setStats(updatedStats);
        }
      } catch (error) {
        console.error('Error deleting wedding:', error);
        alert('Failed to delete wedding');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <AdminContainer>
          <LoadingSpinner>Loading admin dashboard...</LoadingSpinner>
        </AdminContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <AdminContainer>
          <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>
            Error: {error}
          </div>
        </AdminContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminContainer>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '600', color: '#1f2937' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Manage all weddings and users on the platform
          </p>
        </div>

        {stats && (
          <StatsGrid>
            <StatCard>
              <StatIcon color="#3b82f6">
                <Heart size={20} />
              </StatIcon>
              <StatValue>{stats.totalWeddings}</StatValue>
              <StatLabel>Total Weddings</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#10b981">
                <Users size={20} />
              </StatIcon>
              <StatValue>{stats.activeCouples}</StatValue>
              <StatLabel>Active Couples</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#f59e0b">
                <BarChart3 size={20} />
              </StatIcon>
              <StatValue>{stats.totalRSVPs}</StatValue>
              <StatLabel>Total RSVPs</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#8b5cf6">
                <Calendar size={20} />
              </StatIcon>
              <StatValue>{stats.totalGuests}</StatValue>
              <StatLabel>Total Guests</StatLabel>
            </StatCard>
          </StatsGrid>
        )}

        <WeddingsTable>
          <TableHeader>
            <div>Wedding</div>
            <div>Date</div>
            <div>Status</div>
            <div>Guests</div>
            <div>Actions</div>
          </TableHeader>

          {weddings.length > 0 ? (
            weddings.map((wedding) => (
              <TableRow key={wedding.id}>
                <WeddingInfo>
                  <WeddingTitle>
                    {wedding.brideFirstName} & {wedding.groomFirstName}
                  </WeddingTitle>
                  <WeddingSubtitle>
                    {wedding.subdomain}.weddingplatform.com
                  </WeddingSubtitle>
                </WeddingInfo>
                <div>{formatDate(wedding.weddingDate.toISOString())}</div>
                <StatusBadge status={getWeddingStatus(wedding)}>
                  {getWeddingStatus(wedding)}
                </StatusBadge>
                <div>{wedding.guestCount || 0} guests</div>
                <ActionButtons>
                  <ActionButton 
                    onClick={() => viewWedding(wedding.id)}
                    title="View Wedding"
                  >
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => deleteWedding(wedding.id)}
                    title="Delete Wedding"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionButtons>
              </TableRow>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No weddings found
            </div>
          )}
        </WeddingsTable>
      </AdminContainer>
    </Layout>
  );
};
