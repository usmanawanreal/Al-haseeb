import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ABOUT_IMG =
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop&q=75';

const WHY_ICONS = [
  { icon: 'bi-clock-history', titleKey: 'why1Title', textKey: 'why1Text' },
  { icon: 'bi-award', titleKey: 'why2Title', textKey: 'why2Text' },
  { icon: 'bi-house-heart', titleKey: 'why3Title', textKey: 'why3Text' },
  { icon: 'bi-currency-dollar', titleKey: 'why4Title', textKey: 'why4Text' },
  { icon: 'bi-speedometer2', titleKey: 'why5Title', textKey: 'why5Text' },
  { icon: 'bi-shield-check', titleKey: 'why6Title', textKey: 'why6Text' },
];

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="landing-section py-5">
      <div className="container">
        <p className="section-subtitle text-center mb-2">{t('about', 'subtitle')}</p>
        <h2 className="section-title text-center mb-4">{t('about', 'title')}</h2>

        <div className="row align-items-center g-5 mb-5">
          <AboutImageCol t={t} />
          <AboutTextCol t={t} />
        </div>

        <h3 className="section-title text-center mb-4">{t('about', 'whyTitle')}</h3>
        <div className="row g-4">
          {WHY_ICONS.map((item) => (
            <div key={item.titleKey} className="col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="icon-box">
                  <i className={`bi ${item.icon}`} />
                </div>
                <h5>{t('about', item.titleKey)}</h5>
                <p className="mb-0">{t('about', item.textKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/booking" className="btn-primary-custom me-2 mb-2">
            <i className="bi bi-calendar-check" /> {t('about', 'bookAppt')}
          </Link>
          <Link to={{ pathname: '/', hash: 'pricing' }} className="btn-outline-custom btn-outline-custom--light mb-2">
            <i className="bi bi-tag" /> {t('about', 'viewPricing')}
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutImageCol({ t }) {
  return (
    <div className="col-lg-6">
      <img
        src={ABOUT_IMG}
        alt={t('about', 'imgAlt')}
        className="about-img w-100 rounded-3 shadow-sm"
        width={600}
        height={400}
        loading="lazy"
      />
    </div>
  );
}

function AboutTextCol({ t }) {
  return (
    <div className="col-lg-6">
      <h3 className="h4 mb-3">{t('about', 'missionTitle')}</h3>
      <p className="mb-3">{t('about', 'missionP1')}</p>
      <p className="mb-3">{t('about', 'missionP2')}</p>
      <ul className="check-list mt-3">
        <li>
          <i className="bi bi-check-circle-fill" /> {t('about', 'check1')}
        </li>
        <li>
          <i className="bi bi-check-circle-fill" /> {t('about', 'check2')}
        </li>
        <li>
          <i className="bi bi-check-circle-fill" /> {t('about', 'check3')}
        </li>
        <li>
          <i className="bi bi-check-circle-fill" /> {t('about', 'check4')}
        </li>
      </ul>
    </div>
  );
}

