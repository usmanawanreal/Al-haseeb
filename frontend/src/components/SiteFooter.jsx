import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  CLINIC_EMAIL,
  CLINIC_MAILTO_HREF,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_TEL_HREF,
  whatsAppHref,
} from '../constants/clinicContact';

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="navbar-brand-text mb-3">
              Al-Haseeb<small>Medical Health Care Center</small>
            </h5>
            <p>{t('footer', 'tagline')}</p>
            <div className="d-flex gap-2 mt-3">
              <a
                href={whatsAppHref()}
                target="_blank"
                rel="noreferrer"
                className="social-icon"
                aria-label="Chat with us on WhatsApp"
              >
                <i className="bi bi-whatsapp" />
              </a>
              <a href={CLINIC_PHONE_TEL_HREF} className="social-icon" aria-label="Call clinic directly">
                <i className="bi bi-telephone-fill" />
              </a>
              <a href={CLINIC_MAILTO_HREF} className="social-icon" aria-label="Email clinic">
                <i className="bi bi-envelope-fill" />
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h5>{t('footer', 'quickLinks')}</h5>
            <ul>
              <li>
                <Link to="/">{t('nav', 'home')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'about' }}>{t('nav', 'about')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'services' }}>{t('nav', 'services')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'pricing' }}>{t('nav', 'pricing')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'contact' }}>{t('nav', 'contact')}</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h5>{t('footer', 'servicesTitle')}</h5>
            <ul>
              <li>
                <Link to={{ pathname: '/', hash: 'services' }}>{t('footer', 'injections')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'services' }}>{t('footer', 'woundCare')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'services' }}>{t('footer', 'ivDrip')}</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'services' }}>{t('footer', 'bloodSampling')}</Link>
              </li>
              <li>
                <Link to="/booking" className="text-danger">
                  {t('footer', 'emergency')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h5>{t('footer', 'contactTitle')}</h5>
            <ul>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2" />
                {t('contact', 'address')}
              </li>
              <li className="mb-2">
                <a href={CLINIC_PHONE_TEL_HREF} aria-label="Call clinic directly">
                  <i className="bi bi-telephone me-2" />
                  <span className="ltr-num">{CLINIC_PHONE_DISPLAY}</span>
                </a>
              </li>
              <li className="mb-2">
                <a href={CLINIC_MAILTO_HREF} aria-label="Email clinic">
                  <i className="bi bi-envelope me-2" />
                  <span className="ltr-num">{CLINIC_EMAIL}</span>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href={whatsAppHref()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat with us on WhatsApp"
                >
                  <i className="bi bi-whatsapp me-2" />
                  {t('hero', 'whatsapp')}
                </a>
              </li>
              <li>
                <i className="bi bi-clock me-2" />
                {t('contact', 'hours')}
              </li>
            </ul>
            <a href={CLINIC_PHONE_TEL_HREF} className="btn-emergency mt-2">
              <i className="bi bi-telephone-fill" /> {t('nav', 'emergency')}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Al-Haseeb Medical Health Care Center SKG. {t('footer', 'rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
