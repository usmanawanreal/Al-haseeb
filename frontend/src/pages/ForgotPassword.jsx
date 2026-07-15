import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';
import {
  getApiErrorMessage,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetForgotPassword,
} from '../services/api';
import { localizeAuthApiMessage } from '../utils/authMessages';
import Seo from '../components/Seo';

const ADMIN_ROLES = ['Admin', 'SuperAdmin'];

export default function ForgotPassword() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated: isAdmin, user: adminUser } = useAuth();
  const { isAuthenticated: isPatient } = usePatientAuth();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if ((isAdmin && ADMIN_ROLES.includes(adminUser?.role)) || isPatient) {
    return <Navigate to="/" replace />;
  }

  const mapErr = (msg) => localizeAuthApiMessage(msg, lang, t);

  const onSendOtp = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setError(null);
    setInfo('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t('auth', 'enterValidEmail'));
      return;
    }
    setBusy(true);
    try {
      const { data } = await sendForgotPasswordOtp({ email: trimmed });
      setEmail(trimmed);
      const backendMsg = data?.message || '';
      const localizedInfo = localizeAuthApiMessage(backendMsg, lang, t);
      setInfo(localizedInfo || t('auth', 'otpSentHint'));
      setStep('otp');
      setOtp('');
    } catch (err) {
      setError(mapErr(getApiErrorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo('');
    const digits = otp.replace(/\D/g, '').slice(0, 6);
    if (digits.length !== 6) {
      setError(t('auth', 'enterSixDigit'));
      return;
    }
    setBusy(true);
    try {
      const { data } = await verifyForgotPasswordOtp({ email, otp: digits });
      if (!data.resetToken) {
        setError(t('auth', 'somethingWrong'));
        return;
      }
      setResetToken(data.resetToken);
      setStep('password');
      setInfo(t('auth', 'codeVerified'));
    } catch (err) {
      setError(mapErr(getApiErrorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  const onReset = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo('');
    if (password !== confirmPassword) {
      setError(t('auth', 'errPasswordMismatchDot'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth', 'errPasswordShortDot'));
      return;
    }
    setBusy(true);
    try {
      await resetForgotPassword({
        resetToken,
        password,
        confirmPassword,
      });
      navigate('/login', { replace: true, state: { passwordReset: true } });
    } catch (err) {
      setError(mapErr(getApiErrorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-with-fixed-nav auth-page">
      <Seo title="Reset Your Password" path="/forgot-password" noindex />
      <div className="container py-5 auth-flow-card" style={{ maxWidth: 480 }}>
        <h1 className="h2 mb-2">{t('auth', 'forgotTitle')}</h1>
        <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
          {t('auth', 'forgotSubtitle')}
        </p>

        {error && <div className="admin-alert admin-alert--error mb-3">{error}</div>}
        {info && step !== 'password' && (
          <div
            className="admin-alert mb-3"
            style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}
          >
            {info}
          </div>
        )}
        {info && step === 'password' && (
          <div
            className="admin-alert mb-3"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}
          >
            {info}
          </div>
        )}

        {step === 'email' && (
          <form className="admin-form-grid" onSubmit={onSendOtp} noValidate>
            <div className="admin-field">
              <label htmlFor="fp-email">{t('auth', 'emailLabel')}</label>
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={busy}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? t('auth', 'sending') : t('auth', 'sendCode')}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="admin-form-grid" onSubmit={onVerifyOtp} noValidate>
            <p className="section-desc mb-2 small">
              {t('auth', 'otpSentTo')}: <span className="ltr-num fw-semibold">{email}</span>
            </p>
            <div className="admin-field">
              <label htmlFor="fp-otp">{t('auth', 'otpLabel')}</label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder={t('auth', 'otpPlaceholder')}
                value={otp}
                onChange={(ev) => setOtp(ev.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={busy}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? t('auth', 'verifying') : t('auth', 'verifyCode')}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={busy}
              onClick={() => {
                setStep('email');
                setOtp('');
                setError(null);
                setInfo('');
              }}
            >
              {t('auth', 'useOtherEmail')}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={onSendOtp}>
              {t('auth', 'resendCode')}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form className="admin-form-grid" onSubmit={onReset} noValidate>
            <div className="admin-field">
              <label htmlFor="fp-password">{t('auth', 'newPassword')}</label>
              <input
                id="fp-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                disabled={busy}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="fp-confirm">{t('auth', 'confirmPassword')}</label>
              <input
                id="fp-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                disabled={busy}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? t('auth', 'updating') : t('auth', 'updatePassword')}
            </button>
          </form>
        )}

        <p className="mt-3 text-center section-desc mb-0">
          <Link to="/login">{t('auth', 'backToSignIn')}</Link>
        </p>
      </div>
    </div>
  );
}
