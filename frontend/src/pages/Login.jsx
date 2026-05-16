import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';
import { unifiedLogin } from '../services/api';
import { localizeAuthApiMessage } from '../utils/authMessages';

const ADMIN_ROLES = ['Admin', 'SuperAdmin'];

function resolveNavigateTo(locationState, isAdminSession) {
  const from = locationState?.from;
  const path = from?.pathname || '';
  const search = from?.search || '';

  if (isAdminSession) {
    if (path.startsWith('/admin')) {
      return `${path}${search}`;
    }
    return '/admin';
  }

  if (path && !path.startsWith('/admin')) {
    return `${path}${search}`;
  }
  return '/';
}

export default function Login() {
  const { lang, t } = useLanguage();
  const { isAuthenticated: isAdmin, user: adminUser, applySession: applyAdminSession, logout: logoutAdmin } =
    useAuth();
  const {
    isAuthenticated: isPatient,
    applySession: applyPatientSession,
    logout: logoutPatient,
  } = usePatientAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const [error, setError] = useState(null);

  if (isAdmin && ADMIN_ROLES.includes(adminUser?.role)) {
    return <Navigate to={resolveNavigateTo(location.state, true)} replace />;
  }

  if (isPatient) {
    return <Navigate to={resolveNavigateTo(location.state, false)} replace />;
  }

  const onSubmit = async (values) => {
    setError(null);
    try {
      const { data } = await unifiedLogin({
        email: values.email.trim(),
        password: values.password,
      });

      if (ADMIN_ROLES.includes(data.role)) {
        logoutPatient();
        applyAdminSession(data);
        navigate(resolveNavigateTo(location.state, true), { replace: true });
      } else {
        logoutAdmin();
        applyPatientSession(data);
        navigate(resolveNavigateTo(location.state, false), { replace: true });
      }
    } catch (e) {
      const raw = e.response?.data?.message || e.message || t('auth', 'loginFailed');
      setError(localizeAuthApiMessage(raw, lang, t));
    }
  };

  return (
    <div className="page-with-fixed-nav auth-page">
      <div className="container py-5 auth-flow-card" style={{ maxWidth: 480 }}>
        <h1 className="h2 mb-2">{t('auth', 'loginTitle')}</h1>
        <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
          {t('auth', 'loginSubtitle')}
        </p>

        {location.state?.passwordReset && (
          <div className="admin-alert mb-3" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
            {t('auth', 'passwordResetSuccess')}
          </div>
        )}

        {error && <div className="admin-alert admin-alert--error mb-3">{error}</div>}

        <form className="admin-form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="admin-field">
            <label htmlFor="signin-email">{t('auth', 'emailLabel')}</label>
            <input
              id="signin-email"
              type="email"
              autoComplete="username"
              {...register('email', { required: t('auth', 'emailRequired') })}
            />
            {errors.email && <small className="admin-muted">{errors.email.message}</small>}
          </div>
          <div className="admin-field">
            <label htmlFor="signin-password">{t('auth', 'passwordLabel')}</label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: t('auth', 'passwordRequired') })}
            />
            {errors.password && <small className="admin-muted">{errors.password.message}</small>}
            <div className="mt-2">
              <Link to="/forgot-password" className="small">
                {t('auth', 'forgotPassword')}
              </Link>
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
            {isSubmitting ? t('auth', 'signingIn') : t('auth', 'signIn')}
          </button>
        </form>

        <p className="mt-3 text-center section-desc mb-0">
          {t('auth', 'noAccount')} <Link to="/signup">{t('auth', 'createAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
