import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Users, 
  BarChart3, 
  Heart,
  Calendar,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 1024px) {
    position: sticky;
    transform: translateX(0);
    z-index: auto;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Navigation = styled.nav`
  padding: 1rem 0;
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textPrimary};
  background: ${props => props.$active ? props.theme.colors.surfaceAlt : 'transparent'};
  border-right: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$show ? 'block' : 'none'};
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getNavigationItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          {
            section: 'Overview',
            items: [
              { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
            ]
          }
        ];
      
      case 'couple':
        return [
          {
            section: 'Overview',
            items: [
              { path: '/couple/dashboard', label: 'Dashboard', icon: Home },
              { path: '/couple/rsvp-dashboard', label: 'RSVP Analytics', icon: BarChart3 },
            ]
          },
          {
            section: 'Wedding Management',
            items: [
              { path: '/couple/wedding-management', label: 'Wedding Management', icon: Heart },
              { path: '/couple/wedding-details', label: 'Wedding Details', icon: Calendar },
              { path: '/couple/customize', label: 'Customize Invitation', icon: Users },
            ]
          }
        ];
      
      default:
        return [];
    }
  };

  return (
    <>
      <Overlay $show={isOpen} onClick={onClose} />
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>
              {currentUser?.role === 'admin' ? <Crown size={18} /> : <Heart size={18} />}
            </LogoIcon>
            Wedding Platform
          </Logo>
        </SidebarHeader>
        
        <Navigation>
          {getNavigationItems().map((section, index) => (
            <NavSection key={index}>
              <NavSectionTitle>{section.section}</NavSectionTitle>
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $active={isActive(item.path)}
                  onClick={onClose}
                >
                  <item.icon />
                  {item.label}
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Navigation>
      </SidebarContainer>
    </>
  );
};
