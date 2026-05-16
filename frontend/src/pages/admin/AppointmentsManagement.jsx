import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from '../../services/api';

/** Matches backend `validStatuses` in appointmentController */
const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

function badgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return 'admin-badge--pending';
  if (s === 'confirmed') return 'admin-badge--confirmed';
  if (s === 'completed') return 'admin-badge--completed';
  if (s === 'cancelled') return 'admin-badge--cancelled';
  return 'admin-badge--pending';
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export default function AppointmentsManagement() {
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
      const { data } = await getAppointments();
      setRows(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date());
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load appointments');
    } finally {
      if (showFullLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getAppointments();
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
          setLastSyncedAt(new Date());
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || e.message || 'Failed to load appointments');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    setError(null);
    try {
      const { data } = await updateAppointment(id, { status });
      const notes = [];
      if (data?.notifications?.email?.sent) notes.push('Email sent to patient');
      else if (data?.notifications?.email?.reason === 'no_email') notes.push('No patient email on file');
      if (data?.notifications?.sms?.sent) notes.push('SMS sent to patient');
      if (notes.length) {
        setError(null);
        const delivered =
          Boolean(data?.notifications?.email?.sent) || Boolean(data?.notifications?.sms?.sent);
        if (delivered) {
          toast.success(notes.join('. '), { duration: 4500 });
        } else {
          toast(notes.join('. '), { duration: 4500 });
        }
      }
      await refreshFromServer();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this appointment record?')) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteAppointment(id);
      await refreshFromServer();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Delete failed');
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
            <h1 className="admin-page-title">Appointments</h1>
            <p className="admin-page-desc">
              View all appointments, update status (Pending / Confirmed / Completed), or delete. The list
              reloads from the server after each action.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--primary admin-btn--small"
              disabled={loading || refreshing}
              onClick={() => refreshFromServer({ showFullLoading: true })}
              title="Reload appointments from server"
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
            No appointments yet.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>When</th>
                  <th>Emergency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patientName}</td>
                    <td>{a.phone}</td>
                    <td>{a.serviceType}</td>
                    <td>
                      {formatDate(a.date)}
                      {a.time && ` · ${a.time}`}
                    </td>
                    <td>{a.isEmergency ? 'Yes' : '—'}</td>
                    <td>
                      <span className={`admin-badge ${badgeClass(a.status)}`}>{a.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                        <select
                          value={STATUSES.includes(a.status) ? a.status : 'Pending'}
                          disabled={busyId === a._id || refreshing}
                          onChange={(ev) => handleStatus(a._id, ev.target.value)}
                          style={{
                            padding: '0.35rem 0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border, #e2e8f0)',
                          }}
                          aria-label={`Change status for ${a.patientName}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          disabled={busyId === a._id || refreshing}
                          onClick={() => handleDelete(a._id)}
                        >
                          Delete
                        </button>
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
