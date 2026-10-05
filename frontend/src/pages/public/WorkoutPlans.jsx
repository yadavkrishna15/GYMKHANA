import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Calendar, Dumbbell, ArrowRight, Target, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function WorkoutPlans() {
  useDocumentTitle('GYMKHANA | Workout Plans', 'Periodized training programs with structured splits, sets, reps, and recovery intervals.');

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/workouts');
      if (res.success) {
        setPlans(res.data?.plans || []);
      } else {
        setError(res.error?.message || 'Failed to fetch workout plans');
      }
    } catch (err) {
      setError(err.message || 'Server error loading workout routines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const goals = Array.from(new Set(plans.map((p) => p.goal).filter(Boolean)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.goal?.toLowerCase().includes(search.toLowerCase());
    const matchesGoal = !goalFilter || p.goal === goalFilter;
    const matchesDiff = !diffFilter || p.difficulty === diffFilter;
    return matchesSearch && matchesGoal && matchesDiff;
  });

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '760px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Periodized Programs
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Structured Workout Plans
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Goal-specific workout splits sequenced with progressive overload protocols, exercise prescriptions, rep ranges, and structured rest periods.
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
          backgroundColor: 'var(--surface-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <FormInput
            id="planSearch"
            placeholder="Search plans by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormSelect
            id="goalFilter"
            placeholder="All Primary Goals"
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            options={goals.map((g) => ({ value: g, label: g }))}
          />

          <FormSelect
            id="diffFilter"
            placeholder="All Experience Levels"
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value)}
            options={difficulties.map((d) => ({ value: d, label: d }))}
          />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="Loading workout schedules..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPlans} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No workout plans matched your filters"
            description="Try choosing a different athletic goal or clearing your filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setGoalFilter('');
              setDiffFilter('');
            }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((plan) => (
              <Link key={plan.id} to={`/workout-plans/${plan.id}`} style={{ textDecoration: 'none' }}>
                <Card interactive style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <Badge type="difficulty" value={plan.difficulty} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {plan.duration_weeks} Weeks
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {plan.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <Target size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span>Goal: {plan.goal}</span>
                    {plan.exercise_count !== undefined && (
                      <>
                        <span>&bull;</span>
                        <Dumbbell size={14} />
                        <span>{plan.exercise_count} Exercises</span>
                      </>
                    )}
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {plan.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.875rem',
                    fontSize: '0.8125rem',
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Created by Certified Coach</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      View Plan Breakdown &rarr;
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
