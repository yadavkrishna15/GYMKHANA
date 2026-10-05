import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, UserX, UserCheck, Shield, Plus, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminMembers() {
  useDocumentTitle('GYMKHANA | Member Management', 'Administer gym member accounts, membership tiers, and floor trainer assignments.');

  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Edit / Change membership modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    membership_id: '',
    trainer_id: '',
    status: 'ACTIVE',
  });
  const [saving, setSaving] = useState(false);

  // Status toggle confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetMember, setTargetMember] = useState(null);
  const [actionAlert, setActionAlert] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, memRes, tRes] = await Promise.all([
        api.get('/admin/members'),
        api.get('/memberships'),
        api.get('/trainers'),
      ]);

      if (mRes.success) setMembers(mRes.data?.members || []);
      if (memRes.success) setMemberships(memRes.data?.memberships || []);
      if (tRes.success) setTrainers(tRes.data?.trainers || []);
    } catch (err) {
      setError(err.message || 'Error fetching member directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({
      membership_id: member.membership_id || '',
      trainer_id: member.trainer_id || '',
      status: member.status || 'ACTIVE',
    });
    setEditModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setSaving(true);
    setActionAlert({ type: '', message: '' });

    try {
      const res = await api.put(`/admin/members/${editingMember.id}`, editForm);
      if (res.success) {
        setActionAlert({ type: 'success', message: `Member ${editingMember.full_name} updated successfully!` });
        setEditModalOpen(false);
        await fetchData();
      } else {
        setActionAlert({ type: 'error', message: res.error?.message || 'Update failed' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Error updating member' });
    } finally {
      setSaving(false);
    }
  };

  const promptStatusToggle = (member) => {
    setTargetMember(member);
    setConfirmOpen(true);
  };

  const handleConfirmStatusToggle = async () => {
    if (!targetMember) return;
    setSaving(true);
    const newStatus = targetMember.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await api.put(`/admin/members/${targetMember.id}`, { status: newStatus });
      if (res.success) {
        setActionAlert({ type: 'success', message: `Member status updated to ${newStatus}` });
        setConfirmOpen(false);
        await fetchData();
      } else {
        setActionAlert({ type: 'error', message: res.error?.message || 'Status change failed' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Error changing status' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Member Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Inspect all registered gym athletes, assign membership plans, and assign floor trainers.
          </p>
        </div>
      </div>

      {actionAlert.message && (
        <Alert type={actionAlert.type} message={actionAlert.message} onClose={() => setActionAlert({ type: '', message: '' })} />
      )}

      {/* Filter Toolbar */}
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
          id="memberSearch"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormSelect
          id="statusFilter"
          placeholder="All Member Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
          ]}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading member roster from MySQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Members Found"
          description="Adjust your search query or reset the status filter."
          icon={Users}
          actionText="Reset Filters"
          onAction={() => { setSearch(''); setStatusFilter(''); }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email / Phone</th>
                <th>Active Plan</th>
                <th>Assigned Coach</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{m.full_name}</strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.phone || 'No phone'}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: m.membership_name ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {m.membership_name || 'No Plan'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.875rem', color: m.trainer_name ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {m.trainer_name || 'Unassigned'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {m.join_date ? new Date(m.join_date).toLocaleDateString() : 'Active'}
                    </span>
                  </td>
                  <td>
                    <Badge type="status" value={m.status || 'ACTIVE'} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(m)}>
                        Edit
                      </Button>
                      <Button
                        variant={m.status === 'ACTIVE' ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => promptStatusToggle(m)}
                      >
                        {m.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Member Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Member: ${editingMember?.full_name}`}>
        <form onSubmit={handleSaveMember}>
          <FormSelect
            label="Membership Plan"
            id="m_plan"
            value={editForm.membership_id}
            onChange={(e) => setEditForm({ ...editForm, membership_id: e.target.value })}
            placeholder="Select Membership Plan (or leave unassigned)"
            options={memberships.map((p) => ({ value: p.id, label: `${p.name} (₹${p.price} - ${p.duration_months}m)` }))}
          />

          <FormSelect
            label="Assigned Floor Trainer"
            id="m_trainer"
            value={editForm.trainer_id}
            onChange={(e) => setEditForm({ ...editForm, trainer_id: e.target.value })}
            placeholder="Select Floor Trainer (or unassigned)"
            options={trainers.map((t) => ({ value: t.id, label: `${t.full_name} (${t.specialization})` }))}
          />

          <FormSelect
            label="Account Status"
            id="m_status"
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
            ]}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Updates
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmStatusToggle}
        title={`${targetMember?.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'} Member Account`}
        message={`Are you sure you want to change ${targetMember?.full_name}'s status to ${targetMember?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}?`}
        confirmText={targetMember?.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
        variant={targetMember?.status === 'ACTIVE' ? 'danger' : 'primary'}
        loading={saving}
      />
    </div>
  );
}
