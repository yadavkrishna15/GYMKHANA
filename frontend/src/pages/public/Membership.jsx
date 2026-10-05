import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Shield, Info, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Membership() {
  useDocumentTitle('GYMKHANA | Membership Plans', 'Compare GYMKHANA athletic access tiers and submit membership enrollments.');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/memberships');
      if (response.success) {
        setMemberships(response.data?.memberships || []);
      } else {
        setError(response.error?.message || 'Failed to retrieve plans');
      }
    } catch (err) {
      setError(err.message || 'Server error loading membership plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    setSelectedPlan(plan);
    setFeedback({ type: '', message: '' });
  };

  const handleConfirmRequest = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await api.post('/memberships/request', { membership_id: selectedPlan.id });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Your membership request for "${selectedPlan.name}" has been logged successfully! An administrator will review and activate your plan.`
        });
        setTimeout(() => {
          setSelectedPlan(null);
          navigate('/member/membership');
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: res.error?.message || 'Could not process membership request.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Request transmission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Facility Enrollment
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Membership Access Tiers
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Transparent, database-backed membership tiers tailored to your fitness objectives. Select a tier to request enrollment into your member profile.
          </p>

          {/* Academic Transparency Alert */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.875rem 1.25rem',
            backgroundColor: '#12151B',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'left',
          }}>
            <Info size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <strong>Notice:</strong> This academic field project records membership requests into MySQL without simulated payment gateways or mock transactions. Plan status is approved by the gym administrator.
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="Loading membership tiers from database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPlans} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}>
            {memberships.map((plan) => {
              const features = Array.isArray(plan.features)
                ? plan.features
                : typeof plan.features === 'string'
                ? plan.features.split(',').map((f) => f.trim())
                : [];

              const isPopular = plan.name?.toLowerCase().includes('standard') || plan.name?.toLowerCase().includes('pro');

              return (
                <Card
                  key={plan.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderColor: isPopular ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    boxShadow: isPopular ? '0 0 0 1px var(--accent-primary)' : 'none',
                  }}
                >
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '0.2rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      Recommended Tier
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>{plan.name}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Valid for {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      &#8377;{Number(plan.price).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      / term
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '44px' }}>
                    {plan.access_details}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '2rem', flex: 1 }}>
                    <h5 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Included Privileges
                    </h5>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {features.map((feature, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <Check size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={isPopular ? 'primary' : 'secondary'}
                    size="md"
                    style={{ width: '100%' }}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isAuthenticated ? 'Request Enrollment' : 'Join to Enroll'}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {/* Membership Request Modal */}
        <Modal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title={`Confirm Membership Request: ${selectedPlan?.name}`}
        >
          {feedback.message && (
            <Alert type={feedback.type} message={feedback.message} />
          )}

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            You are requesting enrollment for the <strong>{selectedPlan?.name}</strong> plan (&#8377;{Number(selectedPlan?.price).toLocaleString()} for {selectedPlan?.duration_months} months).
          </p>

          <div style={{
            backgroundColor: '#12151B',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            <strong>Member:</strong> {user?.full_name} ({user?.email})<br />
            <strong>Access:</strong> {selectedPlan?.access_details}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => setSelectedPlan(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmRequest} loading={submitting}>
              Submit Request to Gym Admin
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
