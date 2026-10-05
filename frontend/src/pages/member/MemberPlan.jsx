import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Clock, Target, Calendar, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberPlan() {
  useDocumentTitle('GYMKHANA | My Workout Plan', 'Inspect your assigned training program, exercise routines, and set schemes.');

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/members/workout-plan');
      if (res.success) {
        setPlanData(res.data);
      } else {
        setError(res.error?.message || 'Could not load workout plan');
      }
    } catch (err) {
      setError(err.message || 'Server error loading plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Retrieving your training program..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPlan} />;

  const { plan, exercises = [] } = planData || {};

  if (!plan) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>My Workout Routine</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Personalized training program prescribed by your coach.
          </p>
        </div>
        <EmptyState
          title="No Workout Plan Assigned"
          description="Your coach or the gym administrator has not assigned a personalized workout plan yet. You can browse the public catalog in the meantime."
          icon={Dumbbell}
          actionText="Browse Workout Catalog"
          onAction={() => window.location.href = '/workout-plans'}
        />
      </div>
    );
  }

  // Group by day_or_order
  const groupedExercises = exercises.reduce((acc, curr) => {
    const dayKey = curr.day_or_order || 'Session 1';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(curr);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>My Assigned Training Split</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Follow your prescribed daily movements, working volume, and target repetitions.
        </p>
      </div>

      <Card style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#13161C', borderColor: 'var(--border-strong)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Badge type="difficulty" value={plan.difficulty} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Goal: {plan.goal}
          </span>
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{plan.name}</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {plan.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</span>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{plan.duration_weeks} Weeks</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authoring Trainer</span>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{plan.trainer_name || 'Floor Coach'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prescribed Movements</span>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{exercises.length} Exercises</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {Object.entries(groupedExercises).map(([dayTitle, dayExercises]) => (
          <div key={dayTitle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#12151B',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
            }}>
              <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.1rem' }}>{dayTitle}</h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {dayExercises.length} Movements
              </span>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Exercise</th>
                    <th>Target Area</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Rest</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {dayExercises.map((ex, idx) => (
                    <tr key={ex.id || idx}>
                      <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{idx + 1}</td>
                      <td>
                        <Link to={`/exercises/${ex.exercise_id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {ex.exercise_name || `Exercise #${ex.exercise_id}`}
                          <ChevronRight size={14} style={{ color: 'var(--accent-primary)' }} />
                        </Link>
                      </td>
                      <td><span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{ex.body_part || 'Full Body'}</span></td>
                      <td style={{ fontWeight: 700 }}>{ex.sets} Sets</td>
                      <td>{ex.reps}</td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {ex.rest_seconds ? `${ex.rest_seconds}s` : '60s'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>{ex.notes || 'Strict form'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
