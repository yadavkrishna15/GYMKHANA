import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, Award, Dumbbell, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function ExerciseDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle(
    exercise ? `GYMKHANA | ${exercise.name}` : 'GYMKHANA | Exercise Detail',
    exercise?.description || 'Detailed exercise technique, safety guidelines, and biomechanics.'
  );

  const fetchExerciseDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/exercises/${id}`);
      if (res.success && res.data?.exercise) {
        setExercise(res.data.exercise);
        setRelated(res.data.related || []);
      } else {
        setError(res.error?.message || 'Exercise not found.');
      }
    } catch (err) {
      setError(err.message || 'Error loading exercise.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <LoadingSpinner size="lg" label="Loading exercise specifications..." />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '600px' }}>
        <ErrorState
          title="Exercise Not Found"
          message={error || 'The requested exercise record does not exist in the database.'}
          onRetry={fetchExerciseDetail}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/exercises">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Exercise Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper to parse items that might be stored as newline separated or JSON string
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

  const instructions = parseList(exercise.instructions);
  const benefits = parseList(exercise.benefits);
  const safetyTips = parseList(exercise.safety_tips);
  const commonMistakes = parseList(exercise.common_mistakes);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/exercises" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Exercises
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
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {exercise.body_part}
              </span>
              <Badge type="difficulty" value={exercise.difficulty} />
              {exercise.category && (
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: '#1E222B', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  {exercise.category}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.25rem' }}>
              {exercise.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {exercise.description}
            </p>

            {/* Quick Metrics Card */}
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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Musculature</span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {exercise.body_part}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Equipment</span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {exercise.equipment_name || 'Bodyweight / Free Weight'}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Visual Display */}
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
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--text-muted);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem;"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg><p>${exercise.name}</p></div>`;
                }}
              />
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Dumbbell size={48} style={{ margin: '0 auto 1rem', color: 'var(--accent-primary)' }} />
                <p>{exercise.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Instructional Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {/* Step-by-Step Instructions */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
              Step-by-Step Execution
            </h3>
            {instructions.length > 0 ? (
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {instructions.map((step, idx) => (
                  <li key={idx}>
                    <strong style={{ color: 'var(--text-primary)' }}>Phase {idx + 1}:</strong> {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Detailed cues available from your assigned coach.</p>
            )}
          </Card>

          {/* Benefits */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--color-success)' }} />
              Performance &amp; Hypertrophy Benefits
            </h3>
            {benefits.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {benefits.map((benefit, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Targeted athletic adaptation.</p>
            )}
          </Card>

          {/* Safety Tips */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} style={{ color: 'var(--color-info)' }} />
              Safety Protocols &amp; Joint Alignment
            </h3>
            {safetyTips.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {safetyTips.map((tip, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Always maintain a braced core and neutral spinal posture.</p>
            )}
          </Card>

          {/* Common Mistakes */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
              Common Biomechanical Flaws
            </h3>
            {commonMistakes.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {commonMistakes.map((flaw, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{flaw}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avoid using excessive momentum or compromising joint angles.</p>
            )}
          </Card>
        </div>

        {/* Related Exercises in same body part */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              Related Exercises for {exercise.body_part}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {related.map((rel) => (
                <Link key={rel.id} to={`/exercises/${rel.id}`} style={{ textDecoration: 'none' }}>
                  <Card interactive style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {rel.body_part}
                      </span>
                      <Badge type="difficulty" value={rel.difficulty} />
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
