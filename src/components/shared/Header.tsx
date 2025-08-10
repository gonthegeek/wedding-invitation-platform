import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from './LanguageSelector';
import { LogOut, User, Crown, Heart, Menu, ChevronRight, SunMedium, Moon, Monitor } from 'lucide-react';
import { useThemeContext } from '../../contexts/ThemeContextBase';

const HeaderContainer = styled.header`
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.textPrimary};
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
  color: ${(p) => p.theme.colors.textSecondary};
`;

const BreadcrumbItem = styled.span<{ $isLast?: boolean }>`
  color: ${(p) => (p.$isLast ? p.theme.colors.textPrimary : p.theme.colors.textSecondary)};
  font-weight: ${(p) => (p.$isLast ? 600 : 400)};
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
  background: ${(p) => p.theme.colors.surfaceAlt};
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
  color: ${(p) => p.theme.colors.textPrimary};
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textSecondary};
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    border-color: ${(p) => p.theme.colors.textSecondary};
  }
  
  span {
    @media (max-width: 640px) {
      display: none;
    }
  }
`;

const ThemeToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.textPrimary};
  padding: 0.5rem 0.75rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover { background: ${(p) => p.theme.colors.surfaceAlt}; }
`;

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { mode, setMode } = useThemeContext();

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
    const breadcrumbs: string[] = [];
    
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

  const cycleMode = () => {
    setMode(mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system');
  };

  const themeLabel = mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light';
  const ThemeIcon = mode === 'system' ? Monitor : mode === 'dark' ? Moon : SunMedium;

  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={onMenuToggle} aria-label="Toggle menu">
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
        <ThemeToggle onClick={cycleMode} aria-label={`Toggle theme (current: ${themeLabel})`}>
          <ThemeIcon size={16} />
          <span>{themeLabel}</span>
        </ThemeToggle>
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
