import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>It might have been moved, deleted, or you entered the wrong URL.</p>
        
        <div className="error-actions">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/login" className="btn-secondary">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};
