import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Navbar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(15, 17, 21, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--accent-contrast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}>
            <Dumbbell size={20} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}>
              GYMKHANA
            </span>
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Smart Gym System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '1.25rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'color var(--transition-fast)',
                padding: '0.25rem 0',
                position: 'relative',
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth / Action CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Badge type="role" value={user?.role} />
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" icon={LayoutDashboard}>
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} title="Log Out">
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join GYMKHANA
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onToggleMobileMenu}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
