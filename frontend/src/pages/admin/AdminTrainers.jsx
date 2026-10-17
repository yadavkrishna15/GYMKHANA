import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Search, CheckCircle, UserPlus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const SPECIALIZATION_OPTIONS = [
  { value: 'Strength & Conditioning', label: 'Strength & Conditioning' },
  { value: 'CrossFit & Functional Training', label: 'CrossFit & Functional Training' },
  { value: 'Bodybuilding & Hypertrophy', label: 'Bodybuilding & Hypertrophy' },
  { value: 'Yoga & Functional Mobility', label: 'Yoga & Functional Mobility' },
  { value: 'Weight Loss & Nutrition Coaching', label: 'Weight Loss & Nutrition Coaching' },
  { value: 'Athletic Performance & Speed', label: 'Athletic Performance & Speed' },
];

export default function AdminTrainers() {
  useDocumentTitle('GYMKHANA | Trainer Management', 'Administer coaching personnel, qualifications, and athlete capacity.');

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({
    specialization: '',
    experience_years: 3,
    bio: '',
    certifications: '',
    availability_status: 'Available',
  });

  // Add Coach Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCoach, setNewCoach] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    specialization: 'Strength & Conditioning',
    experience_years: 3,
    certifications: '',
    bio: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/trainers');
      if (res.success) {
        setTrainers(res.data?.trainers || []);
      } else {
        setError(res.error?.message || 'Failed to fetch trainers');
      }
    } catch (err) {
      setError(err.message || 'Server error loading trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const openEdit = (t) => {
    setEditingTrainer(t);
    setFormData({
      specialization: t.specialization || '',
      experience_years: t.experience_years || 1,
      bio: t.bio || '',
      certifications: t.certifications || '',
      availability_status: t.availability_status || 'Available',
    });
    setEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingTrainer) return;
    setSaving(true);
    setAlertMsg({ type: '', message: '' });

    try {
      const res = await api.put(`/admin/trainers/${editingTrainer.id}`, formData);
      if (res.success) {
        setAlertMsg({ type: 'success', message: `Coach ${editingTrainer.full_name} updated successfully!` });
        setEditModalOpen(false);
        await fetchTrainers();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Update failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    if (!newCoach.full_name.trim() || !newCoach.email.trim() || !newCoach.password) {
      setAlertMsg({ type: 'error', message: 'Name, email and password are required' });
      return;
    }

    setSaving(true);
    setAlertMsg({ type: '', message: '' });

    try {
      const res = await api.post('/admin/trainers', {
        ...newCoach,
        experience_years: parseInt(newCoach.experience_years, 10) || 1,
        bio: newCoach.bio.trim() || `Certified ${newCoach.specialization} Coach at GYMKHANA.`,
      });

      if (res.success) {
        setAlertMsg({ type: 'success', message: `Coach ${newCoach.full_name} onboarded successfully!` });
        setAddModalOpen(false);
        setNewCoach({
          full_name: '',
          email: '',
          phone: '',
          password: '',
          specialization: 'Strength & Conditioning',
          experience_years: 3,
          certifications: '',
          bio: '',
        });
        await fetchTrainers();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Failed to add coach' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error creating coach' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = trainers.filter((t) =>
    t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Coaching Staff Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Manage floor trainers, onboard new coaches, update credentials and bios, and monitor athlete capacity.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setAddModalOpen(true)}>
          Add New Coach
        </Button>
      </div>

      {alertMsg.message && (
        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg({ type: '', message: '' })} />
      )}

      <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <FormInput
          id="trainerSearch"
          placeholder="Search coach by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading coaches from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTrainers} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Coaches Found"
          description="Try a different search keyword or onboard a new coach."
          icon={Award}
          actionText="Add New Coach"
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Coach Name</th>
                <th>Email / Phone</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Assigned Athletes</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{t.full_name}</strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.phone || '—'}</div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{t.specialization}</span>
                  </td>
                  <td>{t.experience_years} Years</td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{t.assigned_count || 0}</strong> Athletes
                  </td>
                  <td>
                    <Badge type="status" value={t.availability_status} />
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(t)}>
                      Edit Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Coach Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Onboard New Coaching Personnel">
        <form onSubmit={handleAddCoach}>
          <FormInput
            label="Coach Full Name"
            id="new_coach_name"
            placeholder="e.g. Rahul Sharma"
            value={newCoach.full_name}
            onChange={(e) => setNewCoach({ ...newCoach, full_name: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Email Address"
              id="new_coach_email"
              type="email"
              placeholder="rahul.coach@gymkhana.com"
              value={newCoach.email}
              onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
              required
            />
            <FormInput
              label="Contact Phone"
              id="new_coach_phone"
              type="tel"
              placeholder="+91 9876543210"
              value={newCoach.phone}
              onChange={(e) => setNewCoach({ ...newCoach, phone: e.target.value })}
            />
          </div>

          <FormInput
            label="Initial Password"
            id="new_coach_pwd"
            type="password"
            placeholder="Minimum 6 characters"
            value={newCoach.password}
            onChange={(e) => setNewCoach({ ...newCoach, password: e.target.value })}
            required
            helper="Coach will use this password to sign into the trainer portal"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <FormSelect
              label="Specialization"
              id="new_coach_spec"
              value={newCoach.specialization}
              onChange={(e) => setNewCoach({ ...newCoach, specialization: e.target.value })}
              options={SPECIALIZATION_OPTIONS}
              required
            />
            <FormInput
              label="Experience (Years)"
              id="new_coach_exp"
              type="number"
              min="0"
              max="40"
              value={newCoach.experience_years}
              onChange={(e) => setNewCoach({ ...newCoach, experience_years: parseInt(e.target.value, 10) || 0 })}
              required
            />
          </div>

          <FormInput
            label="Certifications (Optional)"
            id="new_coach_cert"
            placeholder="e.g. CSCS, ACE-CPT, ISSA"
            value={newCoach.certifications}
            onChange={(e) => setNewCoach({ ...newCoach, certifications: e.target.value })}
          />

          <FormTextarea
            label="Professional Biography"
            id="new_coach_bio"
            rows={3}
            placeholder="Training philosophy, background, and special focus areas..."
            value={newCoach.bio}
            onChange={(e) => setNewCoach({ ...newCoach, bio: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setAddModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} icon={UserPlus}>
              Create Coach Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Trainer Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Coach: ${editingTrainer?.full_name}`}>
        <form onSubmit={handleSave}>
          <FormInput
            label="Specialization"
            id="t_spec"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Experience (Years)"
              id="t_exp"
              type="number"
              min="0"
              max="50"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value, 10) || 0 })}
              required
            />

            <FormSelect
              label="Availability Status"
              id="t_avail"
              value={formData.availability_status}
              onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Unavailable', label: 'Unavailable' },
              ]}
              required
            />
          </div>

          <FormInput
            label="Certifications"
            id="t_cert"
            value={formData.certifications}
            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
          />

          <FormTextarea
            label="Biography"
            id="t_bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
