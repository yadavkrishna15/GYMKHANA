import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShieldAlert } from 'lucide-react';

export function RoleGuard({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" label="Checking authorization..." />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
        <Card style={{ textAlign: 'center', borderColor: 'var(--color-error-border)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#FCA5A5' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            You do not possess the required role permissions ({allowedRoles.join(', ')}) to view this resource.
          </p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return children;
}

export function DashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" label="Routing to dashboard..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'TRAINER') {
    return <Navigate to="/trainer" replace />;
  }
  return <Navigate to="/member" replace />;
}
