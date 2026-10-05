import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { FormInput, FormTextarea } from '../../components/ui/FormControls';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Contact() {
  useDocumentTitle(
    'GYMKHANA | Contact Us',
    'Get in touch with the GYMKHANA fitness management team for membership inquiries, facility visits, and technical support.'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (formData.phone && !/^[0-9+\s-]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid phone number (digits, +, -)';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject line is required';
    if (!formData.message.trim()) {
      errs.message = 'Message content is required';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must contain at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/contact', formData);
      if (response.success) {
        setSuccessMsg('Your message has been logged successfully! Our team will respond shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setServerError(response.error?.message || 'Failed to submit message.');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Contact &amp; Inquiries
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have questions about facility memberships, trainer consultation, or this field project demonstration? Send us a message directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Contact Details */}
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Facility Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <Card style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-dim)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Physical Location</h4>
                  <p style={{ fontSize: '0.875rem' }}>
                    GYMKHANA Athletic Complex, Sector 4 University Zone, Main Campus
                  </p>
                </div>
              </Card>

              <Card style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-info-bg)',
                  color: 'var(--color-info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Telephone</h4>
                  <p style={{ fontSize: '0.875rem' }}>
                    <a href="tel:+919876543210" style={{ color: 'var(--text-secondary)' }}>
                      +91 98765 43210
                    </a>
                  </p>
                  <small style={{ color: 'var(--text-muted)' }}>Monday – Saturday: 6:00 AM – 10:00 PM</small>
                </div>
              </Card>

              <Card style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Direct Email</h4>
                  <p style={{ fontSize: '0.875rem' }}>
                    <a href="mailto:support@gymkhana.local" style={{ color: 'var(--text-secondary)' }}>
                      support@gymkhana.local
                    </a>
                  </p>
                  <small style={{ color: 'var(--text-muted)' }}>Response time: within 24 hours</small>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Send a Direct Message</h2>

              {successMsg && (
                <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
              )}
              {serverError && (
                <Alert type="error" message={serverError} onClose={() => setServerError('')} />
              )}

              <form onSubmit={handleSubmit} noValidate>
                <FormInput
                  label="Full Name"
                  id="name"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <FormInput
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <FormInput
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210 (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  helper="Optional for SMS notification"
                />

                <FormInput
                  label="Subject"
                  id="subject"
                  name="subject"
                  placeholder="Inquiry regarding membership or trainer"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  required
                />

                <FormTextarea
                  label="Message Content"
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Write your detailed question or feedback here..."
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  loading={loading}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Transmit Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
