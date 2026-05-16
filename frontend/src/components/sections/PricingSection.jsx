import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveServices } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { formatRsPrice, localizeService } from '../../i18n/serviceTranslations';

const FALLBACK_SERVICES = [
  { title: 'Injection (IM / SC / IV)', description: 'Intramuscular, subcutaneous, and intravenous injections at home.', icon: 'bi-capsule', basePrice: 400 },
  { title: 'Wound Care & Dressing', description: 'Professional cleaning and dressing of surgical or general wounds.', icon: 'bi-bandaid', basePrice: 800 },
  { title: 'IV Drip Administration', description: 'Setup and monitoring of intravenous fluids or medications.', icon: 'bi-droplet-half', basePrice: 950 },
  { title: 'Blood Sampling', description: 'At-home blood collection for laboratory tests.', icon: 'bi-eyedropper', basePrice: 300 },
  { title: 'Catheter Care', description: 'Insertion, removal, or routine maintenance of urinary catheters.', icon: 'bi-heart-pulse', basePrice: 1500 },
  { title: 'Vital Signs Checkup', description: 'BP, blood sugar, oxygen, and temperature monitoring.', icon: 'bi-activity', basePrice: 400 },
  { title: '24hr Emergency Visit', description: 'Immediate response for urgent care (Night/Weekend surcharge applies).', icon: 'bi-exclamation-triangle-fill', basePrice: 2000 },
];

const FACTOR_KEYS = [
  { icon: 'bi-geo-alt', titleKey: 'factor1Title', textKey: 'factor1Text' },
  { icon: 'bi-clipboard2-pulse', titleKey: 'factor2Title', textKey: 'factor2Text' },
  { icon: 'bi-moon-stars', titleKey: 'factor3Title', textKey: 'factor3Text' },
];

function isEmergencyService(title) {
  const s = String(title || '').toLowerCase();
  return s.includes('emergency') || s.includes('24-hour') || s.includes('24hr');
}

function buildRow(service, lang, t) {
  const localized = localizeService(service, lang);
  const basePrice = service.basePrice;
  return {
    icon: service.icon || 'bi-heart-pulse',
    name: localized.title,
    desc: localized.description,
    price: typeof basePrice === 'number' ? formatRsPrice(basePrice, lang) : t('pricing', 'contactQuote'),
    danger: isEmergencyService(localized.title || service.title),
  };
}

export default function PricingSection() {
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
        /* keep fallback when API is offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => services.map((s) => buildRow(s, lang, t)), [services, lang, t]);

  return (
    <section id="pricing" className="landing-section section-light py-5">
      <div className="container">
        <p className="section-subtitle text-center mb-2">{t('sections', 'pricing')}</p>
        <h2 className="section-title text-center">{t('sections', 'pricingTitle')}</h2>
        <p className="section-desc text-center mx-auto" style={{ maxWidth: 640 }}>
          {t('sections', 'pricingDesc')}
        </p>

        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <div className="pricing-table-container">
              <table className="table table-hover table-medical mb-0">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '40%' }}>
                      {t('pricing', 'colService')}
                    </th>
                    <th scope="col" style={{ width: '35%' }}>
                      {t('pricing', 'colDesc')}
                    </th>
                    <th scope="col" style={{ width: '25%' }}>
                      {t('pricing', 'colPrice')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.name}-${row.price}`}>
                      <td>
                        <div className={`service-name ${row.danger ? 'text-danger' : ''}`}>
                          <i className={`bi ${row.icon}`} />
                          {row.name}
                        </div>
                      </td>
                      <td>{row.desc}</td>
                      <td>
                        <span className={`price-tag ltr-num ${row.danger ? 'text-danger' : ''}`}>{row.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center mt-4 text-muted fst-italic mb-0">{t('pricing', 'disclaimer')}</p>
          </div>
        </div>

        <h3 className="section-title text-center mt-5 mb-4">{t('pricing', 'factorsTitle')}</h3>
        <div className="row g-4">
          {FACTOR_KEYS.map((item) => (
            <div key={item.titleKey} className="col-md-4">
              <div className="service-card h-100 text-center">
                <div className="icon-box mx-auto">
                  <i className={`bi ${item.icon}`} />
                </div>
                <h5>{t('pricing', item.titleKey)}</h5>
                <p className="mb-0">{t('pricing', item.textKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-5 mb-0">
          <Link to={{ pathname: '/', hash: 'contact' }} className="btn-primary-custom d-inline-flex align-items-center gap-2">
            <i className="bi bi-envelope" /> {t('pricing', 'quoteBtn')}
          </Link>
        </p>
      </div>
    </section>
  );
}
