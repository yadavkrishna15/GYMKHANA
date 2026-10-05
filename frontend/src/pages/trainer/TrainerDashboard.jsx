import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Layers, Award, CalendarCheck, TrendingUp, ArrowRight, UserCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function TrainerDashboard() {
  const { user } = useAuth();
  useDocumentTitle('GYMKHANA | Coach Workspace', 'Floor coaching overview, assigned athlete roster, and workout routines.');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrainerDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/trainers/dashboard');
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error?.message || 'Could not load coach workspace');
      }
    } catch (err) {
      setError(err.message || 'Server error loading coach workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerDashboard();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Synchronizing coaching assignments..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTrainerDashboard} />;

  const { trainer, membersCount = 0, assignedMembers = [], myPlans = [] } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
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
              Certified Coaching Portal
            </span>
            <Badge type="status" value={trainer?.availability_status || 'Available'} />
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>
            Welcome, Coach {user?.full_name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            {trainer?.specialization || 'General Conditioning Specialist'} &bull; {trainer?.experience_years || 3} Years Experience
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/trainer/plans">
            <Button variant="primary" size="sm" icon={Layers}>
              Create Workout Plan
            </Button>
          </Link>
          <Link to="/trainer/profile">
            <Button variant="secondary" size="sm">
              Edit Coach Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-primary-dim)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <Link to="/trainer/members" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Roster &rarr;
            </Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Athletes</span>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', marginBottom: '0.25rem', fontWeight: 800 }}>
            {membersCount}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Athletes under your active supervision</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
            <Link to="/trainer/plans" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Manage &rarr;
            </Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authored Routines</span>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', marginBottom: '0.25rem', fontWeight: 800 }}>
            {myPlans.length}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Workout plans created by you</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Floor Availability</span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.4rem', marginBottom: '0.25rem' }}>
            {trainer?.availability_status || 'Available'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Configurable in coach profile</p>
        </Card>
      </div>

      {/* Assigned Members Table */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} style={{ color: 'var(--accent-primary)' }} />
            Assigned Member Roster
          </h3>
          <Link to="/trainer/members" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            Full Roster &amp; Logs &rarr;
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedMembers && assignedMembers.length > 0 ? (
                assignedMembers.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.full_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{m.email}</td>
                    <td>{m.phone || '—'}</td>
                    <td>{m.plan_name || 'Standard Split'}</td>
                    <td><Badge type="status" value={m.status || 'Active'} /></td>
                    <td>
                      <Link to={`/trainer/members?id=${m.id}`}>
                        <Button variant="ghost" size="sm">
                          Inspect &amp; Log
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No members currently assigned to your coaching roster. Gym administrators assign athletes based on capacity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
