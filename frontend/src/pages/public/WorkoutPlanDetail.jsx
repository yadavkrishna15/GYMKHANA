import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Calendar, Dumbbell, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function WorkoutPlanDetail() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle(
    plan ? `GYMKHANA | ${plan.name}` : 'GYMKHANA | Workout Plan Detail',
    plan?.description || 'Full daily workout split, set and rep prescriptions, and rest intervals.'
  );

  const fetchPlanDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/workouts/${id}`);
      if (res.success && res.data?.plan) {
        setPlan(res.data.plan);
        setExercises(res.data.exercises || []);
      } else {
        setError(res.error?.message || 'Workout plan not found.');
      }
    } catch (err) {
      setError(err.message || 'Error loading plan details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <LoadingSpinner size="lg" label="Loading workout plan schedule..." />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '600px' }}>
        <ErrorState
          title="Plan Not Found"
          message={error || 'The requested training routine is not cataloged in the database.'}
          onRetry={fetchPlanDetail}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/workout-plans">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Workout Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Group exercises by day_or_order (e.g., "Day 1", "Day 2", etc.)
  const groupedExercises = exercises.reduce((acc, curr) => {
    const dayKey = curr.day_or_order || 'Session 1';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(curr);
    return acc;
  }, {});

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/workout-plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Workout Plans
          </Link>
        </div>

        {/* Plan Header Card */}
        <Card style={{ padding: '2.5rem', marginBottom: '3rem', backgroundColor: '#13161C', borderColor: 'var(--border-strong)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Badge type="difficulty" value={plan.difficulty} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {plan.goal}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            {plan.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '820px', marginBottom: '2rem' }}>
            {plan.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Program Length</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {plan.duration_weeks} Weeks
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Adaptation</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                {plan.goal}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Prescribed Movements</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {exercises.length} Exercises
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authoring Coach</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {plan.trainer_name || 'GYMKHANA Head Coach'}
              </div>
            </div>
          </div>
        </Card>

        {/* Structured Daily Schedule */}
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Calendar size={22} style={{ color: 'var(--accent-primary)' }} />
          Structured Daily Exercise Breakdown
        </h2>

        {Object.keys(groupedExercises).length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No exercises linked to this plan yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {Object.entries(groupedExercises).map(([dayTitle, dayExercises]) => (
              <div key={dayTitle}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#12151B',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{dayTitle}</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {dayExercises.length} Movements
                  </span>
                </div>

                {/* Table representation for desktop, responsive card fallback */}
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Exercise Name</th>
                        <th>Target Area</th>
                        <th>Working Sets</th>
                        <th>Reps / Scheme</th>
                        <th>Rest Interval</th>
                        <th>Technique Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayExercises.map((ex, idx) => (
                        <tr key={ex.id || idx}>
                          <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                            #{idx + 1}
                          </td>
                          <td>
                            <Link to={`/exercises/${ex.exercise_id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              {ex.exercise_name || `Exercise ID: ${ex.exercise_id}`}
                              <ChevronRight size={14} style={{ color: 'var(--accent-primary)' }} />
                            </Link>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                              {ex.body_part || 'Full Body'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {ex.sets} Sets
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {ex.reps}
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={13} /> {ex.rest_seconds ? `${ex.rest_seconds}s` : '60-90s'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {ex.notes || 'Maintain controlled eccentric tempo.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
