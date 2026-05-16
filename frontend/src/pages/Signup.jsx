import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';
import { localizeAuthApiMessage } from '../utils/authMessages';

export default function Signup() {
  const { lang, t } = useLanguage();
  const { register: registerAccount, isAuthenticated } = usePatientAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      username: '',
    },
  });

  const [error, setError] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values) => {
    setError(null);
    try {
      await registerAccount({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        username: values.username.trim() || undefined,
      });
      navigate('/', { replace: true });
    } catch (e) {
      const raw = e.response?.data?.message || e.message || t('auth', 'registrationFailed');
      setError(localizeAuthApiMessage(raw, lang, t));
    }
  };

  return (
    <div className="page-with-fixed-nav auth-page">
      <div className="container py-5 auth-flow-card" style={{ maxWidth: 480 }}>
        <h1 className="h2 mb-2">{t('auth', 'signupTitle')}</h1>
        <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
          {t('auth', 'signupSubtitle')}
        </p>

        {error && <div className="admin-alert admin-alert--error mb-3">{error}</div>}

        <form className="admin-form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="admin-field">
            <label htmlFor="signup-name">{t('auth', 'fullName')}</label>
            <input id="signup-name" type="text" autoComplete="name" {...register('fullName')} />
          </div>
          <div className="admin-field">
            <label htmlFor="signup-email">{t('auth', 'emailLabel')}</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              {...register('email', { required: t('auth', 'emailRequired') })}
            />
            {errors.email && <small className="admin-muted">{errors.email.message}</small>}
          </div>
          <div className="admin-field">
            <label htmlFor="signup-username">{t('auth', 'usernameOptional')}</label>
            <input id="signup-username" type="text" autoComplete="username" {...register('username')} />
            <small className="admin-muted">{t('auth', 'usernameHint')}</small>
          </div>
          <div className="admin-field">
            <label htmlFor="signup-password">{t('auth', 'passwordLabel')}</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: t('auth', 'passwordRequired'),
                minLength: { value: 6, message: t('auth', 'passwordMin') },
              })}
            />
            {errors.password && <small className="admin-muted">{errors.password.message}</small>}
          </div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
            {isSubmitting ? t('auth', 'signingUp') : t('auth', 'signUp')}
          </button>
        </form>

        <p className="mt-3 text-center section-desc mb-0">
          {t('auth', 'alreadyHaveAccount')} <Link to="/login">{t('auth', 'signInLink')}</Link>
        </p>
      </div>
    </div>
  );
}
