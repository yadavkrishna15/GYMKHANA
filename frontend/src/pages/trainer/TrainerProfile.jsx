import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput, FormTextarea, FormSelect } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function TrainerProfile() {
  useDocumentTitle('GYMKHANA | Coach Profile', 'Edit professional certifications, bio, and floor availability.');

  const [formData, setFormData] = useState({
    specialization: '',
    experience_years: 3,
    bio: '',
    certifications: '',
    availability_status: 'Available',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trainers/profile');
      if (res.success && res.data?.trainer) {
        const t = res.data.trainer;
        setFormData({
          specialization: t.specialization || '',
          experience_years: t.experience_years || 1,
          bio: t.bio || '',
          certifications: t.certifications || '',
          availability_status: t.availability_status || 'Available',
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error loading trainer profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/trainers/profile', formData);
      if (res.success) {
        setSuccessMsg('Coach profile updated successfully!');
      } else {
        setErrorMsg(res.error?.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" label="Loading coach profile..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Coach Profile &amp; Bio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          This information is displayed publicly on the Trainers directory and helps members understand your expertise.
        </p>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Coaching Specialization"
            id="specialization"
            name="specialization"
            placeholder="e.g. Strength & Conditioning, Hypertrophy, Mobility"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Years of Experience"
              id="experience_years"
              name="experience_years"
              type="number"
              min="0"
              max="50"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
              required
            />

            <FormSelect
              label="Floor Availability"
              id="availability_status"
              name="availability_status"
              value={formData.availability_status}
              onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
              options={[
                { value: 'Available', label: 'Available (Accepting Clients)' },
                { value: 'Unavailable', label: 'Unavailable / Capacity Full' },
              ]}
              required
            />
          </div>

          <FormInput
            label="Professional Certifications"
            id="certifications"
            name="certifications"
            placeholder="e.g. CSCS, ACSM-CPT, NASM, Precision Nutrition"
            value={formData.certifications}
            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            helper="Comma separated credential titles"
          />

          <FormTextarea
            label="Coach Biography"
            id="bio"
            name="bio"
            rows={4}
            placeholder="Write a disciplined overview of your athletic background and training philosophy..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
          />

          <Button type="submit" variant="primary" loading={saving} style={{ width: '100%', marginTop: '0.75rem' }}>
            Save Coach Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
