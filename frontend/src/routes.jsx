import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Pages
import Login            from './pages/Login';
import Signup           from './pages/Signup';
import Dashboard        from './pages/Dashboard';
import CandidatePage    from './pages/CandidatePage';
import VerificationPage from './pages/VerificationPage';

const AppRoutes = () => (
  <Routes>
    {/* Public routes — redirect to /dashboard if already logged in */}
    <Route path="/login"  element={<PublicRoute><Login  /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

    {/* Protected routes — redirect to /login if not authenticated */}
    <Route path="/dashboard"           element={<ProtectedRoute><Dashboard        /></ProtectedRoute>} />
    <Route path="/submit-candidate"    element={<ProtectedRoute><CandidatePage    /></ProtectedRoute>} />
    <Route path="/report/:candidateId" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
