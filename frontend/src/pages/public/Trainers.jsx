import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Briefcase, CheckCircle, Search, Mail, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Trainers() {
  useDocumentTitle(
    'GYMKHANA | Certified Trainers',
    'Meet the certified floor coaches and fitness specialists guiding training programs at GYMKHANA.'
  );

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/trainers');
      if (res.success) {
        setTrainers(res.data?.trainers || []);
      } else {
        setError(res.error?.message || 'Failed to load trainers.');
      }
    } catch (err) {
      setError(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Filter logic
  const specializations = Array.from(new Set(trainers.map((t) => t.specialization).filter(Boolean)));

  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = !specFilter || t.specialization === specFilter;
    return matchesSearch && matchesSpec;
  });

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Athletic Guidance
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Certified Coaching Staff
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our certified training staff supervise floor technique, construct tailored periodized workout plans, and track biometric progress.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          <FormInput
            id="trainerSearch"
            placeholder="Search trainers by name, focus, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormSelect
            id="specFilter"
            placeholder="All Specializations"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            options={specializations.map((s) => ({ value: s, label: s }))}
          />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="Retrieving coaching staff profiles..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTrainers} />
        ) : filteredTrainers.length === 0 ? (
          <EmptyState
            title="No trainers matched your query"
            description="Try adjusting your keyword search or clearing the specialization filter."
            actionText="Clear Filters"
            onAction={() => { setSearchTerm(''); setSpecFilter(''); }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {filteredTrainers.map((trainer) => (
              <Card key={trainer.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: '#1E222B',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}>
                    {trainer.full_name?.charAt(0) || 'T'}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{trainer.full_name}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {trainer.specialization}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {trainer.experience_years} Years Experience
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {trainer.bio}
                </p>

                {trainer.certifications && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#12151B',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem',
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Certifications:</strong>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>{trainer.certifications}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                }}>
                  <Badge type="status" value={trainer.availability_status} />
                  <Link to={`/contact?trainer=${encodeURIComponent(trainer.full_name)}`}>
                    <Button variant="ghost" size="sm" icon={Mail}>
                      Inquire Session
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
