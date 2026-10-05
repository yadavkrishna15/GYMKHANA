import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Calendar, FileText, Scale } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormInput, FormTextarea } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberProgress() {
  useDocumentTitle('GYMKHANA | My Progress', 'Track longitudinal body weight, height, BMI, and trainer notes.');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add record modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    measured_on: new Date().toISOString().split('T')[0],
    weight_kg: '',
    height_cm: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/members/progress');
      if (res.success) {
        setRecords(res.data?.progress || []);
      } else {
        setError(res.error?.message || 'Could not load biometric logs');
      }
    } catch (err) {
      setError(err.message || 'Server error loading progress logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const computedBmi = () => {
    const w = parseFloat(formData.weight_kg);
    const h = parseFloat(formData.height_cm) / 100;
    if (w > 0 && h > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '';
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setFormError('');

    const w = parseFloat(formData.weight_kg);
    const h = parseFloat(formData.height_cm);

    if (!formData.measured_on) {
      setFormError('Measurement date is required');
      return;
    }
    if (!w || w <= 20 || w >= 350) {
      setFormError('Please enter a realistic weight in kg (20 - 350)');
      return;
    }
    if (!h || h <= 80 || h >= 250) {
      setFormError('Please enter a realistic height in cm (80 - 250)');
      return;
    }

    setSubmitting(true);
    try {
      const bmi = parseFloat(computedBmi());
      const res = await api.post('/members/progress', {
        measured_on: formData.measured_on,
        weight_kg: w,
        height_cm: h,
        bmi,
        notes: formData.notes.trim() || null,
      });

      if (res.success) {
        setIsModalOpen(false);
        setFormData({
          measured_on: new Date().toISOString().split('T')[0],
          weight_kg: '',
          height_cm: '',
          notes: '',
        });
        await fetchProgress();
      } else {
        setFormError(res.error?.message || 'Failed to record entry');
      }
    } catch (err) {
      setFormError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Biometric Progress History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Longitudinal log of your weight changes, computed BMI scores, and clinical coaching notes.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Log New Measurement
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Retrieving progress history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProgress} />
      ) : records.length === 0 ? (
        <EmptyState
          title="No Measurement Records Logged"
          description="Log your first weight and height reading to begin tracking your biometric adaptation."
          icon={TrendingUp}
          actionText="Log Measurement Now"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Measured Date</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Body Mass Index (BMI)</th>
                <th>Coaching Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const bmiNum = parseFloat(r.bmi);
                let bmiCategory = '';
                let bmiColor = 'var(--text-primary)';
                if (bmiNum < 18.5) {
                  bmiCategory = 'Underweight';
                  bmiColor = 'var(--color-warning)';
                } else if (bmiNum < 25) {
                  bmiCategory = 'Normal';
                  bmiColor = 'var(--color-success)';
                } else if (bmiNum < 30) {
                  bmiCategory = 'Overweight';
                  bmiColor = 'var(--color-warning)';
                } else {
                  bmiCategory = 'Obese';
                  bmiColor = 'var(--color-error)';
                }

                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {new Date(r.measured_on).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {r.weight_kg} kg
                    </td>
                    <td>{r.height_cm ? `${r.height_cm} cm` : '—'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: bmiColor }}>
                        {r.bmi || '—'}
                      </span>{' '}
                      {r.bmi && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({bmiCategory})
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {r.notes || 'Routine check-in'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Measurement Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Biometric Measurement">
        {formError && <Alert type="error" message={formError} onClose={() => setFormError('')} />}

        <form onSubmit={handleAddRecord}>
          <FormInput
            label="Measurement Date"
            id="measured_on"
            name="measured_on"
            type="date"
            value={formData.measured_on}
            onChange={(e) => setFormData({ ...formData, measured_on: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Weight (kg)"
              id="weight_kg"
              name="weight_kg"
              type="number"
              step="0.1"
              placeholder="e.g. 74.5"
              value={formData.weight_kg}
              onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
              required
            />

            <FormInput
              label="Height (cm)"
              id="height_cm"
              name="height_cm"
              type="number"
              step="0.5"
              placeholder="e.g. 176"
              value={formData.height_cm}
              onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
              required
            />
          </div>

          {computedBmi() && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#12151B',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Computed BMI:</span>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{computedBmi()}</strong>
            </div>
          )}

          <FormTextarea
            label="Observation Notes"
            id="notes"
            name="notes"
            rows={3}
            placeholder="e.g. Morning fasted weigh-in, feeling energized"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
