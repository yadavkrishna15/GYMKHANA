import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Dumbbell, TrendingUp, CalendarCheck, Plus, CheckCircle, Search } from 'lucide-react';
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

export default function TrainerMembers() {
  useDocumentTitle('GYMKHANA | Athlete Roster', 'Manage assigned member training splits, log biometric progress, and track attendance.');

  const [searchParams] = useSearchParams();
  const initialMemberId = searchParams.get('id');

  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Assign Plan Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Add Progress Modal
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressForm, setProgressForm] = useState({
    measured_on: new Date().toISOString().split('T')[0],
    weight_kg: '',
    height_cm: '',
    notes: '',
  });
  const [progressLoading, setProgressLoading] = useState(false);
  const [actionAlert, setActionAlert] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersRes, plansRes] = await Promise.all([
        api.get('/trainers/members'),
        api.get('/workouts'),
      ]);

      if (membersRes.success) {
        setMembers(membersRes.data?.members || []);
        if (initialMemberId) {
          const match = (membersRes.data?.members || []).find((m) => String(m.id) === String(initialMemberId));
          if (match) loadMemberDetails(match);
        }
      }
      if (plansRes.success) {
        setPlans(plansRes.data?.plans || []);
      }
    } catch (err) {
      setError(err.message || 'Error fetching coaching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMemberDetails = async (member) => {
    setSelectedMember(member);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/trainers/members/${member.id}`);
      if (res.success) {
        setMemberDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedPlanId || !selectedMember) return;
    setAssignLoading(true);
    setActionAlert({ type: '', message: '' });
    try {
      const res = await api.post(`/trainers/members/${selectedMember.id}/assign-plan`, {
        plan_id: selectedPlanId,
      });
      if (res.success) {
        setActionAlert({ type: 'success', message: 'Workout plan assigned successfully!' });
        setAssignModalOpen(false);
        loadMemberDetails(selectedMember);
      } else {
        setActionAlert({ type: 'error', message: res.error?.message || 'Plan assignment failed' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to assign plan' });
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setProgressLoading(true);
    setActionAlert({ type: '', message: '' });

    const w = parseFloat(progressForm.weight_kg);
    const h = parseFloat(progressForm.height_cm);
    const bmi = w && h ? parseFloat((w / ((h / 100) * (h / 100))).toFixed(1)) : null;

    try {
      const res = await api.post(`/trainers/members/${selectedMember.id}/progress`, {
        measured_on: progressForm.measured_on,
        weight_kg: w,
        height_cm: h,
        bmi,
        notes: progressForm.notes.trim() || null,
      });
      if (res.success) {
        setActionAlert({ type: 'success', message: 'Biometric measurement recorded successfully!' });
        setProgressModalOpen(false);
        setProgressForm({
          measured_on: new Date().toISOString().split('T')[0],
          weight_kg: '',
          height_cm: '',
          notes: '',
        });
        loadMemberDetails(selectedMember);
      } else {
        setActionAlert({ type: 'error', message: res.error?.message || 'Error recording progress' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to log progress' });
    } finally {
      setProgressLoading(false);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Assigned Athletes Roster</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Inspect individual athlete workout assignments, log biometric measurement check-ins, and review attendance.
        </p>
      </div>

      {actionAlert.message && (
        <Alert type={actionAlert.type} message={actionAlert.message} onClose={() => setActionAlert({ type: '', message: '' })} />
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading athlete assignments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedMember ? '340px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Member List Panel */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <FormInput
                id="searchAthlete"
                placeholder="Search athlete by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredMembers.length === 0 ? (
              <EmptyState
                title="No Athletes Found"
                description={search ? 'No athletes match your search.' : 'You currently have zero assigned athletes.'}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredMembers.map((m) => {
                  const isSelected = selectedMember?.id === m.id;
                  return (
                    <Card
                      key={m.id}
                      interactive
                      onClick={() => loadMemberDetails(m)}
                      style={{
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {m.full_name}
                        </h4>
                        <Badge type="status" value={m.status || 'Active'} />
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {m.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Plan: <strong>{m.plan_name || 'Standard Conditioning'}</strong>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Member Detailed Inspection Panel */}
          {selectedMember && (
            <Card style={{ padding: '2rem' }}>
              {detailsLoading ? (
                <LoadingSpinner size="md" label="Loading athlete dossier..." />
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Athlete Profile #{selectedMember.id}
                      </span>
                      <h2 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>{selectedMember.full_name}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {selectedMember.email} &bull; {selectedMember.phone || 'No phone'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Button variant="secondary" size="sm" icon={Dumbbell} onClick={() => setAssignModalOpen(true)}>
                        Assign Plan
                      </Button>
                      <Button variant="primary" size="sm" icon={Plus} onClick={() => setProgressModalOpen(true)}>
                        Record Progress
                      </Button>
                    </div>
                  </div>

                  {/* Current Plan Overview */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Dumbbell size={18} style={{ color: 'var(--accent-primary)' }} />
                      Prescribed Training Plan
                    </h3>
                    {memberDetails?.workoutPlan ? (
                      <div style={{ padding: '1rem 1.25rem', backgroundColor: '#12151B', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{memberDetails.workoutPlan.name}</strong>
                          <Badge type="difficulty" value={memberDetails.workoutPlan.difficulty} />
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Goal: {memberDetails.workoutPlan.goal} &bull; {memberDetails.workoutPlan.duration_weeks} Weeks
                        </p>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        No specific routine assigned. Use "Assign Plan" above.
                      </p>
                    )}
                  </div>

                  {/* Biometric Progress Table */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
                      Biometric Progress Log
                    </h3>
                    {memberDetails?.progress?.length > 0 ? (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Weight</th>
                              <th>Height</th>
                              <th>BMI</th>
                              <th>Coach Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberDetails.progress.map((p) => (
                              <tr key={p.id}>
                                <td>{new Date(p.measured_on).toLocaleDateString()}</td>
                                <td style={{ fontWeight: 600 }}>{p.weight_kg} kg</td>
                                <td>{p.height_cm ? `${p.height_cm} cm` : '—'}</td>
                                <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{p.bmi || '—'}</td>
                                <td>{p.notes || 'Routine check-in'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No progress records recorded for this member yet.</p>
                    )}
                  </div>

                  {/* Attendance Log */}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarCheck size={18} style={{ color: 'var(--color-info)' }} />
                      Recent Attendance Records
                    </h3>
                    {memberDetails?.attendance?.length > 0 ? (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Check-In</th>
                              <th>Check-Out</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberDetails.attendance.slice(0, 5).map((a) => (
                              <tr key={a.id}>
                                <td>{new Date(a.date).toLocaleDateString()}</td>
                                <td>{a.check_in_time || '07:00 AM'}</td>
                                <td>{a.check_out_time || '08:30 AM'}</td>
                                <td><Badge type="status" value={a.status || 'Present'} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent attendance logs.</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Assign Plan Modal */}
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title={`Assign Plan to ${selectedMember?.full_name}`}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
          Select a structured workout plan from the catalog to assign to this member's profile:
        </p>

        <FormSelect
          label="Workout Plan"
          id="assignPlan"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          options={plans.map((p) => ({ value: p.id, label: `${p.name} (${p.goal} - ${p.duration_weeks}w)` }))}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={() => setAssignModalOpen(false)} disabled={assignLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignPlan} loading={assignLoading} disabled={!selectedPlanId}>
            Assign Program
          </Button>
        </div>
      </Modal>

      {/* Record Progress Modal */}
      <Modal isOpen={progressModalOpen} onClose={() => setProgressModalOpen(false)} title={`Record Biometrics for ${selectedMember?.full_name}`}>
        <form onSubmit={handleAddProgress}>
          <FormInput
            label="Measurement Date"
            id="p_date"
            type="date"
            value={progressForm.measured_on}
            onChange={(e) => setProgressForm({ ...progressForm, measured_on: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Weight (kg)"
              id="p_weight"
              type="number"
              step="0.1"
              placeholder="75.0"
              value={progressForm.weight_kg}
              onChange={(e) => setProgressForm({ ...progressForm, weight_kg: e.target.value })}
              required
            />
            <FormInput
              label="Height (cm)"
              id="p_height"
              type="number"
              step="0.5"
              placeholder="175"
              value={progressForm.height_cm}
              onChange={(e) => setProgressForm({ ...progressForm, height_cm: e.target.value })}
              required
            />
          </div>

          <FormTextarea
            label="Coach Evaluation Notes"
            id="p_notes"
            rows={3}
            placeholder="Athlete shows improved hamstring mobility and squat depth."
            value={progressForm.notes}
            onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setProgressModalOpen(false)} disabled={progressLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={progressLoading}>
              Save Measurement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
