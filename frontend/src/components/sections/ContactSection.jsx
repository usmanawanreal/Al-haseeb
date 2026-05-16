import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitInquiry } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  CLINIC_EMAIL,
  CLINIC_MAILTO_HREF,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_TEL_HREF,
  whatsAppHref,
} from '../../constants/clinicContact';

export default function ContactSection() {
  const { t } = useLanguage();
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setSubmitError('');
    setSuccessMessage('');
    try {
      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      };
      const email = values.email.trim();
      if (email) payload.email = email;
      await submitInquiry(payload);
      setSuccessMessage(t('contact', 'success'));
      reset();
    } catch (error) {
      setSubmitError(error.response?.data?.message || t('contact', 'fail'));
    }
  };

  return (
    <section id="contact" className="landing-section py-5">
      <div className="container">
        <p className="section-subtitle text-center mb-2">{t('contact', 'subtitle')}</p>
        <h2 className="section-title text-center">{t('contact', 'title')}</h2>
        <p className="section-desc text-center mx-auto mb-5" style={{ maxWidth: 560 }}>
          {t('contact', 'desc')}
        </p>

        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <div
              className="contact-info-card p-4 rounded-3 h-100"
              style={{ background: 'var(--primary-50)', border: '1px solid var(--border)' }}
            >
              <h3 className="h5 mb-4">{t('contact', 'clinicTitle')}</h3>
              <ul className="list-unstyled mb-0" style={{ lineHeight: 2.2 }}>
                <li>
                  <i className="bi bi-geo-alt text-primary me-2" />
                  {t('contact', 'address')}
                </li>
                <li>
                  <a href={CLINIC_PHONE_TEL_HREF} className="text-decoration-none text-body">
                    <i className="bi bi-telephone text-primary me-2" />
                    <span className="ltr-num">{CLINIC_PHONE_DISPLAY}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CLINIC_MAILTO_HREF}
                    className="text-decoration-none text-body"
                  >
                    <i className="bi bi-envelope text-primary me-2" />
                    <span className="ltr-num">{CLINIC_EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsAppHref()}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-body"
                  >
                    <i className="bi bi-whatsapp text-success me-2" />
                    {t('hero', 'whatsapp')}
                  </a>
                </li>
                <li>
                  <i className="bi bi-clock text-primary me-2" />
                  {t('contact', 'hours')}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-7">
            {successMessage && (
              <div
                className="mb-3 p-3 rounded-3"
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#166534',
                }}
              >
                {successMessage}
              </div>
            )}
            {submitError && <div className="admin-alert admin-alert--error mb-3">{submitError}</div>}

            <form className="admin-form-grid landing-contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="admin-field">
                <label htmlFor="home-contact-name">{t('contact', 'name')}</label>
                <input
                  id="home-contact-name"
                  type="text"
                  {...register('name', { required: t('contact', 'nameRequired') })}
                />
                {errors.name && <small className="admin-muted">{errors.name.message}</small>}
              </div>
              <div className="admin-field">
                <label htmlFor="home-contact-email">{t('contact', 'email')}</label>
                <input
                  id="home-contact-email"
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('contact', 'emailInvalid'),
                    },
                  })}
                />
                {errors.email && <small className="admin-muted">{errors.email.message}</small>}
              </div>
              <div className="admin-field">
                <label htmlFor="home-contact-phone">{t('contact', 'phone')}</label>
                <input
                  id="home-contact-phone"
                  type="tel"
                  {...register('phone', { required: t('contact', 'phoneRequired') })}
                />
                {errors.phone && <small className="admin-muted">{errors.phone.message}</small>}
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="home-contact-message">{t('contact', 'message')}</label>
                <textarea
                  id="home-contact-message"
                  rows={4}
                  {...register('message', {
                    required: t('contact', 'messageRequired'),
                    maxLength: { value: 500, message: t('contact', 'messageMax') },
                  })}
                />
                {errors.message && <small className="admin-muted">{errors.message.message}</small>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? t('contact', 'sending') : t('contact', 'send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
