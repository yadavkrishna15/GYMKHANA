import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Award, UserCheck, ShieldCheck } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormControls';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const SPECIALIZATIONS = [
  { value: 'Strength & Conditioning', label: 'Strength & Conditioning' },
  { value: 'CrossFit & Functional Training', label: 'CrossFit & Functional Training' },
  { value: 'Bodybuilding & Hypertrophy', label: 'Bodybuilding & Hypertrophy' },
  { value: 'Yoga & Functional Mobility', label: 'Yoga & Functional Mobility' },
  { value: 'Weight Loss & Nutrition Coaching', label: 'Weight Loss & Nutrition Coaching' },
  { value: 'Athletic Performance & Speed', label: 'Athletic Performance & Speed' },
];

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('MEMBER'); // 'MEMBER' | 'TRAINER'

  useDocumentTitle(
    selectedRole === 'TRAINER' ? 'GYMKHANA | Coach Registration' : 'GYMKHANA | Member Registration',
    'Join GYMKHANA athletic community as an athlete or certified fitness coach.'
  );

  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    // Trainer-specific
    specialization: 'Strength & Conditioning',
    experience_years: '3',
    bio: '',
    certifications: '',
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

    if (selectedRole === 'TRAINER') {
      if (!formData.specialization) {
        errs.specialization = 'Please select your coaching specialization';
      }
      if (!formData.experience_years || parseInt(formData.experience_years, 10) < 0) {
        errs.experience_years = 'Enter valid years of experience';
      }
      if (formData.bio.trim() && formData.bio.trim().length < 10) {
        errs.bio = 'Bio should be at least 10 characters';
      }
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
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        role: selectedRole,
      };

      if (selectedRole === 'TRAINER') {
        payload.specialization = formData.specialization;
        payload.experience_years = parseInt(formData.experience_years, 10) || 1;
        payload.bio = formData.bio.trim() || `Certified ${formData.specialization} Coach at GYMKHANA.`;
        payload.certifications = formData.certifications.trim() || null;
      }

      const user = await register(payload);

      if (user?.role === 'TRAINER' || selectedRole === 'TRAINER') {
        navigate('/trainer', { replace: true });
      } else {
        navigate('/member', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: selectedRole === 'TRAINER' ? '580px' : '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {selectedRole === 'TRAINER' ? 'Floor Staff & Coaching Onboarding' : 'New Member Enrollment'}
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {selectedRole === 'TRAINER' ? 'Join As A Fitness Coach' : 'Create Your Account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            {selectedRole === 'TRAINER'
              ? 'Register as a professional coach to manage athletes, design workout splits, and track performance.'
              : 'Join the GYMKHANA athletic community to access custom plans and facility privileges.'}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            padding: '0.375rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedRole('MEMBER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9375rem',
              transition: 'all var(--transition-fast)',
              background: selectedRole === 'MEMBER' ? 'var(--accent-primary)' : 'transparent',
              color: selectedRole === 'MEMBER' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <UserPlus size={18} />
            <span>Member / Athlete</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('TRAINER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9375rem',
              transition: 'all var(--transition-fast)',
              background: selectedRole === 'TRAINER' ? 'var(--accent-primary)' : 'transparent',
              color: selectedRole === 'TRAINER' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Award size={18} />
            <span>Coach / Trainer</span>
          </button>
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
              placeholder={selectedRole === 'TRAINER' ? 'e.g. Vikram Singh' : 'e.g. Arjun Patel'}
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
              placeholder={selectedRole === 'TRAINER' ? 'coach@gymkhana.com' : 'arjun@example.com'}
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
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helper={
                selectedRole === 'TRAINER'
                  ? 'Used by gym administration for scheduling and roster alerts'
                  : 'Used for attendance updates and emergency notifications'
              }
            />

            {/* Trainer-Specific Fields */}
            {selectedRole === 'TRAINER' && (
              <div
                style={{
                  background: 'var(--bg-subtle, rgba(255,255,255,0.02))',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <Award size={16} /> Coaching Credentials & Specialization
                </div>

                <FormSelect
                  label="Primary Specialization"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  options={SPECIALIZATIONS}
                  error={errors.specialization}
                  required
                />

                <FormInput
                  label="Years of Experience"
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  max="40"
                  value={formData.experience_years}
                  onChange={handleChange}
                  error={errors.experience_years}
                  required
                />

                <FormInput
                  label="Certifications (Optional)"
                  id="certifications"
                  name="certifications"
                  placeholder="e.g. CSCS, ACE, ISSA, CrossFit-L2"
                  value={formData.certifications}
                  onChange={handleChange}
                  helper="Comma-separated credentials recognized in athletics"
                />

                <FormTextarea
                  label="Short Coaching Bio"
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Summarize your training philosophy and athletic background..."
                  value={formData.bio}
                  onChange={handleChange}
                  error={errors.bio}
                  helper="Will be showcased on the public gym coaches roster"
                />
              </div>
            )}

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
              icon={selectedRole === 'TRAINER' ? Award : UserPlus}
              loading={loading}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {selectedRole === 'TRAINER' ? 'Register As Coach' : 'Complete Registration'}
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}
          >
            Already have an active account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
