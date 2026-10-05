import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Dumbbell, ArrowRight, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Exercises() {
  useDocumentTitle('GYMKHANA | Exercises', 'Explore our database-driven library of strength, conditioning, and hypertrophy exercises.');

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/exercises');
      if (res.success) {
        setExercises(res.data?.exercises || []);
      } else {
        setError(res.error?.message || 'Failed to fetch exercise library');
      }
    } catch (err) {
      setError(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const bodyParts = Array.from(new Set(exercises.map((e) => e.body_part).filter(Boolean)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exercises
    .filter((e) => {
      const matchesSearch =
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.body_part?.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase());
      const matchesBody = !bodyPart || e.body_part === bodyPart;
      const matchesDiff = !difficulty || e.difficulty === difficulty;
      return matchesSearch && matchesBody && matchesDiff;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'difficulty') {
        const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      }
      return 0;
    });

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '760px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Technique Directory
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Comprehensive Exercise Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Explore verified anatomical exercises cataloged with target muscle groups, required gym equipment, step-by-step biomechanical cues, and safety tips.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
          backgroundColor: 'var(--surface-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <FormInput
            id="exerciseSearch"
            placeholder="Search exercises by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormSelect
            id="bodyPartFilter"
            placeholder="All Muscle Groups"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
            options={bodyParts.map((b) => ({ value: b, label: b }))}
          />

          <FormSelect
            id="diffFilter"
            placeholder="All Difficulties"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={difficulties.map((d) => ({ value: d, label: d }))}
          />

          <FormSelect
            id="sortFilter"
            placeholder="Sort Results By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Name (A to Z)' },
              { value: 'difficulty', label: 'Difficulty (Beginner to Adv)' },
            ]}
          />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="Loading exercise repository from MySQL..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchExercises} />
        ) : filteredExercises.length === 0 ? (
          <EmptyState
            title="No exercises found matching criteria"
            description="Try changing muscle group filters, adjusting your search term, or clearing filters."
            actionText="Clear All Filters"
            onAction={() => {
              setSearch('');
              setBodyPart('');
              setDifficulty('');
              setSortBy('name');
            }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {filteredExercises.map((exercise) => (
              <Link key={exercise.id} to={`/exercises/${exercise.id}`} style={{ textDecoration: 'none' }}>
                <Card interactive style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {exercise.image_url ? (
                    <div style={{
                      height: '180px',
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#12151B',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={exercise.image_url}
                        alt={exercise.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:0.875rem;">${exercise.body_part}</div>`;
                        }}
                      />
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {exercise.body_part}
                    </span>
                    <Badge type="difficulty" value={exercise.difficulty} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {exercise.name}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {exercise.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.875rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                  }}>
                    <span>{exercise.equipment_name ? `Equipment: ${exercise.equipment_name}` : 'Bodyweight / Free'}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Instructions &rarr;
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
