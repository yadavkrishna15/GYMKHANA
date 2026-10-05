import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  Dumbbell,
  Wrench,
  Layers,
  CreditCard,
  CalendarCheck,
  MessageSquare,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Mail
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminDashboard() {
  const { user } = useAuth();
  useDocumentTitle('GYMKHANA | Administration Portal', 'Central operational control: members, coaching staff, inventory, and inquiries.');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.error?.message || 'Could not load administrative overview');
      }
    } catch (err) {
      setError(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Computing database metrics & logs..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAdminStats} />;

  const { counts = {}, recentMembers = [], recentMessages = [] } = stats || {};

  const metricCards = [
    { label: 'Total Enrolled Members', value: counts.members || 0, icon: Users, link: '/admin/members', color: 'var(--accent-primary)' },
    { label: 'Active Floor Coaches', value: counts.trainers || 0, icon: Award, link: '/admin/trainers', color: 'var(--color-info)' },
    { label: 'Cataloged Exercises', value: counts.exercises || 0, icon: Dumbbell, link: '/admin/exercises', color: '#F59E0B' },
    { label: 'Facility Machines', value: counts.equipment || 0, icon: Wrench, link: '/admin/equipment', color: '#EC4899' },
    { label: 'Periodized Workout Plans', value: counts.workoutPlans || 0, icon: Layers, link: '/admin/workout-plans', color: '#8B5CF6' },
    { label: 'Unread Inquiries', value: counts.unreadMessages || 0, icon: MessageSquare, link: '/admin/messages', color: 'var(--color-error)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Header */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              System Command Center
            </span>
            <Badge type="role" value="ADMIN" />
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>
            Welcome, Administrator {user?.full_name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Live relational metrics synchronized directly from the MySQL data store.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/members">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Manage Members
            </Button>
          </Link>
          <Link to="/admin/messages">
            <Button variant="secondary" size="sm" icon={Mail}>
              Review Inquiries ({counts.unreadMessages || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.link} style={{ textDecoration: 'none' }}>
              <Card interactive style={{ height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inspect &rarr;</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {card.label}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Recent Registrations & Recent Inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Member Registrations */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--accent-primary)' }} />
              Recent Member Enrollments
            </h3>
            <Link to="/admin/members" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              All Members &rarr;
            </Link>
          </div>

          {recentMembers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent registrations found.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.slice(0, 5).map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.full_name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{m.email}</td>
                      <td><Badge type="status" value={m.status || 'Active'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Recent Contact Desk Inquiries */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--color-info)' }} />
              Recent Desk Inquiries
            </h3>
            <Link to="/admin/messages" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              All Messages &rarr;
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent inquiries logged.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMessages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: msg.is_read ? 'transparent' : 'rgba(198, 241, 53, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{msg.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {msg.subject}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Administration Links */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Administrative Modules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/admin/exercises">
            <Button variant="secondary" size="md" icon={Dumbbell} style={{ width: '100%', justifyContent: 'flex-start' }}>
              Manage Exercises
            </Button>
          </Link>
          <Link to="/admin/equipment">
            <Button variant="secondary" size="md" icon={Wrench} style={{ width: '100%', justifyContent: 'flex-start' }}>
              Manage Equipment
            </Button>
          </Link>
          <Link to="/admin/workout-plans">
            <Button variant="secondary" size="md" icon={Layers} style={{ width: '100%', justifyContent: 'flex-start' }}>
              Manage Workout Plans
            </Button>
          </Link>
          <Link to="/admin/memberships">
            <Button variant="secondary" size="md" icon={CreditCard} style={{ width: '100%', justifyContent: 'flex-start' }}>
              Membership Tiers
            </Button>
          </Link>
          <Link to="/admin/attendance">
            <Button variant="secondary" size="md" icon={CalendarCheck} style={{ width: '100%', justifyContent: 'flex-start' }}>
              Attendance Logging
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
