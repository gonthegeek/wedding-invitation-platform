import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

// Placeholder components for admin sections
const AdminAnalytics: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Analytics</h1>
    <p>Analytics dashboard coming soon!</p>
  </div>
);

const AdminWeddings: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>All Weddings</h1>
    <p>Wedding management page coming soon!</p>
  </div>
);

const AdminUsers: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Users</h1>
    <p>User management page coming soon!</p>
  </div>
);

const AdminVenues: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Venues</h1>
    <p>Venue management page coming soon!</p>
  </div>
);

const AdminSettings: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Settings</h1>
    <p>Admin settings page coming soon!</p>
  </div>
);

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/weddings" element={<AdminWeddings />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/venues" element={<AdminVenues />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};
