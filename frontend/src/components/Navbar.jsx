import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePatientAuth } from '../hooks/usePatientAuth';
import { useLanguage } from '../context/LanguageContext';
import {
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_TEL_HREF,
  whatsAppHref,
} from '../constants/clinicContact';

const ADMIN_ROLES = ['Admin', 'SuperAdmin'];

function displayPatientName(user) {
  if (!user) return '';
  if (user.fullName && String(user.fullName).trim()) return user.fullName.trim();
  if (user.email) return user.email;
  return user.username || '';
}

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const { user: adminUser, isAuthenticated: adminSession, logout: logoutAdmin } = useAuth();
  const { user, isAuthenticated, logout } = usePatientAuth();

  const isAdmin = adminSession && ADMIN_ROLES.includes(adminUser?.role);

  useEffect(() => {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return undefined;
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const patientLabel = displayPatientName(user);

  return (
    <>
      <div className="top-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <span>
              <i className="bi bi-geo-alt-fill" /> Shakargarh, Narowal
            </span>
            <span>
              <i className="bi bi-clock-fill" /> 24/7 Available
            </span>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
            >
              <i className="bi bi-whatsapp" /> WhatsApp
            </a>
            <a href={CLINIC_PHONE_TEL_HREF} aria-label="Call clinic directly">
              <i className="bi bi-telephone-fill" /> {CLINIC_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-white navbar-custom fixed-top" id="mainNav">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <span className="navbar-brand-text">
              Al-Haseeb<small>Medical Health Care Center</small>
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button
              type="button"
              className="btn-lang flex-shrink-0"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}
            >
              {lang === 'en' ? 'اردو' : 'EN'}
            </button>
            <a href={CLINIC_PHONE_TEL_HREF} className="btn-emergency-sm" aria-label="Call clinic emergency line">
              <i className="bi bi-telephone-fill" aria-hidden />
            </a>
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navMenu"
              aria-controls="navMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  {t('nav', 'home')}
                </NavLink>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: '/', hash: 'about' }}>
                  {t('nav', 'about')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: '/', hash: 'services' }}>
                  {t('nav', 'services')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: '/', hash: 'pricing' }}>
                  {t('nav', 'pricing')}
                </Link>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/booking">
                  {t('nav', 'book')}
                </NavLink>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: '/', hash: 'contact' }}>
                  {t('nav', 'contact')}
                </Link>
              </li>

              <li className="nav-item d-lg-none px-2 mt-1">
                <a
                  href={CLINIC_PHONE_TEL_HREF}
                  className="btn-emergency-nav w-100 justify-content-center text-decoration-none"
                  aria-label="Call clinic emergency line"
                >
                  <i className="bi bi-telephone-fill" aria-hidden />
                  <span>{t('nav', 'emergency')}</span>
                  <span className="ltr-num ms-1 opacity-75 small fw-normal">{CLINIC_PHONE_DISPLAY}</span>
                </a>
              </li>

              <li className="nav-item nav-item-lang d-none d-lg-block">
                <button
                  type="button"
                  className="btn-lang"
                  onClick={toggleLang}
                  aria-label={lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}
                >
                  {lang === 'en' ? 'اردو' : 'EN'}
                </button>
              </li>

              {!isAdmin && isAuthenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-appointments">
                    {t('nav', 'myAppointments')}
                  </NavLink>
                </li>
              )}
              {!isAdmin && isAuthenticated && patientLabel && (
                <li className="nav-item px-lg-2 d-none d-xl-block">
                  <span className="nav-link py-2 text-primary fw-semibold small mb-0">
                    <i className="bi bi-person-circle me-1" />
                    {patientLabel}
                  </span>
                </li>
              )}
              {isAdmin ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <i className="bi bi-speedometer2 me-1" />
                      {t('nav', 'dashboard')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary ms-lg-1"
                      onClick={() => logoutAdmin()}
                    >
                      {t('nav', 'logout')}
                    </button>
                  </li>
                </>
              ) : isAuthenticated ? (
                <li className="nav-item">
                  <button type="button" className="btn btn-sm btn-outline-primary ms-lg-1" onClick={() => logout()}>
                    {t('nav', 'logout')}
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      {t('nav', 'login')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/signup">
                      {t('nav', 'signup')}
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item d-lg-none">
                <button
                  type="button"
                  className="btn-lang w-100 mt-2"
                  onClick={toggleLang}
                  aria-label={lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}
                >
                  {lang === 'en' ? 'اردو' : 'English'}
                </button>
              </li>
              <li className="nav-item d-none d-lg-block ms-1">
                <a
                  href={CLINIC_PHONE_TEL_HREF}
                  className="btn-emergency-nav text-decoration-none"
                  aria-label="Call clinic emergency line"
                >
                  <i className="bi bi-telephone-fill" aria-hidden /> <span>{t('nav', 'emergency')}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
