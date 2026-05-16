import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyAppointmentStats, fetchMyAppointments } from '../services/patientApi';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';

function badgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return 'admin-badge--pending';
  if (s === 'confirmed') return 'admin-badge--confirmed';
  if (s === 'completed') return 'admin-badge--completed';
  if (s === 'cancelled') return 'admin-badge--cancelled';
  return 'admin-badge--pending';
}

function formatWhen(row, localeTag) {
  try {
    const d = new Date(row.date);
    return `${d.toLocaleDateString(localeTag)} · ${row.time}`;
  } catch {
    return `${row.date} ${row.time}`;
  }
}

function statusLabel(status, t) {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return t('dashboard', 'statusPending');
  if (s === 'confirmed') return t('dashboard', 'statusConfirmed');
  if (s === 'completed') return t('dashboard', 'statusCompleted');
  if (s === 'cancelled') return t('dashboard', 'statusCancelled');
  return status || t('dashboard', 'emDash');
}

export default function PatientDashboard() {
  const { lang, t } = useLanguage();
  const { user } = usePatientAuth();
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localeTag = lang === 'ur' ? 'ur-PK' : 'en-PK';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        fetchMyAppointments(),
        fetchMyAppointmentStats(),
      ]);
      setRows(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      setStats(statsRes.data || null);
    } catch (e) {
      setError(e.response?.data?.message || e.message || t('dashboard', 'loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const displayName = user?.fullName || user?.email || t('dashboard', 'patientFallback');

  return (
    <div className="page-with-fixed-nav public-form-page">
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1 className="h2 mb-1">{t('nav', 'myAppointments')}</h1>
            <p className="section-desc mb-0">
              {t('dashboard', 'welcome')} {displayName}. {t('dashboard', 'subtitle')}
            </p>
          </div>
          <Link to="/booking" className="btn-primary-custom">
            <i className="bi bi-calendar-plus" /> {t('dashboard', 'bookNewVisit')}
          </Link>
        </div>

        {error && <div className="admin-alert admin-alert--error mb-3">{error}</div>}

        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="service-card h-100 text-center py-3">
                <div className="stat-number" style={{ fontSize: '1.75rem' }}>
                  {stats.total}
                </div>
                <div className="text-muted small">{t('dashboard', 'totalBookings')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-card h-100 text-center py-3">
                <div className="stat-number" style={{ fontSize: '1.75rem' }}>
                  {stats.confirmed}
                </div>
                <div className="text-muted small">{t('dashboard', 'confirmed')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-card h-100 text-center py-3">
                <div className="stat-number" style={{ fontSize: '1.75rem' }}>
                  {stats.completed}
                </div>
                <div className="text-muted small">{t('dashboard', 'completed')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-card h-100 text-center py-3">
                <div className="stat-number" style={{ fontSize: '1.75rem' }}>
                  {stats.servicesBooked}
                </div>
                <div className="text-muted small">{t('dashboard', 'differentServices')}</div>
              </div>
            </div>
          </div>
        )}

        <div className="admin-panel">
          <h2 className="h5 px-3 pt-3">{t('dashboard', 'bookingHistory')}</h2>
          {loading ? (
            <p className="admin-muted p-3">{t('dashboard', 'loading')}</p>
          ) : rows.length === 0 ? (
            <p className="admin-muted p-3">
              {t('dashboard', 'emptyBefore')}{' '}
              <Link to="/booking">{t('dashboard', 'bookFirstVisit')}</Link>
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('dashboard', 'tableService')}</th>
                    <th>{t('dashboard', 'tableWhen')}</th>
                    <th>{t('dashboard', 'tableAddress')}</th>
                    <th>{t('dashboard', 'tableStatus')}</th>
                    <th>{t('dashboard', 'tableBookedOn')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row._id}>
                      <td>{row.serviceType}</td>
                      <td>{formatWhen(row, localeTag)}</td>
                      <td style={{ maxWidth: 220 }}>{row.address}</td>
                      <td>
                        <span className={`admin-badge ${badgeClass(row.status)}`}>
                          {statusLabel(row.status, t)}
                        </span>
                      </td>
                      <td>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString(localeTag)
                          : t('dashboard', 'emDash')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
