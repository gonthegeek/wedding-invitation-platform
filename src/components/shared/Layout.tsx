import React, { useState } from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { NavigationSidebar } from './NavigationSidebar';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
}

const AppLayout = styled.div`
  min-height: 100vh;
  display: flex;
  width: 100%;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents flex item from overflowing */
`;

const MainContent = styled.main`
  flex: 1;
  background-color: ${(p) => p.theme.colors.background};
  min-height: calc(100vh - 64px); /* Subtract header height */
  
  @media (min-width: 1024px) {
    margin-left: 0; /* Sidebar is now relative positioned */
  }
`;

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showNavigation = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <AppLayout>
      {showNavigation && (
        <NavigationSidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose}
        />
      )}
      
      <ContentArea>
        {showHeader && (
          <Header onMenuToggle={handleMenuToggle} />
        )}
        <MainContent>
          {children}
        </MainContent>
      </ContentArea>
    </AppLayout>
  );
};
