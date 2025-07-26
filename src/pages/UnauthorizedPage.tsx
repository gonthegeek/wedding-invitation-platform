import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="unauthorized-page">
      <div className="error-container">
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact an administrator if you believe this is an error.</p>
        
        <div className="error-actions">
          <Link to="/login" className="btn-primary">Go to Login</Link>
          <Link to="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    </div>
  );
};
