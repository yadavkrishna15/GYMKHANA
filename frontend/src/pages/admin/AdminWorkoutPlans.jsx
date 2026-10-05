import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Dumbbell, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminWorkoutPlans() {
  useDocumentTitle('GYMKHANA | Workout Plan Admin', 'Create and structure periodized workout programs.');

  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    goal: 'Muscle Building',
    difficulty: 'Intermediate',
    duration_weeks: 8,
    description: '',
    trainer_id: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get('/workouts'),
        api.get('/trainers'),
      ]);
      if (pRes.success) setPlans(pRes.data?.plans || []);
      if (tRes.success) setTrainers(tRes.data?.trainers || []);
    } catch (err) {
      setError(err.message || 'Error loading plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      goal: 'Muscle Building',
      difficulty: 'Intermediate',
      duration_weeks: 8,
      description: '',
      trainer_id: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      name: p.name,
      goal: p.goal,
      difficulty: p.difficulty,
      duration_weeks: p.duration_weeks,
      description: p.description || '',
      trainer_id: p.created_by || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertMsg({ type: '', message: '' });

    try {
      let res;
      if (isEditing) {
        res = await api.put(`/workouts/${editingId}`, formData);
      } else {
        res = await api.post('/workouts', formData);
      }

      if (res.success) {
        setAlertMsg({
          type: 'success',
          message: isEditing ? `Plan "${formData.name}" updated successfully!` : `Plan "${formData.name}" created!`,
        });
        setIsModalOpen(false);
        await fetchData();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Save failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (p) => {
    setDeletingId(p.id);
    setDeletingName(p.name);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/workouts/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: `Plan "${deletingName}" deleted.` });
        setDeleteConfirmOpen(false);
        await fetchData();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Delete failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Error deleting plan' });
    } finally {
      setDeleting(false);
    }
  };

  const goals = Array.from(new Set(plans.map((p) => p.goal).filter(Boolean)));

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesGoal = !goalFilter || p.goal === goalFilter;
    return matchesSearch && matchesGoal;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Workout Plan Administration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Author training programs, assign coach authors, and inspect member prescription volume.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreate}>
          Create Workout Plan
        </Button>
      </div>

      {alertMsg.message && (
        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg({ type: '', message: '' })} />
      )}

      {/* Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
        backgroundColor: 'var(--surface-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <FormInput
          id="searchPlan"
          placeholder="Search by plan title or goal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormSelect
          id="filterGoal"
          placeholder="All Training Goals"
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          options={goals.map((g) => ({ value: g, label: g }))}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading workout schedules..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Workout Plans Found"
          description="Clear your filters to view cataloged training programs."
          icon={Layers}
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setGoalFilter(''); }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Target Goal</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Prescribed Exercises</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {p.goal}
                    </span>
                  </td>
                  <td><Badge type="difficulty" value={p.difficulty} /></td>
                  <td>{p.duration_weeks} Weeks</td>
                  <td>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {p.exercise_count !== undefined ? `${p.exercise_count} Movements` : 'Cataloged'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(p)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => promptDelete(p)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Workout Plan' : 'Create Workout Plan'}>
        <form onSubmit={handleSave}>
          <FormInput
            label="Plan Title"
            id="ap_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. 12-Week Powerbuilding Program"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Primary Goal"
              id="ap_goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              options={[
                { value: 'Muscle Building', label: 'Muscle Building' },
                { value: 'Strength', label: 'Strength' },
                { value: 'Weight Loss', label: 'Weight Loss' },
                { value: 'General Fitness', label: 'General Fitness' },
              ]}
              required
            />

            <FormSelect
              label="Difficulty"
              id="ap_diff"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Duration (Weeks)"
              id="ap_weeks"
              type="number"
              min="1"
              max="52"
              value={formData.duration_weeks}
              onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 1 })}
              required
            />

            <FormSelect
              label="Assigned Author Coach"
              id="ap_coach"
              value={formData.trainer_id}
              onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
              placeholder="Head Coaching Staff"
              options={trainers.map((t) => ({ value: t.id, label: t.full_name }))}
            />
          </div>

          <FormTextarea
            label="Plan Overview"
            id="ap_desc"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Workout Program"
        message={`Are you sure you want to permanently delete "${deletingName}"? Member assignments will be cleared.`}
        loading={deleting}
      />
    </div>
  );
}
