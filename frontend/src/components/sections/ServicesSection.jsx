import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveServices } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { formatServicePrice, localizeService } from '../../i18n/serviceTranslations';

const FALLBACK_SERVICES = [
  { _id: 'static-1', icon: 'bi-capsule', title: 'Injections', description: 'IM, IV, and SC injections administered safely at home by trained professionals.' },
  { _id: 'static-2', icon: 'bi-bandaid', title: 'Wound Care', description: 'Professional wound dressing, cleaning, and post-surgical care at your home.' },
  { _id: 'static-3', icon: 'bi-droplet-half', title: 'IV Drip Therapy', description: 'Intravenous fluid therapy and medication drips under professional supervision.' },
  { _id: 'static-4', icon: 'bi-eyedropper', title: 'Blood Sampling', description: 'Convenient home blood collection for lab tests with accurate results.' },
  {
    _id: 'static-5',
    icon: 'bi-heart-pulse',
    title: 'Emergency Service',
    description: '24/7 emergency home medical response — we come to you when you need us most.',
    emergency: true,
  },
  { _id: 'static-6', icon: 'bi-activity', title: 'Patient Monitoring', description: 'Regular health checkups and vital signs monitoring for chronic patients.' },
];

export default function ServicesSection() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getActiveServices();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch {
        /* keep fallback list when API is offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayServices = useMemo(
    () =>
      services.map((s) => {
        const localized = localizeService(s, lang);
        return {
          ...s,
          title: localized.title,
          description: localized.description,
        };
      }),
    [services, lang]
  );

  return (
    <section id="services" className="section-light">
      <div className="container text-center">
        <p className="section-subtitle fade-up">{t('sections', 'ourServices')}</p>
        <h2 className="section-title fade-up">{t('sections', 'servicesTitle')}</h2>
        <p className="section-desc fade-up">{t('sections', 'servicesDesc')}</p>
        <div className="row g-4">
          {displayServices.map((s) => {
            const icon = s.icon || 'bi-heart-pulse';
            const isEmergency =
              s.emergency || (s.title && String(s.title).toLowerCase().includes('emergency'));
            const iconStyle = isEmergency ? { background: '#fecaca', color: '#dc2626' } : undefined;
            return (
              <ServiceCard
                key={s._id || s.title}
                icon={icon}
                iconStyle={iconStyle}
                title={s.title}
                description={s.description}
                basePrice={s.basePrice}
                lang={lang}
              />
            );
          })}
        </div>
        <div className="mt-4 fade-up">
          <Link to="/booking" className="btn-primary-custom">
            <i className="bi bi-arrow-right" /> {t('sections', 'bookService')}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, iconStyle, title, description, basePrice, lang }) {
  return (
    <div className="col-6 col-lg-4 fade-up">
      <div className="service-card">
        <div className="icon-box" style={iconStyle}>
          <i className={`bi ${icon}`} />
        </div>
        <h5>{title}</h5>
        <p>{description}</p>
        {typeof basePrice === 'number' && (
          <p className="text-muted small mb-0 ltr-num">{formatServicePrice(basePrice, lang)}</p>
        )}
      </div>
    </div>
  );
}
