import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Module Imports
import Login from "./modules/auth/Login";
import MYDORoutes from "./modules/mydo/MYDORoutes";
import SKRoutes from "./modules/sk/SKRoutes";

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

// Intelligent Root Redirect
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (user.role === "MYDO_ADMIN") return <Navigate to="/mydo/dashboard" />;
  if (["SK_CHAIR", "SK_SEC"].includes(user.role))
    return <Navigate to="/sk/dashboard" />;

  return <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* MYDO MODULE (Admin) */}
        <Route
          path="/mydo/*"
          element={
            <ProtectedRoute allowedRoles={["MYDO_ADMIN"]}>
              <MYDORoutes />
            </ProtectedRoute>
          }
        />

        {/* SK MODULE (Youth Profiling) */}
        <Route
          path="/sk/*"
          element={
            <ProtectedRoute allowedRoles={["SK_CHAIR", "SK_SEC"]}>
              <SKRoutes />
            </ProtectedRoute>
          }
        />

        {/* ROOT & FALLBACK */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}