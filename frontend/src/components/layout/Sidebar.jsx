import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Dumbbell,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  Users,
  Award,
  Layers,
  Wrench,
  FileText,
  LogOut,
  ChevronLeft,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          { name: 'Overview', path: '/admin', icon: LayoutDashboard },
          { name: 'Members', path: '/admin/members', icon: Users },
          { name: 'Trainers', path: '/admin/trainers', icon: Award },
          { name: 'Exercises', path: '/admin/exercises', icon: Dumbbell },
          { name: 'Equipment', path: '/admin/equipment', icon: Wrench },
          { name: 'Workout Plans', path: '/admin/workout-plans', icon: Layers },
          { name: 'Memberships', path: '/admin/memberships', icon: CreditCard },
          { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
          { name: 'Contact Messages', path: '/admin/messages', icon: MessageSquare },
        ];
      case 'TRAINER':
        return [
          { name: 'Overview', path: '/trainer', icon: LayoutDashboard },
          { name: 'My Profile', path: '/trainer/profile', icon: User },
          { name: 'My Members', path: '/trainer/members', icon: Users },
          { name: 'Workout Plans', path: '/trainer/plans', icon: Layers },
        ];
      case 'MEMBER':
      default:
        return [
          { name: 'Overview', path: '/member', icon: LayoutDashboard },
          { name: 'My Profile', path: '/member/profile', icon: User },
          { name: 'My Membership', path: '/member/membership', icon: CreditCard },
          { name: 'My Workout Plan', path: '/member/plan', icon: Dumbbell },
          { name: 'My Attendance', path: '/member/attendance', icon: CalendarCheck },
          { name: 'My Progress', path: '/member/progress', icon: TrendingUp },
          { name: 'Fitness Tools', path: '/member/tools', icon: Calculator },
          { name: 'Feedback', path: '/member/feedback', icon: MessageSquare },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 140,
            display: 'block',
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--surface-card)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 150,
          flexShrink: 0,
          transition: 'transform var(--transition-normal)',
        }}
      >
        {/* Brand / Role Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--accent-contrast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}>
                <Dumbbell size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                GYMKHANA
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="sidebar-close-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'none',
              }}
              aria-label="Close sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Workspace</span>
            <Badge type="role" value={user?.role} />
          </div>
        </div>

        {/* User Card */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#12151B',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.full_name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/trainer' || item.path === '/member'}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-primary-dim)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
                  transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                })}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              padding: '0.4rem 0.5rem',
            }}
          >
            &larr; Back to Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid transparent',
              background: 'transparent',
              color: 'var(--color-error)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-error-bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 960px) {
          .dashboard-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
