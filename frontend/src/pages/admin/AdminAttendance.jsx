import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Search, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminAttendance() {
  useDocumentTitle('GYMKHANA | Attendance Management', 'Monitor gym attendance, record member check-in/out, and filter dates.');

  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Log attendance modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in_time: '07:00 AM',
    check_out_time: '08:30 AM',
    status: 'Present',
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attRes, memRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/admin/members'),
      ]);
      if (attRes.success) setRecords(attRes.data?.attendance || []);
      if (memRes.success) setMembers(memRes.data?.members || []);
    } catch (err) {
      setError(err.message || 'Error loading attendance logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!formData.member_id) return;
    setSaving(true);
    setAlertMsg({ type: '', message: '' });

    try {
      const res = await api.post('/attendance', formData);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Attendance record logged successfully!' });
        setIsModalOpen(false);
        await fetchData();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Failed to record attendance' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Server error' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.member_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !dateFilter || r.date.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Facility Attendance Logs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Daily check-in and check-out logs across all registered member accounts.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Record Manual Check-In
        </Button>
      </div>

      {alertMsg.message && (
        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg({ type: '', message: '' })} />
      )}

      {/* Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
        backgroundColor: 'var(--surface-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <FormInput
          id="searchAtt"
          placeholder="Search by member name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormInput
          id="dateFilter"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          placeholder="Filter by date..."
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Retrieving attendance database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Attendance Logs Found"
          description="Try changing the date filter or clearing your search term."
          icon={CalendarCheck}
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setDateFilter(''); }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member Name</th>
                <th>Email</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{r.member_name}</strong>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{r.email}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} style={{ color: 'var(--accent-primary)' }} />
                      {r.check_in_time || '07:00 AM'}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      {r.check_out_time || '08:30 AM'}
                    </span>
                  </td>
                  <td><Badge type="status" value={r.status || 'Present'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Check-in Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Facility Check-In">
        <form onSubmit={handleSaveAttendance}>
          <FormSelect
            label="Athlete / Member"
            id="att_member"
            value={formData.member_id}
            onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
            options={members.map((m) => ({ value: m.id, label: `${m.full_name} (${m.email})` }))}
            required
          />

          <FormInput
            label="Date of Attendance"
            id="att_date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Check-In Time"
              id="att_in"
              placeholder="e.g. 06:45 AM"
              value={formData.check_in_time}
              onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
            />

            <FormInput
              label="Check-Out Time"
              id="att_out"
              placeholder="e.g. 08:15 AM"
              value={formData.check_out_time}
              onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
            />
          </div>

          <FormSelect
            label="Session Status"
            id="att_status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Present', label: 'Present' },
              { value: 'Late', label: 'Late' },
              { value: 'Absent', label: 'Absent' },
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} disabled={!formData.member_id}>
              Save Attendance Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
