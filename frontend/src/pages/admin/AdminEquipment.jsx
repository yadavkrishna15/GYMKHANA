import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminEquipment() {
  useDocumentTitle('GYMKHANA | Equipment Inventory', 'Administer gym machinery, safety pins, and adjustment guides.');

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pin-Selected Machine',
    target_body_part: 'Chest',
    description: '',
    primary_purpose: 'Hypertrophy & Isolation',
    benefits: '',
    how_to_use: '',
    safety_instructions: '',
    image_url: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/equipment');
      if (res.success) {
        setEquipmentList(res.data?.equipment || []);
      } else {
        setError(res.error?.message || 'Failed to fetch equipment');
      }
    } catch (err) {
      setError(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Pin-Selected Machine',
      target_body_part: 'Chest',
      description: '',
      primary_purpose: 'Hypertrophy & Isolation',
      benefits: '',
      how_to_use: '',
      safety_instructions: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (eq) => {
    setIsEditing(true);
    setEditingId(eq.id);
    setFormData({
      name: eq.name,
      category: eq.category,
      target_body_part: eq.target_body_part,
      description: eq.description || '',
      primary_purpose: eq.primary_purpose || '',
      benefits: eq.benefits || '',
      how_to_use: eq.how_to_use || '',
      safety_instructions: eq.safety_instructions || '',
      image_url: eq.image_url || '',
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
        res = await api.put(`/admin/equipment/${editingId}`, formData);
      } else {
        res = await api.post('/admin/equipment', formData);
      }

      if (res.success) {
        setAlertMsg({
          type: 'success',
          message: isEditing ? `Equipment "${formData.name}" updated successfully!` : `Equipment "${formData.name}" added to inventory!`,
        });
        setIsModalOpen(false);
        await fetchEquipment();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Save failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (eq) => {
    setDeletingId(eq.id);
    setDeletingName(eq.name);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/equipment/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: `Machine "${deletingName}" removed from database.` });
        setDeleteConfirmOpen(false);
        await fetchEquipment();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Delete operation failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Deletion error' });
    } finally {
      setDeleting(false);
    }
  };

  const categories = Array.from(new Set(equipmentList.map((e) => e.category).filter(Boolean)));

  const filtered = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.name?.toLowerCase().includes(search.toLowerCase()) ||
      eq.description?.toLowerCase().includes(search.toLowerCase()) ||
      eq.target_body_part?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !catFilter || eq.category === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Equipment Inventory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Catalog facility machinery, station categories, adjustment guides, and safety instructions.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreate}>
          Register New Machine
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
          id="searchEq"
          placeholder="Search machine by title or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormSelect
          id="catEq"
          placeholder="All Machine Categories"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading equipment roster..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEquipment} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Equipment Items Found"
          description="Adjust your keyword search or category filter."
          icon={Wrench}
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setCatFilter(''); }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Machine Name</th>
                <th>Category</th>
                <th>Target Muscle</th>
                <th>Primary Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => (
                <tr key={eq.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{eq.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {eq.category}
                    </span>
                  </td>
                  <td>{eq.target_body_part}</td>
                  <td><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{eq.primary_purpose}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(eq)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => promptDelete(eq)}>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Machine Spec' : 'Register Machine in Inventory'} maxWidth="680px">
        <form onSubmit={handleSave}>
          <FormInput
            label="Machine Name"
            id="eq_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Seated Cable Row Station"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Machine Category"
              id="eq_category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Pin-Selected Machine', label: 'Pin-Selected Machine' },
                { value: 'Plate-Loaded Machine', label: 'Plate-Loaded Machine' },
                { value: 'Cable Station', label: 'Cable Station' },
                { value: 'Free Weights / Benches', label: 'Free Weights / Benches' },
                { value: 'Cardio Station', label: 'Cardio Station' },
              ]}
              required
            />

            <FormSelect
              label="Target Muscle Group"
              id="eq_target"
              value={formData.target_body_part}
              onChange={(e) => setFormData({ ...formData, target_body_part: e.target.value })}
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
          </div>

          <FormInput
            label="Primary Biomechanical Purpose"
            id="eq_purp"
            value={formData.primary_purpose}
            onChange={(e) => setFormData({ ...formData, primary_purpose: e.target.value })}
            placeholder="e.g. Latissimus dorsi hypertrophy & scapular retractors"
            required
          />

          <FormInput
            label="Image URL (Optional)"
            id="eq_img"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <FormTextarea
            label="Overview Description"
            id="eq_desc"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <FormTextarea
            label="Adjustment & Operating Steps"
            id="eq_use"
            rows={3}
            value={formData.how_to_use}
            onChange={(e) => setFormData({ ...formData, how_to_use: e.target.value })}
            placeholder="Step 1: Adjust seat height so chest pad aligns with sternum&#10;Step 2: Insert selector pin..."
            helper="Newline-separated operating instructions"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormTextarea
              label="Biomechanical Benefits"
              id="eq_ben"
              rows={2}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Reduced lower back spinal compression"
              helper="Newline-separated"
            />

            <FormTextarea
              label="Safety Instructions"
              id="eq_safe"
              rows={2}
              value={formData.safety_instructions}
              onChange={(e) => setFormData({ ...formData, safety_instructions: e.target.value })}
              placeholder="Check cable tension before loading maximum stack"
              helper="Newline-separated"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Update Machine' : 'Save Machine'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Machine Record"
        message={`Are you sure you want to permanently delete "${deletingName}" from the facility inventory?`}
        loading={deleting}
      />
    </div>
  );
}
