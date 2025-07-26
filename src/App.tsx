import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  AdminDashboard,
  CoupleDashboard,
  GuestInvitation,
  UnauthorizedPage,
  NotFoundPage,
} from './pages';
import './styles/global.css';

function App() {
  return (
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
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Couple Routes */}
            <Route 
              path="/couple/*" 
              element={
                <ProtectedRoute allowedRoles={['couple']}>
                  <CoupleDashboard />
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
  );
}

export default App;
