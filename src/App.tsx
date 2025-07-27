import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  GuestInvitation,
  UnauthorizedPage,
  NotFoundPage,
} from './pages';
import { RSVPPage } from './pages/RSVPPage';
import { CoupleRoutes } from './pages/CoupleRoutes';
import { AdminRoutes } from './pages/AdminRoutes';
import { PublicWeddingInvitation } from './pages/PublicWeddingInvitation';
import './styles/global.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Guest Invitation Routes (Public) */}
              <Route path="/invitation/:weddingId" element={<GuestInvitation />} />
              <Route path="/invitation/:weddingId/:subdomain" element={<GuestInvitation />} />
              
              {/* RSVP Routes - Backward compatibility + New format */}
              <Route path="/rsvp/:inviteCode" element={<RSVPPage />} />  {/* Keep for backward compatibility */}
              <Route path="/invite/:inviteCode" element={<PublicWeddingInvitation />} />  {/* New preferred format */}
              
              {/* Public Wedding Invitation */}
              <Route path="/wedding/:weddingId" element={<PublicWeddingInvitation />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRoutes />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Couple Routes */}
              <Route 
                path="/couple/*" 
                element={
                  <ProtectedRoute allowedRoles={['couple']}>
                    <CoupleRoutes />
                  </ProtectedRoute>
                } 
              />
              
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
