import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
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

export default function AdminExercises() {
  useDocumentTitle('GYMKHANA | Exercise Management', 'Administer database exercise library, biomechanical cues, and safety standards.');

  const [exercises, setExercises] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState('');

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    body_part: 'Chest',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: '',
    description: '',
    instructions: '',
    benefits: '',
    safety_tips: '',
    common_mistakes: '',
    image_url: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exRes, eqRes] = await Promise.all([
        api.get('/exercises'),
        api.get('/equipment'),
      ]);
      if (exRes.success) setExercises(exRes.data?.exercises || []);
      if (eqRes.success) setEquipmentList(eqRes.data?.equipment || []);
    } catch (err) {
      setError(err.message || 'Error loading exercise database');
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
      body_part: 'Chest',
      category: 'Compound',
      difficulty: 'Intermediate',
      equipment_id: '',
      description: '',
      instructions: '',
      benefits: '',
      safety_tips: '',
      common_mistakes: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (ex) => {
    setIsEditing(true);
    setEditingId(ex.id);
    setFormData({
      name: ex.name,
      body_part: ex.body_part,
      category: ex.category || 'Compound',
      difficulty: ex.difficulty,
      equipment_id: ex.equipment_id || '',
      description: ex.description || '',
      instructions: ex.instructions || '',
      benefits: ex.benefits || '',
      safety_tips: ex.safety_tips || '',
      common_mistakes: ex.common_mistakes || '',
      image_url: ex.image_url || '',
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
        res = await api.put(`/admin/exercises/${editingId}`, formData);
      } else {
        res = await api.post('/admin/exercises', formData);
      }

      if (res.success) {
        setAlertMsg({
          type: 'success',
          message: isEditing ? `Exercise "${formData.name}" updated successfully!` : `Exercise "${formData.name}" added to catalog!`,
        });
        setIsModalOpen(false);
        await fetchData();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Save operation failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (ex) => {
    setDeletingId(ex.id);
    setDeletingName(ex.name);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/exercises/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: `Exercise "${deletingName}" removed from database.` });
        setDeleteConfirmOpen(false);
        await fetchData();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Delete failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Error deleting exercise' });
    } finally {
      setDeleting(false);
    }
  };

  const bodyParts = Array.from(new Set(exercises.map((e) => e.body_part).filter(Boolean)));

  const filtered = exercises.filter((e) => {
    const matchesSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.body_part?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase());
    const matchesPart = !bodyPartFilter || e.body_part === bodyPartFilter;
    return matchesSearch && matchesPart;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Exercise Library Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Full CRUD administration for movements, anatomical target zones, and biomechanical cues.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreate}>
          Add New Exercise
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
          id="searchEx"
          placeholder="Search exercise by title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormSelect
          id="partEx"
          placeholder="All Muscle Groups"
          value={bodyPartFilter}
          onChange={(e) => setBodyPartFilter(e.target.value)}
          options={bodyParts.map((b) => ({ value: b, label: b }))}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading exercises catalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Exercises Found"
          description="Clear your filter query to view cataloged exercises."
          icon={Dumbbell}
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setBodyPartFilter(''); }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Target Muscle</th>
                <th>Difficulty</th>
                <th>Category</th>
                <th>Equipment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ex) => (
                <tr key={ex.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{ex.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {ex.body_part}
                    </span>
                  </td>
                  <td><Badge type="difficulty" value={ex.difficulty} /></td>
                  <td><span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{ex.category || 'Standard'}</span></td>
                  <td><span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{ex.equipment_name || 'Free Weight'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(ex)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => promptDelete(ex)}>
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

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Exercise' : 'Add Exercise to Library'} maxWidth="680px">
        <form onSubmit={handleSave}>
          <FormInput
            label="Exercise Name"
            id="ex_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Incline Dumbbell Bench Press"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Target Body Part"
              id="ex_body_part"
              value={formData.body_part}
              onChange={(e) => setFormData({ ...formData, body_part: e.target.value })}
              options={[
                { value: 'Chest', label: 'Chest' },
                { value: 'Back', label: 'Back' },
                { value: 'Legs', label: 'Legs' },
                { value: 'Shoulders', label: 'Shoulders' },
                { value: 'Arms', label: 'Arms' },
                { value: 'Core', label: 'Core' },
                { value: 'Full Body', label: 'Full Body' },
              ]}
              required
            />

            <FormSelect
              label="Difficulty Level"
              id="ex_diff"
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
              label="Category"
              id="ex_cat"
              placeholder="e.g. Compound, Isolation, Bodyweight"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />

            <FormSelect
              label="Associated Facility Equipment"
              id="ex_equip"
              value={formData.equipment_id}
              onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
              placeholder="None / Free Weights"
              options={equipmentList.map((eq) => ({ value: eq.id, label: eq.name }))}
            />
          </div>

          <FormInput
            label="Image URL (Optional)"
            id="ex_img"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            helper="Direct HTTPS link to an exercise image"
          />

          <FormTextarea
            label="Overview Description"
            id="ex_desc"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Concise anatomical description of movement..."
            required
          />

          <FormTextarea
            label="Step-by-Step Instructions"
            id="ex_inst"
            rows={3}
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Phase 1: Setup bench at 30 degrees&#10;Phase 2: Retract scapulae and press overhead..."
            helper="Newline-separated steps"
            required
          />

          <FormTextarea
            label="Muscular Benefits"
            id="ex_ben"
            rows={2}
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            placeholder="Upper clavicular chest hypertrophy&#10;Shoulder stability"
            helper="Newline-separated benefits"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormTextarea
              label="Safety Guidelines"
              id="ex_safe"
              rows={2}
              value={formData.safety_tips}
              onChange={(e) => setFormData({ ...formData, safety_tips: e.target.value })}
              placeholder="Do not flare elbows beyond 75 degrees"
              helper="Newline-separated safety tips"
            />

            <FormTextarea
              label="Common Mistakes"
              id="ex_mist"
              rows={2}
              value={formData.common_mistakes}
              onChange={(e) => setFormData({ ...formData, common_mistakes: e.target.value })}
              placeholder="Excessive lower back arching&#10;Bouncing weights"
              helper="Newline-separated flaws"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Update Exercise' : 'Save Exercise'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Exercise Record"
        message={`Are you sure you want to permanently remove "${deletingName}" from the public library and workout routines?`}
        loading={deleting}
      />
    </div>
  );
}
