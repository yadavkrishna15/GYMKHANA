import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Dumbbell, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Exercises', path: '/exercises' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Workout Plans', path: '/workout-plans' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Fitness Calculator', path: '/calculator' },
    { name: 'Membership', path: '/membership' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: 'var(--surface-card)',
          borderRight: '1px solid var(--border-subtle)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-contrast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Dumbbell size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              GYMKHANA
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive ? 'var(--accent-primary-dim)' : 'transparent',
                transition: 'background-color var(--transition-fast)',
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* User state / Auth Footer in Drawer */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {user?.full_name}
                </span>
                <Badge type="role" value={user?.role} />
              </div>
              <Link to="/dashboard" onClick={onClose}>
                <Button variant="secondary" icon={LayoutDashboard} style={{ width: '100%' }}>
                  Go to Dashboard
                </Button>
              </Link>
              <Button variant="danger" icon={LogOut} onClick={handleLogout} style={{ width: '100%' }}>
                Log Out
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={onClose}>
                <Button variant="secondary" style={{ width: '100%', minHeight: '44px' }}>
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button variant="primary" style={{ width: '100%', minHeight: '44px' }}>
                  Join GYMKHANA
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
