import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { getActiveServices, submitAppointment } from '../services/api';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';
import { localizeBookingApiMessage } from '../utils/authMessages';

export default function Booking() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { user, isAuthenticated } = usePatientAuth();
  const [services, setServices] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patientName: '',
      phone: '',
      patientEmail: '',
      serviceType: '',
      date: '',
      time: '',
      address: '',
      notes: '',
      isEmergency: false,
    },
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await getActiveServices();
        if (!cancelled) {
          setServices(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setLoadError(t('booking', 'loadError'));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    reset((current) => ({
      ...current,
      patientName: user.fullName || current.patientName,
      patientEmail: user.email || current.patientEmail,
      phone: user.phone || current.phone,
    }));
  }, [isAuthenticated, user, reset]);

  const onSubmit = async (values) => {
    setSubmitError('');
    setSuccessMessage('');

    try {
      const payload = {
        patientName: values.patientName.trim(),
        phone: values.phone.trim(),
        patientEmail: values.patientEmail.trim(),
        serviceType: values.serviceType.trim(),
        date: values.date,
        time: values.time,
        address: values.address.trim(),
        notes: values.notes?.trim() || '',
        isEmergency: Boolean(values.isEmergency),
      };

      await submitAppointment(payload);
      reset({
        patientName: user?.fullName || '',
        phone: user?.phone || '',
        patientEmail: user?.email || '',
        serviceType: '',
        date: '',
        time: '',
        address: '',
        notes: '',
        isEmergency: false,
      });
      if (isAuthenticated) {
        navigate('/my-appointments', { replace: true });
        queueMicrotask(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
        return;
      }
      setSuccessMessage(t('booking', 'successGuest'));
    } catch (error) {
      const raw = error.response?.data?.message || t('booking', 'submitFailed');
      setSubmitError(localizeBookingApiMessage(raw, lang, t));
    }
  };

  return (
    <div className="page-with-fixed-nav public-form-page">
      <div className="container py-5">
        <h1>{t('booking', 'title')}</h1>
        <p className="section-desc" style={{ marginBottom: '1rem' }}>
          {t('booking', 'intro')}{' '}
          {isAuthenticated ? (
            <>
              {t('booking', 'historyBefore')}
              <Link to="/my-appointments">{t('nav', 'myAppointments')}</Link>
              {t('booking', 'historyAfter')}
            </>
          ) : (
            <>
              <Link to="/signup">{t('booking', 'signupLink')}</Link>
              {t('booking', 'signupAfter')}
            </>
          )}
        </p>

        {loadError && (
          <div className="admin-alert admin-alert--error" style={{ marginBottom: '1rem' }}>
            {loadError}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
            }}
          >
            {successMessage}
          </div>
        )}

        {submitError && (
          <div className="admin-alert admin-alert--error" style={{ marginBottom: '1rem' }}>
            {submitError}
          </div>
        )}

        <form className="admin-form-grid admin-form-grid--2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="admin-field">
            <label htmlFor="patientName">{t('booking', 'patientName')}</label>
            <input
              id="patientName"
              type="text"
              {...register('patientName', { required: t('booking', 'patientNameRequired') })}
            />
            {errors.patientName && <small className="admin-muted">{errors.patientName.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="phone">{t('booking', 'phoneNumber')}</label>
            <input id="phone" type="tel" {...register('phone', { required: t('booking', 'phoneRequired') })} />
            {errors.phone && <small className="admin-muted">{errors.phone.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="patientEmail">
              {isAuthenticated ? t('booking', 'emailFromAccount') : t('booking', 'emailForUpdates')}
            </label>
            <input
              id="patientEmail"
              type="email"
              readOnly={isAuthenticated && Boolean(user?.email)}
              {...register('patientEmail', {
                required: t('booking', 'emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('booking', 'emailInvalid'),
                },
              })}
            />
            {errors.patientEmail && <small className="admin-muted">{errors.patientEmail.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="serviceType">{t('booking', 'serviceType')}</label>
            <input
              id="serviceType"
              list="service-options"
              placeholder={t('booking', 'servicePlaceholder')}
              {...register('serviceType', { required: t('booking', 'serviceRequired') })}
            />
            <datalist id="service-options">
              {services.map((service) => (
                <option key={service._id} value={service.title} />
              ))}
            </datalist>
            {errors.serviceType && <small className="admin-muted">{errors.serviceType.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="date">{t('booking', 'preferredDate')}</label>
            <input id="date" type="date" {...register('date', { required: t('booking', 'dateRequired') })} />
            {errors.date && <small className="admin-muted">{errors.date.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="time">{t('booking', 'preferredTime')}</label>
            <input id="time" type="time" {...register('time', { required: t('booking', 'timeRequired') })} />
            {errors.time && <small className="admin-muted">{errors.time.message}</small>}
          </div>

          <div className="admin-field">
            <label htmlFor="address">{t('booking', 'homeAddress')}</label>
            <input id="address" type="text" {...register('address', { required: t('booking', 'addressRequired') })} />
            {errors.address && <small className="admin-muted">{errors.address.message}</small>}
          </div>

          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="notes">{t('booking', 'notesOptional')}</label>
            <textarea id="notes" {...register('notes')} />
          </div>

          <div
            className="admin-field"
            style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <input id="isEmergency" type="checkbox" {...register('isEmergency')} />
            <label htmlFor="isEmergency" style={{ marginBottom: 0 }}>
              {t('booking', 'emergencyLabel')}
            </label>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? t('booking', 'submitting') : t('booking', 'submitBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
