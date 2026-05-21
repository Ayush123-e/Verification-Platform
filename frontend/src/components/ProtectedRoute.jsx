import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Loader } from 'lucide-react';

/** Renders children only if the user is authenticated, otherwise redirects to /login */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Loader size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Authenticating...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

/** Renders children only if the user is NOT authenticated, otherwise redirects to /dashboard */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};
