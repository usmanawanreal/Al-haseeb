import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getInquiries, updateInquiry } from '../../services/api';

const STATUSES = ['Unread', 'Read', 'Resolved'];

function badgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'unread') return 'admin-badge--pending';
  if (s === 'read') return 'admin-badge--confirmed';
  if (s === 'resolved') return 'admin-badge--completed';
  return 'admin-badge--pending';
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export default function InquiriesManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const refreshFromServer = useCallback(async ({ showFullLoading = false } = {}) => {
    if (showFullLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);
    try {
      const { data } = await getInquiries();
      setRows(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date());
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load inquiries');
    } finally {
      if (showFullLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    refreshFromServer({ showFullLoading: true });
  }, [refreshFromServer]);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    setError(null);
    try {
      await updateInquiry(id, { status });
      await refreshFromServer();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="admin-page-title">Inquiries</h1>
            <p className="admin-page-desc">
              Contact form messages from the website. Update status to Read or Resolved after follow-up.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--primary admin-btn--small"
              disabled={loading || refreshing}
              onClick={() => refreshFromServer({ showFullLoading: true })}
              title="Reload inquiries from server"
            >
              <RefreshCw size={16} aria-hidden style={{ verticalAlign: 'middle' }} />{' '}
              {refreshing && !loading ? 'Refreshing…' : 'Refresh'}
            </button>
            {lastSyncedAt && (
              <span className="admin-muted" style={{ fontSize: '0.8rem' }}>
                Last synced: {lastSyncedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </header>

      {refreshing && !loading && (
        <p className="admin-muted" style={{ marginBottom: '0.75rem' }}>
          Updating list…
        </p>
      )}

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-muted" style={{ padding: '1.25rem' }}>
            Loading…
          </p>
        ) : rows.length === 0 ? (
          <p className="admin-muted" style={{ padding: '1.25rem' }}>
            No inquiries yet.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id}>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.email || '—'}</td>
                    <td style={{ maxWidth: 280 }}>{row.message}</td>
                    <td>{formatDate(row.createdAt)}</td>
                    <td>
                      <select
                        value={STATUSES.includes(row.status) ? row.status : 'Unread'}
                        disabled={busyId === row._id || refreshing}
                        onChange={(ev) => handleStatus(row._id, ev.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border, #e2e8f0)',
                        }}
                        aria-label={`Change status for ${row.name}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className={`admin-badge ${badgeClass(row.status)}`}>{row.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
