import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CalendarDays, CheckCircle2, Clock3, MessageSquare } from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivity } from '../../services/api';

function statusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return 'admin-badge admin-badge--pending';
  if (s === 'confirmed') return 'admin-badge admin-badge--confirmed';
  if (s === 'completed') return 'admin-badge admin-badge--completed';
  if (s === 'cancelled') return 'admin-badge admin-badge--cancelled';
  return 'admin-badge admin-badge--pending';
}

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivity(),
        ]);
        if (!cancelled) {
          setStats(statsRes.data);
          setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || e.message || 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <header className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
        </header>
        <p className="admin-muted">Loading overview…</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
        </header>
        <div className="admin-alert admin-alert--error">{error}</div>
      </>
    );
  }

  const items = [
    {
      label: 'Total appointments',
      value: stats?.totalAppointments ?? '—',
      icon: CalendarDays,
    },
    {
      label: 'Pending appointments',
      value: stats?.pendingAppointments ?? '—',
      icon: Activity,
    },
    {
      label: 'Completed appointments',
      value: stats?.completedAppointments ?? '—',
      icon: CheckCircle2,
    },
    {
      label: 'Today bookings',
      value: stats?.todayBookings ?? '—',
      icon: Clock3,
    },
    {
      label: 'Total inquiries',
      value: stats?.totalInquiries ?? '—',
      icon: MessageSquare,
    },
    {
      label: 'Unread inquiries',
      value: stats?.unreadInquiries ?? '—',
      icon: MessageSquare,
    },
  ];

  return (
    <>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-desc">Overview of current appointment activity.</p>
      </header>

      <div className="admin-card-grid" style={{ marginBottom: '1.5rem' }}>
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div className="admin-stat-card__label">{label}</div>
              <Icon size={18} color="#3b82f6" aria-hidden />
            </div>
            <div className="admin-stat-card__value">{value}</div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
          <strong>Recent activity</strong>
          <p className="admin-muted" style={{ marginTop: '0.25rem', marginBottom: 0 }}>
            Latest appointments and inquiries
          </p>
        </div>
        {activity.length === 0 ? (
          <p className="admin-muted" style={{ padding: '1.25rem' }}>
            No activity yet.{' '}
            <Link to="/admin/appointments">Manage appointments</Link> or{' '}
            <Link to="/admin/inquiries">view inquiries</Link>
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: '0.5rem 0' }}>
            {activity.map((item, i) => (
              <li
                key={`${item.type}-${item.data?._id ?? i}`}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid var(--border, #e2e8f0)',
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.type}</span>
                {item.type === 'Appointment' && item.data && (
                  <span className="admin-muted">
                    {' '}
                    — {item.data.patientName} · {item.data.serviceType} ·{' '}
                    <span className={statusBadgeClass(item.data.status)}>{item.data.status}</span>
                  </span>
                )}
                {item.type === 'Inquiry' && item.data && (
                  <span className="admin-muted">
                    {' '}
                    — {item.data.name} · {item.data.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
