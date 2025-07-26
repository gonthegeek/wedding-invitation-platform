import React from 'react';
import { Layout } from '../components/shared/Layout';

export const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin panel. Here you can manage all weddings on the platform.</p>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Weddings</h3>
            <p className="metric">0</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Active Couples</h3>
            <p className="metric">0</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Total RSVPs</h3>
            <p className="metric">0</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Platform Revenue</h3>
            <p className="metric">$0</p>
          </div>
        </div>
        
        <div className="admin-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn-primary">View All Weddings</button>
            <button className="btn-secondary">Manage Users</button>
            <button className="btn-secondary">Platform Settings</button>
            <button className="btn-secondary">Analytics</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
