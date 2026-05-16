import { useEffect, useMemo, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  MessageSquare,
  Stethoscope,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getAppointments } from '../../services/api';
import './AdminLayout.css';

const NEW_BOOKING_POLL_MS = 25000;

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/services', label: 'Services', icon: Stethoscope },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const knownAppointmentIdsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const checkForNewBookings = async () => {
      try {
        const { data } = await getAppointments();
        if (cancelled || !Array.isArray(data)) return;

        const idStr = (row) => String(row._id);

        if (knownAppointmentIdsRef.current === null) {
          knownAppointmentIdsRef.current = new Set(data.map(idStr));
          return;
        }

        for (const row of data) {
          const id = idStr(row);
          if (!knownAppointmentIdsRef.current.has(id)) {
            knownAppointmentIdsRef.current.add(id);
            const emerg = row.isEmergency ? ' (Emergency)' : '';
            toast.success(`New booking${emerg}: ${row.patientName} · ${row.serviceType}`, {
              duration: 6500,
            });
          }
        }
      } catch {
        /* Ignore poll errors (e.g. network) */
      }
    };

    checkForNewBookings();
    const timer = window.setInterval(checkForNewBookings, NEW_BOOKING_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const activePageTitle = useMemo(() => {
    const current = navItems.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)));
    return current?.label || 'Admin Panel';
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`admin-shell${sidebarOpen ? ' admin-shell--sidebar-open' : ''}`}>
      <Toaster
        position="top-center"
        containerStyle={{ top: 72 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: '0.95rem',
            maxWidth: 420,
          },
        }}
      />
      <button
        type="button"
        className="admin-sidebar-overlay"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link to="/" className="admin-sidebar__brand-link" aria-label="Go to website home">
            <ShieldCheck size={22} className="admin-sidebar__brand-icon" aria-hidden />
            <div>
              <div className="admin-sidebar__title">Al-Haseeb</div>
              <div className="admin-sidebar__subtitle">Medical Admin</div>
            </div>
          </Link>
          <button
            type="button"
            className="admin-sidebar__close"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user" title={user?.username}>
            <span className="admin-sidebar__user-name">{user?.username ?? 'Admin'}</span>
            <span className="admin-sidebar__user-role">{user?.role ?? ''}</span>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleLogout}>
            <LogOut size={18} aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-topbar__menu"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} aria-hidden />
            </button>
            <div>
              <p className="admin-topbar__label">Dashboard</p>
              <h2 className="admin-topbar__title">{activePageTitle}</h2>
            </div>
          </div>

          <div className="admin-topbar__right">
            <div className="admin-topbar__chip">
              <Bell size={15} aria-hidden />
              <span>Live</span>
            </div>
            <div className="admin-topbar__user">
              <span className="admin-topbar__name">{user?.username ?? 'Admin'}</span>
              <span className="admin-topbar__role">{user?.role ?? ''}</span>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
