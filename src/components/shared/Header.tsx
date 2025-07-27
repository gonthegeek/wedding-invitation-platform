import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from './LanguageSelector';
import { LogOut, User, Crown, Heart, Menu, ChevronRight } from 'lucide-react';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const BreadcrumbItem = styled.span<{ $isLast?: boolean }>`
  color: ${props => props.$isLast ? '#1f2937' : '#6b7280'};
  font-weight: ${props => props.$isLast ? '600' : '400'};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: #f9fafb;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  span {
    @media (max-width: 640px) {
      display: none;
    }
  }
`;

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <Crown size={16} />;
      case 'couple':
        return <Heart size={16} />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'Administrator';
      case 'couple':
        return 'Couple';
      case 'guest':
        return 'Guest';
      default:
        return 'User';
    }
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    if (pathSegments[0] === 'admin') {
      breadcrumbs.push('Admin');
      if (pathSegments[1]) {
        const pageMap: Record<string, string> = {
          'dashboard': 'Dashboard',
          'analytics': 'Analytics',
          'weddings': 'All Weddings',
          'users': 'Users',
          'venues': 'Venues',
          'settings': 'Settings'
        };
        breadcrumbs.push(pageMap[pathSegments[1]] || pathSegments[1]);
      }
    } else if (pathSegments[0] === 'couple') {
      breadcrumbs.push('Couple Dashboard');
      if (pathSegments[1]) {
        const pageMap: Record<string, string> = {
          'dashboard': 'Overview',
          'wedding-management': 'Wedding Management',
          'rsvp-dashboard': 'RSVP Analytics',
          'invitations': 'Invitations',
          'timeline': 'Timeline',
          'gallery': 'Gallery',
          'registry': 'Gift Registry',
          'venues': 'Venues',
          'settings': 'Settings'
        };
        breadcrumbs.push(pageMap[pathSegments[1]] || pathSegments[1]);
      }
    }
    
    return breadcrumbs;
  };

  if (!currentUser) {
    return null;
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={onMenuToggle}>
          <Menu size={20} />
        </MenuButton>
        
        {breadcrumbs.length > 0 && (
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem $isLast={index === breadcrumbs.length - 1}>
                  {crumb}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <ChevronRight size={14} />}
              </React.Fragment>
            ))}
          </Breadcrumbs>
        )}
      </HeaderLeft>
      
      <HeaderRight>
        <LanguageSelector />
        
        <UserInfo>
          <UserAvatar>
            {getRoleIcon()}
          </UserAvatar>
          <UserDetails>
            <UserName>{currentUser.displayName || currentUser.email}</UserName>
            <UserRole>{getRoleLabel()}</UserRole>
          </UserDetails>
        </UserInfo>
        
        <LogoutButton onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </LogoutButton>
      </HeaderRight>
    </HeaderContainer>
  );
};
