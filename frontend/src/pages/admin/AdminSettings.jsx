import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSettings() {
  const { user } = useAuth();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  return (
    <>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-desc">Session and connection details for this admin area.</p>
      </header>

      <div className="admin-panel" style={{ padding: '1.25rem', maxWidth: 560 }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>Account</h2>
        <dl style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
          <div>
            <dt className="admin-muted" style={{ marginBottom: '0.15rem' }}>
              Username
            </dt>
            <dd style={{ fontWeight: 600, margin: 0 }}>{user?.username ?? '—'}</dd>
          </div>
          <div>
            <dt className="admin-muted" style={{ marginBottom: '0.15rem' }}>
              Role
            </dt>
            <dd style={{ fontWeight: 600, margin: 0 }}>{user?.role ?? '—'}</dd>
          </div>
        </dl>

        <hr style={{ margin: '1.25rem 0', border: 'none', borderTop: '1px solid var(--border, #e2e8f0)' }} />

        <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>API</h2>
        <p className="admin-muted" style={{ marginBottom: '0.5rem' }}>
          Frontend talks to this base URL (from <code>VITE_API_URL</code> or default):
        </p>
        <code
          style={{
            display: 'block',
            padding: '0.65rem 0.85rem',
            background: 'var(--bg-alt, #f1f5f9)',
            borderRadius: 'var(--radius, 0.75rem)',
            fontSize: '0.85rem',
            wordBreak: 'break-all',
          }}
        >
          {apiBase}
        </code>

        <p className="admin-muted" style={{ marginTop: '1.25rem' }}>
          Password changes and notifications are not configured in this panel yet. Use the{' '}
          <Link to="/admin">dashboard</Link> quick links for day-to-day operations.
        </p>
      </div>
    </>
  );
}
