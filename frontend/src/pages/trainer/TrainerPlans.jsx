import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, Trash2, Edit2, Dumbbell, ExternalLink } from 'lucide-react';
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

export default function TrainerPlans() {
  useDocumentTitle('GYMKHANA | Coach Workout Plans', 'Author and manage periodized training routines.');

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    goal: 'Muscle Building',
    difficulty: 'Intermediate',
    duration_weeks: 8,
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/trainers/plans');
      if (res.success) {
        setPlans(res.data?.plans || []);
      } else {
        setError(res.error?.message || 'Failed to fetch coach workout plans');
      }
    } catch (err) {
      setError(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      goal: 'Muscle Building',
      difficulty: 'Intermediate',
      duration_weeks: 8,
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      name: p.name,
      goal: p.goal,
      difficulty: p.difficulty,
      duration_weeks: p.duration_weeks,
      description: p.description,
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
          message: isEditing ? 'Workout plan updated successfully!' : 'New workout plan created!',
        });
        setIsModalOpen(false);
        await fetchPlans();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Failed to save plan' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Error communicating with server' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/workouts/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Workout plan deleted successfully.' });
        setDeleteConfirmOpen(false);
        await fetchPlans();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Failed to delete plan' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Deletion error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Author Workout Plans</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Design and curate periodized training routines available for member assignment.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Create New Plan
        </Button>
      </div>

      {alertMsg.message && (
        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg({ type: '', message: '' })} />
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading authored workout routines..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPlans} />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No Workout Plans Created"
          description="Create your first training routine with target goals, sets, and rep prescriptions."
          icon={Layers}
          actionText="Create Workout Plan"
          onAction={openCreateModal}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {plans.map((p) => (
            <Card key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <Badge type="difficulty" value={p.difficulty} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {p.duration_weeks} Weeks
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{p.name}</h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Goal: <strong style={{ color: 'var(--text-primary)' }}>{p.goal}</strong>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                <Link to={`/workout-plans/${p.id}`} target="_blank" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Public Preview <ExternalLink size={13} />
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEditModal(p)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => confirmDelete(p.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Workout Plan' : 'Create Workout Plan'}>
        <form onSubmit={handleSave}>
          <FormInput
            label="Plan Title"
            id="plan_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. 8-Week Hypertrophy Split"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Primary Goal"
              id="plan_goal"
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
              label="Difficulty Level"
              id="plan_diff"
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

          <FormInput
            label="Duration (Weeks)"
            id="plan_duration"
            type="number"
            min="1"
            max="52"
            value={formData.duration_weeks}
            onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 1 })}
            required
          />

          <FormTextarea
            label="Program Overview & Instructions"
            id="plan_desc"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe split frequency, weekly schedule, and progression rules..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Workout Plan"
        message="Are you sure you want to permanently delete this workout plan? Any member schedules referencing it will be unassigned."
        loading={deleting}
      />
    </div>
  );
}
