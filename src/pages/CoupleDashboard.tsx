import React from 'react';

export const CoupleDashboard: React.FC = () => {
  return (
    <div className="couple-dashboard">
      <h1>Couple Dashboard</h1>
      <p>Welcome! Create and customize your wedding invitation.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Your Wedding</h3>
          <p>No wedding created yet</p>
          <button className="btn-primary">Create Wedding</button>
        </div>
        
        <div className="dashboard-card">
          <h3>RSVPs Received</h3>
          <p className="metric">0</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Guests Invited</h3>
          <p className="metric">0</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Days Until Wedding</h3>
          <p className="metric">--</p>
        </div>
      </div>
      
      <div className="couple-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn-primary">Customize Invitation</button>
          <button className="btn-secondary">Manage Guest List</button>
          <button className="btn-secondary">View RSVPs</button>
          <button className="btn-secondary">Preview Invitation</button>
        </div>
      </div>
    </div>
  );
};
