import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CoupleDashboard } from './CoupleDashboard';
import { CreateWeddingPage } from './CreateWeddingPage';
import WeddingManagementPage from './WeddingManagementPage';
import { WeddingDetailsPage } from './WeddingDetailsPage';
import { CustomizeInvitationPage } from './CustomizeInvitationPage';

// Placeholder components for missing pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>This page is coming soon!</p>
  </div>
);

export const CoupleRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/couple/dashboard" replace />} />
      <Route path="/dashboard" element={<CoupleDashboard />} />
      <Route path="/create-wedding" element={<CreateWeddingPage />} />
      <Route path="/wedding-management" element={<WeddingManagementPage />} />
      <Route path="/wedding-details" element={<WeddingDetailsPage />} />
      <Route path="/rsvp-dashboard" element={<WeddingManagementPage />} />
      
      {/* Placeholder routes for future development */}
      <Route path="/invitations" element={<PlaceholderPage title="Invitations" />} />
      <Route path="/timeline" element={<PlaceholderPage title="Wedding Timeline" />} />
      <Route path="/gallery" element={<PlaceholderPage title="Photo Gallery" />} />
      <Route path="/registry" element={<PlaceholderPage title="Gift Registry" />} />
      <Route path="/venues" element={<PlaceholderPage title="Venue Details" />} />
      <Route path="/settings" element={<PlaceholderPage title="Wedding Settings" />} />
      <Route path="/customize" element={<CustomizeInvitationPage />} />
    </Routes>
  );
};
