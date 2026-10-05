import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  CreditCard,
  Dumbbell,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertCircle,
  Calculator
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberDashboard() {
  const { user } = useAuth();
  useDocumentTitle('GYMKHANA | Member Dashboard', 'Member personal training overview, attendance records, and workout plans.');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/members/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      } else {
        setError(res.error?.message || 'Failed to load member dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to member services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" label="Synchronizing member profile & records..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  const { member, membership, trainer, workoutPlan, recentAttendance, latestProgress } = dashboardData || {};

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
              Athlete Portal
            </span>
            <Badge type="status" value={member?.status || 'Active'} />
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>
            Welcome back, {user?.full_name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Logged in as Member ID #{member?.id || user?.id} &bull; Joined {member?.join_date ? new Date(member.join_date).toLocaleDateString() : 'Active Member'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/member/plan">
            <Button variant="primary" size="sm" icon={Dumbbell}>
              Today's Workout
            </Button>
          </Link>
          <Link to="/member/tools">
            <Button variant="secondary" size="sm" icon={Calculator}>
              Fitness Tools
            </Button>
          </Link>
          <Link to="/member/feedback">
            <Button variant="outline" size="sm" icon={MessageSquare}>
              Feedback
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Membership Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-primary-dim)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
            <Link to="/member/membership" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Details &rarr;
            </Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Membership
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            {membership?.name || 'No Active Plan'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {membership?.access_details || 'Request membership enrollment from plans directory.'}
          </p>
        </Card>

        {/* Assigned Trainer Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Coaching Staff</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Assigned Floor Coach
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            {trainer?.full_name || 'Unassigned Coach'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {trainer?.specialization ? `Focus: ${trainer.specialization}` : 'Admin assigns coaches based on member goal.'}
          </p>
        </Card>

        {/* Active Workout Routine */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={18} />
            </div>
            <Link to="/member/plan" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              View &rarr;
            </Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Routine
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            {workoutPlan?.name || 'Standard Conditioning Split'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {workoutPlan?.goal ? `Goal: ${workoutPlan.goal}` : 'General Fitness & Mobility Split'}
          </p>
        </Card>

        {/* Biometrics Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
            <Link to="/member/progress" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              History &rarr;
            </Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Latest Biometrics
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            {latestProgress ? `${latestProgress.weight_kg} kg (BMI: ${latestProgress.bmi || 'N/A'})` : 'No logs yet'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {latestProgress?.measured_on ? `Measured on ${new Date(latestProgress.measured_on).toLocaleDateString()}` : 'Record measurements on your progress page.'}
          </p>
        </Card>
      </div>

      {/* Recent Attendance Preview Table */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={18} style={{ color: 'var(--accent-primary)' }} />
            Recent Facility Check-Ins
          </h3>
          <Link to="/member/attendance" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            Full Attendance Log &rarr;
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance && recentAttendance.length > 0 ? (
                recentAttendance.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td>{rec.check_in_time || '07:00 AM'}</td>
                    <td>{rec.check_out_time || '08:30 AM'}</td>
                    <td>
                      <Badge type="status" value={rec.status || 'Present'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No recent check-in records found.
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
