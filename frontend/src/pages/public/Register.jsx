import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { FormInput } from '../../components/ui/FormControls';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Register() {
  useDocumentTitle('GYMKHANA | Member Registration', 'Create a new athlete or gym member account at GYMKHANA.');

  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) {
      errs.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 3) {
      errs.full_name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (formData.phone && !/^[0-9+\s-]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid phone number (7-15 digits)';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirm_password) {
      errs.confirm_password = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
      });
      navigate('/member', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            New Member Enrollment
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Join the GYMKHANA athletic community to access custom plans and facility privileges.
          </p>
        </div>

        {serverError && (
          <Alert type="error" message={serverError} onClose={() => setServerError('')} />
        )}

        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Full Legal Name"
              id="full_name"
              name="full_name"
              placeholder="e.g. Arjun Patel"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
              required
            />

            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="arjun@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <FormInput
              label="Contact Phone"
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210 (Optional)"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helper="Used for attendance updates and emergency notifications"
            />

            <FormInput
              label="Account Password"
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <FormInput
              label="Confirm Password"
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              icon={UserPlus}
              loading={loading}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              Complete Registration
            </Button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}>
            Already have an active membership account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
