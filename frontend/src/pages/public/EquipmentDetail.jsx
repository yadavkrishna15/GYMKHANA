import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, ShieldAlert, Award, Activity, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function EquipmentDetail() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle(
    equipment ? `GYMKHANA | ${equipment.name}` : 'GYMKHANA | Equipment Detail',
    equipment?.description || 'Operating instructions, seat adjustments, and safety guidelines for gym equipment.'
  );

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/equipment/${id}`);
      if (res.success && res.data?.equipment) {
        setEquipment(res.data.equipment);
        setRelated(res.data.related || []);
      } else {
        setError(res.error?.message || 'Equipment item not found.');
      }
    } catch (err) {
      setError(err.message || 'Error loading equipment profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <LoadingSpinner size="lg" label="Inspecting equipment technical specs..." />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '600px' }}>
        <ErrorState
          title="Equipment Not Found"
          message={error || 'The requested machine does not exist in the database inventory.'}
          onRetry={fetchDetail}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/equipment">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Equipment Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return String(data)
      .split('\n')
      .map((item) => item.replace(/^[0-9]+[.)]\s*|^[-*]\s*/, '').trim())
      .filter(Boolean);
  };

  const howToUse = parseList(equipment.how_to_use);
  const benefits = parseList(equipment.benefits);
  const safety = parseList(equipment.safety_instructions);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/equipment" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Equipment Directory
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem',
          alignItems: 'start',
        }}>
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {equipment.category}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#1E222B', borderRadius: '4px', color: 'var(--text-muted)' }}>
                Target: {equipment.target_body_part}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.25rem' }}>
              {equipment.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {equipment.description}
            </p>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Purpose</span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {equipment.primary_purpose || 'Strength Development'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biomechanical Target</span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {equipment.target_body_part}
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Image Visual Display */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#12151B',
            border: '1px solid var(--border-subtle)',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {equipment.image_url ? (
              <img
                src={equipment.image_url}
                alt={equipment.name}
                style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--text-muted);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem;"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg><p>${equipment.name}</p></div>`;
                }}
              />
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Wrench size={48} style={{ margin: '0 auto 1rem', color: 'var(--accent-primary)' }} />
                <p>{equipment.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Manual Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {/* How to Use / Setup Steps */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
              Operating &amp; Adjustment Procedures
            </h3>
            {howToUse.length > 0 ? (
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {howToUse.map((step, idx) => (
                  <li key={idx}>
                    <strong style={{ color: 'var(--text-primary)' }}>Step {idx + 1}:</strong> {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ask an on-floor trainer for seat and pin alignment instructions.</p>
            )}
          </Card>

          {/* Machine Benefits */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--color-success)' }} />
              Biomechanical Benefits
            </h3>
            {benefits.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {benefits.map((b, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Targeted muscular isolation and reduced shear joint force.</p>
            )}
          </Card>

          {/* Safety Protocols */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} style={{ color: 'var(--color-warning)' }} />
              Safety Latches &amp; Precautions
            </h3>
            {safety.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {safety.map((s, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ensure weight stack pin is fully engaged before commencing sets.</p>
            )}
          </Card>
        </div>

        {/* Related Equipment in Category */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              Related {equipment.category} Equipment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {related.map((rel) => (
                <Link key={rel.id} to={`/equipment/${rel.id}`} style={{ textDecoration: 'none' }}>
                  <Card interactive style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {rel.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rel.target_body_part}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {rel.name}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {rel.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
