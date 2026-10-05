import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput, FormTextarea } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminMemberships() {
  useDocumentTitle('GYMKHANA | Membership Tiers Admin', 'Configure facility membership rates, durations, and tier privileges.');

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration_months: 1,
    price: '',
    access_details: '',
    features: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchMemberships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/memberships');
      if (res.success) {
        setMemberships(res.data?.memberships || []);
      } else {
        setError(res.error?.message || 'Failed to load membership plans');
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      duration_months: 1,
      price: '',
      access_details: '',
      features: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (m) => {
    setIsEditing(true);
    setEditingId(m.id);
    const featuresStr = Array.isArray(m.features)
      ? m.features.join('\n')
      : typeof m.features === 'string'
      ? m.features
      : '';
    setFormData({
      name: m.name,
      duration_months: m.duration_months,
      price: m.price,
      access_details: m.access_details || '',
      features: featuresStr,
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
        res = await api.put(`/admin/memberships/${editingId}`, formData);
      } else {
        res = await api.post('/admin/memberships', formData);
      }

      if (res.success) {
        setAlertMsg({
          type: 'success',
          message: isEditing ? `Tier "${formData.name}" updated successfully!` : `Tier "${formData.name}" created!`,
        });
        setIsModalOpen(false);
        await fetchMemberships();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Save failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (m) => {
    setDeletingId(m.id);
    setDeletingName(m.name);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/memberships/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: `Tier "${deletingName}" removed.` });
        setDeleteConfirmOpen(false);
        await fetchMemberships();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Delete failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Error deleting plan' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Membership Plan Tiers</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Configure facility membership tiers, duration periods, pricing structures, and included amenities.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreate}>
          Create Membership Tier
        </Button>
      </div>

      {alertMsg.message && (
        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg({ type: '', message: '' })} />
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading membership tiers from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMemberships} />
      ) : memberships.length === 0 ? (
        <EmptyState
          title="No Membership Tiers Configured"
          description="Create your first facility access tier."
          icon={CreditCard}
          actionText="Create Tier"
          onAction={openCreate}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {memberships.map((m) => (
            <Card key={m.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.35rem' }}>{m.name}</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {m.duration_months} Months
                </span>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                &#8377;{Number(m.price).toLocaleString()}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                {m.access_details}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(m)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon={Trash2} onClick={() => promptDelete(m)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Membership Tier' : 'Create Membership Tier'}>
        <form onSubmit={handleSave}>
          <FormInput
            label="Tier Name"
            id="tier_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Standard 6-Month Athletic Pass"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Duration (Months)"
              id="tier_duration"
              type="number"
              min="1"
              max="36"
              value={formData.duration_months}
              onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 1 })}
              required
            />

            <FormInput
              label="Price (₹ INR)"
              id="tier_price"
              type="number"
              step="1"
              placeholder="e.g. 5000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <FormTextarea
            label="Access Privileges & Hours"
            id="tier_access"
            rows={2}
            value={formData.access_details}
            onChange={(e) => setFormData({ ...formData, access_details: e.target.value })}
            placeholder="e.g. Full facility access Monday-Saturday 06:00-22:00, locker room access..."
            required
          />

          <FormTextarea
            label="Included Features & Amenities"
            id="tier_features"
            rows={3}
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="Cardio & Free Weight Access&#10;Locker & Shower Facility&#10;1 Monthly Biometric Assessment"
            helper="Newline-separated bullet points"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Save Tier Changes' : 'Create Tier'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Membership Tier"
        message={`Are you sure you want to permanently delete tier "${deletingName}"? Existing active memberships will retain their historical record.`}
        loading={deleting}
      />
    </div>
  );
}
