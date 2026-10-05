import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput, FormTextarea } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberFeedback() {
  const { user } = useAuth();
  useDocumentTitle('GYMKHANA | Member Feedback', 'Submit feedback directly to facility administrators and coaching coordinators.');

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg('Please provide both a subject and message content.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/contact', {
        name: user.full_name,
        email: user.email,
        phone: user.phone || null,
        subject: `[Member Feedback] ${formData.subject.trim()}`,
        message: formData.message.trim(),
      });

      if (res.success) {
        setSuccessMsg('Your feedback has been delivered directly to the administration desk!');
        setFormData({ subject: '', message: '' });
      } else {
        setErrorMsg(res.error?.message || 'Failed to transmit feedback');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error transmitting message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Member Feedback Desk</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Have a request regarding equipment maintenance, schedule changes, or facility amenities? Send direct notes to our administrative supervisors.
        </p>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Sender"
            id="sender"
            value={`${user?.full_name} (${user?.email})`}
            disabled
          />

          <FormInput
            label="Subject"
            id="subject"
            name="subject"
            placeholder="e.g. Request for additional barbell collars / floor suggestion"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />

          <FormTextarea
            label="Your Message"
            id="message"
            name="message"
            rows={5}
            placeholder="Type your suggestion or question here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />

          <Button type="submit" variant="primary" icon={Send} loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Submit to Administration
          </Button>
        </form>
      </Card>
    </div>
  );
}
