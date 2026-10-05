import React, { useState, useEffect } from 'react';
import { CalendarCheck, Filter, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function MemberAttendance() {
  useDocumentTitle('GYMKHANA | My Attendance', 'Track your facility check-in history and attendance logs.');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthFilter, setMonthFilter] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/members/attendance');
      if (res.success) {
        setRecords(res.data?.attendance || []);
      } else {
        setError(res.error?.message || 'Failed to fetch attendance logs');
      }
    } catch (err) {
      setError(err.message || 'Server error loading attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Filter records by month if selected
  const filteredRecords = records.filter((r) => {
    if (!monthFilter) return true;
    const date = new Date(r.date);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonth = `${date.getFullYear()}-${month}`;
    return yearMonth === monthFilter;
  });

  // Extract available months from records
  const availableMonths = Array.from(
    new Set(
      records.map((r) => {
        const d = new Date(r.date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>Attendance History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Historical record of your gym floor check-ins and session durations.
          </p>
        </div>

        {availableMonths.length > 0 && (
          <div style={{ minWidth: '200px' }}>
            <FormSelect
              id="monthFilter"
              placeholder="All Months"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              options={availableMonths.map((m) => {
                const [year, month] = m.split('-');
                const dateObj = new Date(year, month - 1);
                return {
                  value: m,
                  label: dateObj.toLocaleString('default', { month: 'long', year: 'numeric' }),
                };
              })}
            />
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Retrieving attendance records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAttendance} />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No Attendance Logs Found"
          description={monthFilter ? 'No check-in records for this month.' : 'You have not checked in to the gym yet.'}
          icon={CalendarCheck}
          actionText={monthFilter ? 'Show All Months' : undefined}
          onAction={() => setMonthFilter('')}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const dateObj = new Date(r.date);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {dateObj.toLocaleDateString()}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {dateObj.toLocaleDateString('default', { weekday: 'short' })}
                    </td>
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
                    <td>
                      <Badge type="status" value={r.status || 'Present'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
