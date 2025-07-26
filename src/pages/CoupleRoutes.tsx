import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CoupleDashboard } from './CoupleDashboard';
import { CreateWeddingPage } from './CreateWeddingPage';

export const CoupleRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/couple/dashboard" replace />} />
      <Route path="/dashboard" element={<CoupleDashboard />} />
      <Route path="/create-wedding" element={<CreateWeddingPage />} />
    </Routes>
  );
};
