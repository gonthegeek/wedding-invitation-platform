import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { WeddingService } from '../services/weddingService';
import { GuestService } from '../services/guestService';
import styled from 'styled-components';
import { 
  Heart, 
  Users, 
  BarChart3, 
  Calendar, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Download,
  UserCheck,
  Mail,
  TrendingUp,
  Activity
} from 'lucide-react';
import type { Wedding, User } from '../types';

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

const SearchAndFilters = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 1rem;
  height: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricTitle = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const MetricValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const MetricSubtext = styled.div`
  font-size: 0.75rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface AdminStats {
  totalWeddings: number;
  activeCouples: number;
  totalRSVPs: number;
  totalGuests: number;
  upcomingWeddings: number;
  completedWeddings: number;
  averageGuestsPerWedding: number;
  rsvpRate: number;
}

interface WeddingWithStats extends Wedding {
  guestCount?: number;
  rsvpCount?: number;
  rsvpRate?: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState<WeddingWithStats[]>([]);
  const [filteredWeddings, setFilteredWeddings] = useState<WeddingWithStats[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'inactive'>('all');

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
                guestCount: weddingStats.totalGuests,
                rsvpCount: weddingStats.respondedCount,
                rsvpRate: weddingStats.totalGuests > 0 ? (weddingStats.respondedCount / weddingStats.totalGuests) * 100 : 0
              };
            } catch (error) {
              console.error(`Error fetching stats for wedding ${wedding.id}:`, error);
              return {
                ...wedding,
                guestCount: 0,
                rsvpCount: 0,
                rsvpRate: 0
              };
            }
          })
        );
        
        setWeddings(weddingsWithStats);
        setFilteredWeddings(weddingsWithStats);

        // Calculate comprehensive stats
        const totalWeddings = weddingsWithStats.length;
        const activeCouples = weddingsWithStats.filter(w => w.isActive).length;
        const totalGuests = weddingsWithStats.reduce((sum, w) => sum + (w.guestCount || 0), 0);
        const totalRSVPs = weddingsWithStats.reduce((sum, w) => sum + (w.rsvpCount || 0), 0);
        
        const now = new Date();
        const upcomingWeddings = weddingsWithStats.filter(w => new Date(w.weddingDate) > now).length;
        const completedWeddings = weddingsWithStats.filter(w => new Date(w.weddingDate) <= now).length;
        const averageGuestsPerWedding = totalWeddings > 0 ? Math.round(totalGuests / totalWeddings) : 0;
        const rsvpRate = totalGuests > 0 ? Math.round((totalRSVPs / totalGuests) * 100) : 0;

        setStats({
          totalWeddings,
          activeCouples,
          totalRSVPs,
          totalGuests,
          upcomingWeddings,
          completedWeddings,
          averageGuestsPerWedding,
          rsvpRate
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

  // Filter and search functionality
  useEffect(() => {
    let filtered = weddings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(wedding => 
        wedding.brideFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wedding.groomFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wedding.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(wedding => {
        const status = getWeddingStatus(wedding);
        return status === statusFilter;
      });
    }

    setFilteredWeddings(filtered);
  }, [weddings, searchTerm, statusFilter]);

  const exportWeddingData = () => {
    const csvData = filteredWeddings.map(wedding => ({
      'Bride Name': wedding.brideFirstName + ' ' + wedding.brideLastName,
      'Groom Name': wedding.groomFirstName + ' ' + wedding.groomLastName,
      'Wedding Date': formatDate(wedding.weddingDate.toISOString()),
      'Subdomain': wedding.subdomain,
      'Status': getWeddingStatus(wedding),
      'Guest Count': wedding.guestCount || 0,
      'RSVP Count': wedding.rsvpCount || 0,
      'RSVP Rate': wedding.rsvpRate ? `${wedding.rsvpRate.toFixed(1)}%` : '0%',
      'Active': wedding.isActive ? 'Yes' : 'No'
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <>
            <SearchAndFilters>
              <SearchWrapper>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search weddings by couple names or subdomain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchWrapper>
              <FilterSelect 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'upcoming' | 'inactive')}
              >
                <option value="all">All Weddings</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="inactive">Inactive</option>
              </FilterSelect>
              <ExportButton onClick={exportWeddingData}>
                <Download size={16} />
                Export Data
              </ExportButton>
            </SearchAndFilters>

            <MetricsGrid>
              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#3b82f6">
                    <Heart size={20} />
                  </MetricIcon>
                  <MetricTitle>Total Weddings</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.totalWeddings}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Platform weddings
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#10b981">
                    <Activity size={20} />
                  </MetricIcon>
                  <MetricTitle>Active Couples</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.activeCouples}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Currently active
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#f59e0b">
                    <Calendar size={20} />
                  </MetricIcon>
                  <MetricTitle>Upcoming Events</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.upcomingWeddings}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  In the future
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#8b5cf6">
                    <Users size={20} />
                  </MetricIcon>
                  <MetricTitle>Total Guests</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.totalGuests}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  All guest lists
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#ef4444">
                    <UserCheck size={20} />
                  </MetricIcon>
                  <MetricTitle>Total RSVPs</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.totalRSVPs}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Responses received
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#06b6d4">
                    <BarChart3 size={20} />
                  </MetricIcon>
                  <MetricTitle>RSVP Rate</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.rsvpRate}%</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Response rate
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#84cc16">
                    <BarChart3 size={20} />
                  </MetricIcon>
                  <MetricTitle>Avg Guests</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.averageGuestsPerWedding}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Per wedding
                </MetricSubtext>
              </MetricCard>

              <MetricCard>
                <MetricHeader>
                  <MetricIcon color="#64748b">
                    <Calendar size={20} />
                  </MetricIcon>
                  <MetricTitle>Completed</MetricTitle>
                </MetricHeader>
                <MetricValue>{stats.completedWeddings}</MetricValue>
                <MetricSubtext>
                  <TrendingUp size={12} />
                  Past events
                </MetricSubtext>
              </MetricCard>
            </MetricsGrid>
          </>
        )}

        <WeddingsTable>
          <TableHeader>
            <div>Wedding</div>
            <div>Date</div>
            <div>Status</div>
            <div>Guests</div>
            <div>Actions</div>
          </TableHeader>

          {filteredWeddings.length > 0 ? (
            filteredWeddings.map((wedding) => (
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
