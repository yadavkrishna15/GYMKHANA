import React, { useState } from 'react';
import { User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberProfile() {
  const { user, refreshUser } = useAuth();
  useDocumentTitle('GYMKHANA | My Profile', 'Manage personal athlete details and password.');

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setErrorMsg('New password must be at least 6 characters');
        setLoading(false);
        return;
      }
      if (formData.new_password !== formData.confirm_new_password) {
        setErrorMsg('New passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.put('/users/profile', {
        full_name: formData.full_name,
        phone: formData.phone,
        current_password: formData.current_password || undefined,
        new_password: formData.new_password || undefined,
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setFormData((prev) => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_new_password: '',
        }));
        await refreshUser();
      } else {
        setErrorMsg(res.error?.message || 'Update failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Personal Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Update your contact phone, name, and security credentials.
        </p>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleUpdateProfile}>
          <FormInput
            label="Email Address"
            id="email"
            value={user?.email || ''}
            disabled
            helper="Account login email (governed by administration)"
          />

          <FormInput
            label="Full Name"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Change Password (Optional)
            </h4>

            <FormInput
              label="Current Password"
              id="current_password"
              name="current_password"
              type="password"
              value={formData.current_password}
              onChange={handleChange}
              placeholder="Leave blank to keep existing password"
            />

            <FormInput
              label="New Password"
              id="new_password"
              name="new_password"
              type="password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />

            <FormInput
              label="Confirm New Password"
              id="confirm_new_password"
              name="confirm_new_password"
              type="password"
              value={formData.confirm_new_password}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '1rem' }}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
