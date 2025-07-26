import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Crown, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <Crown size={16} />;
      case 'couple':
        return <Heart size={16} />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'Administrator';
      case 'couple':
        return 'Couple';
      case 'guest':
        return 'Guest';
      default:
        return 'User';
    }
  };

  if (!currentUser) {
    return null; // Don't show header on public pages
  }

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">Wedding Invitation Platform</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {getRoleIcon()}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser.displayName || currentUser.email}</span>
              <span className="user-role">{getRoleLabel()}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
