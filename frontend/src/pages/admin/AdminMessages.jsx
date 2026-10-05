import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, MailOpen, Trash2, Phone, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import Alert from '../../components/ui/Alert';
import { ConfirmDialog } from '../../components/ui/Modal';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function AdminMessages() {
  useDocumentTitle('GYMKHANA | Inquiry Desk Admin', 'Review member feedback and public inquiries.');

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/contact');
      if (res.success) {
        setMessages(res.data?.messages || []);
      } else {
        setError(res.error?.message || 'Failed to load inquiries');
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    try {
      const newStatus = !msg.is_read;
      const res = await api.put(`/contact/${msg.id}`, { is_read: newStatus });
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const promptDelete = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/contact/${deletingId}`);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Inquiry deleted successfully.' });
        setDeleteConfirmOpen(false);
        await fetchMessages();
      } else {
        setAlertMsg({ type: 'error', message: res.error?.message || 'Delete failed' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Error deleting message' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'unread' && !m.is_read) ||
      (statusFilter === 'read' && m.is_read);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Public Inquiries &amp; Member Feedback</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Direct messages received through the public contact form and member feedback desk.
          </p>
        </div>
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
          id="searchMsg"
          placeholder="Search by sender, email, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormSelect
          id="filterRead"
          placeholder="All Inquiries"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'unread', label: 'Unread Only' },
            { value: 'read', label: 'Read Inquiries' },
          ]}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Retrieving messages from MySQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMessages} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Inquiries Found"
          description="There are no contact messages matching your query."
          icon={MessageSquare}
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setStatusFilter(''); }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((msg) => (
            <Card
              key={msg.id}
              style={{
                borderColor: msg.is_read ? 'var(--border-subtle)' : 'var(--accent-primary-border)',
                backgroundColor: msg.is_read ? 'var(--surface-card)' : 'rgba(198, 241, 53, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{msg.subject}</h3>
                    {!msg.is_read && (
                      <span style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem', backgroundColor: 'var(--accent-primary)', color: 'var(--accent-contrast)', borderRadius: 'var(--radius-full)', fontWeight: 800, textTransform: 'uppercase' }}>
                        New
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span><strong>From:</strong> {msg.name} ({msg.email})</span>
                    {msg.phone && <span><strong>Phone:</strong> {msg.phone}</span>}
                    <span><strong>Received:</strong> {new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={msg.is_read ? Mail : MailOpen}
                    onClick={() => handleToggleRead(msg)}
                  >
                    {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => promptDelete(msg.id)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#12151B',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.message}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Contact Inquiry"
        message="Are you sure you want to permanently delete this message record?"
        loading={deleting}
      />
    </div>
  );
}
