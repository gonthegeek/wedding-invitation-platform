import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CoupleDashboard } from './CoupleDashboard';
import { CreateWeddingPage } from './CreateWeddingPage';
import WeddingManagementPage from './WeddingManagementPage';
import { WeddingDetailsPage } from './WeddingDetailsPage';
import { CustomizeInvitationPage } from './CustomizeInvitationPage';

export const CoupleRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/couple/dashboard" replace />} />
      <Route path="/dashboard" element={<CoupleDashboard />} />
      <Route path="/create-wedding" element={<CreateWeddingPage />} />
      <Route path="/wedding-management" element={<WeddingManagementPage />} />
      <Route path="/wedding-details" element={<WeddingDetailsPage />} />
      <Route path="/rsvp-dashboard" element={<WeddingManagementPage />} />
      <Route path="/customize" element={<CustomizeInvitationPage />} />
    </Routes>
  );
};
