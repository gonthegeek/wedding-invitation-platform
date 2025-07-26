import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const AppLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background-color: #fafafa;
`;

export const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
  return (
    <AppLayout>
      {showHeader && <Header />}
      <MainContent>
        {children}
      </MainContent>
    </AppLayout>
  );
};
