import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 1. Import The Views
import Login from './views/Login';
import MYDOPortal from './MYDOPortal'; // Your original dashboard
import SKProfilingModule from './modules/sk-system/SKProfilingModule'; // The new SK Module

// 2. Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner
  if (!user) return <Navigate to="/login" replace />;
  
  // Check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If an SK user tries to go to MYDO admin page, kick them back
    return <Navigate to="/unauthorized" replace />; 
  }
  return children;
};

// 3. Main App Structure
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* === MYDO ADMIN SYSTEM === */}
      {/* Accessible only by MYDO_ADMIN */}
      <Route 
        path="/mydo/*" 
        element={
          <ProtectedRoute allowedRoles={['MYDO_ADMIN']}>
            <MYDOPortal />
          </ProtectedRoute>
        } 
      />

      {/* === SK YOUTH PROFILING SYSTEM === */}
      {/* Accessible only by SK_CHAIR or SK_SEC */}
      <Route 
        path="/sk/*" 
        element={
          <ProtectedRoute allowedRoles={['SK_CHAIR', 'SK_SEC']}>
            <SKProfilingModule user={user} />
          </ProtectedRoute>
        } 
      />

      {/* === ROOT REDIRECTOR === */}
      {/* If user goes to "/", send them to their respective dashboard */}
      <Route path="/" element={(() => {
          if (!user) return <Navigate to="/login" />;
          if (user.role === 'MYDO_ADMIN') return <Navigate to="/mydo" />;
          if (['SK_CHAIR', 'SK_SEC'].includes(user.role)) return <Navigate to="/sk/dashboard" />;
          return <Navigate to="/login" />;
      })()} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}