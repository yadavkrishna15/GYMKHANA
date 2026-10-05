import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { FormInput } from '../../components/ui/FormControls';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle('GYMKHANA | Member Login', 'Access your GYMKHANA member, trainer, or administrative dashboard.');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
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
      const user = await login(formData.email, formData.password);
      // Route based on role
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'TRAINER') {
        navigate('/trainer', { replace: true });
      } else {
        navigate('/member', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setFormData({ email, password });
    setErrors({});
    setServerError('');
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Portal Authentication
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Sign In to GYMKHANA
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Enter your credentials to enter your management dashboard.
          </p>
        </div>

        {serverError && (
          <Alert type="error" message={serverError} onClose={() => setServerError('')} />
        )}

        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="e.g. member@gymkhana.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              icon={LogIn}
              loading={loading}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              Authenticate &amp; Enter
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
            Do not have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Register Here
            </Link>
          </div>
        </Card>

        {/* Viva Quick Test Credentials Panel */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          backgroundColor: '#12151B',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Viva Demo Credentials (Quick Autofill)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fillDemo('admin@gymkhana.com', 'Admin@123')}
            >
              Admin
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fillDemo('trainer@gymkhana.com', 'Trainer@123')}
            >
              Trainer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fillDemo('member1@gymkhana.com', 'Member@123')}
            >
              Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
