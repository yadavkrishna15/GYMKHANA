import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Check, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState, EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberMembership() {
  useDocumentTitle('GYMKHANA | My Membership', 'View your active membership tier, privileges, and enrollment status.');

  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembership = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/members/membership');
      if (res.success) {
        setMembershipData(res.data);
      } else {
        setError(res.error?.message || 'Could not load membership details');
      }
    } catch (err) {
      setError(err.message || 'Server error loading membership');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Retrieving membership status..." />;
  if (error) return <ErrorState message={error} onRetry={fetchMembership} />;

  const { membership, member } = membershipData || {};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>My Membership Status</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Details of your current gym enrollment, duration, and facility privileges.
        </p>
      </div>

      {!membership ? (
        <EmptyState
          title="No Active Membership Assigned"
          description="You do not currently have an active membership tier attached to your profile. Explore our membership tiers to submit an enrollment request."
          icon={CreditCard}
          actionText="Explore Membership Plans"
          onAction={() => window.location.href = '/membership'}
        />
      ) : (
        <Card style={{ padding: '2.5rem', backgroundColor: '#13161C', borderColor: 'var(--border-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Current Plan
                </span>
                <Badge type="status" value={member?.status || 'Active'} />
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{membership.name}</h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                &#8377;{Number(membership.price).toLocaleString()}
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {membership.duration_months} Month Term
              </span>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {membership.access_details}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1.25rem',
            backgroundColor: 'var(--surface-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Join Date</span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {member?.join_date ? new Date(member.join_date).toLocaleDateString() : 'Active'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Term Duration</span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {membership.duration_months} Months
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Processing</span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                Verified by Admin
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Included Tier Privileges
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {(Array.isArray(membership.features)
                ? membership.features
                : typeof membership.features === 'string'
                ? membership.features.split(',').map((f) => f.trim())
                : []
              ).map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Check size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/membership">
              <Button variant="secondary" size="sm">
                Request Tier Upgrade &rarr;
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
