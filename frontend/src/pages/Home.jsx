import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AnimatedStatNumber from '../components/AnimatedStatNumber';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import PricingSection from '../components/sections/PricingSection';
import ContactSection from '../components/sections/ContactSection';
import Seo from '../components/Seo';
import drHaseebPhoto from '../assets/dr-haseeb-optimized.webp';
import {
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_TEL_HREF,
  WHATSAPP_PRESET_HI_SERVICE,
  CLINIC_EMAIL,
  CLINIC_MAILTO_HREF,
  whatsAppHref,
} from '../constants/clinicContact';

export default function Home() {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const run = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    const timerId = window.setTimeout(run, 80);
    window.requestAnimationFrame(run);
    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.hash]);

  return (
    <>
      <Seo
        title="Home Healthcare in Shakargarh & Narowal"
        description="Certified 24/7 home healthcare in Shakargarh & Narowal by Al-Haseeb Medical Health Care Center — injections, wound care, IV drips, blood sampling, and emergency home visits led by Dr. Haseeb."
        path="/"
      />
      <section className="hero" id="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="badge-24">
                <i className="bi bi-clock-fill" /> <span>{t('hero', 'badge')}</span>
              </div>

              <h1>{t('hero', 'title')}</h1>
              <p className="hero-desc">{t('hero', 'desc')}</p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/booking" className="btn-primary-custom">
                  <i className="bi bi-calendar-check" /> {t('hero', 'book')}
                </Link>
                <a
                  href={whatsAppHref(WHATSAPP_PRESET_HI_SERVICE)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                  aria-label="Chat with us on WhatsApp"
                >
                  <i className="bi bi-whatsapp" /> {t('hero', 'whatsapp')}
                </a>
              </div>

              <div className="d-flex flex-wrap gap-4 hero-trust">
                <div className="d-flex align-items-center gap-2">
                  <div className="trust-icon">
                    <i className="bi bi-shield-check" />
                  </div>
                  <div>
                    <strong>{t('hero', 'certified')}</strong>
                    <br />
                    <small>{t('hero', 'staff')}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="trust-icon">
                    <i className="bi bi-people-fill" />
                  </div>
                  <div>
                    <strong>500+</strong>
                    <br />
                    <small>{t('hero', 'patients')}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="trust-icon">
                    <i className="bi bi-geo-alt-fill" />
                  </div>
                  <div>
                    <strong>{t('hero', 'location')}</strong>
                    <br />
                    <small>{t('hero', 'region')}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 order-first order-lg-last">
              <div className="hero-img-wrapper text-center">
                <div className="hero-portrait-ring" aria-hidden="true" />
                <img
                  src={drHaseebPhoto}
                  alt="H/Dr. Haseeb Ali Arif — Founder, Al-Haseeb Medical Health Care Center"
                  width={900}
                  height={1125}
                  loading="eager"
                  className="hero-main-img hero-portrait-img"
                />
                <div className="hero-doctor-caption">
                  <strong>H/Dr. Haseeb Ali Arif</strong>
                  <span>DHMS (Punjab), RHMP (Pak)</span>
                </div>
                <div className="hero-float-card card-1">
                  <i className="bi bi-shield-check text-success" /> {t('hero', 'floatStaff')}
                </div>
                <div className="hero-float-card card-2">
                  <i className="bi bi-heart-pulse text-danger" /> {t('hero', 'floatEmergency')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <ServicesSection />


      <PricingSection />

      <ContactSection />

      <section className="stats-section" id="stats-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">
                  <AnimatedStatNumber end={500} suffix="+" />
                </div>
                <div className="stat-label">{t('stats', 'patients')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">
                  <AnimatedStatNumber end={3} suffix="+" />
                </div>
                <div className="stat-label">{t('stats', 'years')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">{t('stats', 'available')}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">
                  <AnimatedStatNumber end={10} suffix="+" />
                </div>
                <div className="stat-label">{t('stats', 'staff')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light" id="testimonials">
        <div className="container text-center">
          <p className="section-subtitle fade-up">{t('testimonials', 'subtitle')}</p>
          <h2 className="section-title fade-up">{t('testimonials', 'title')}</h2>
          <div className="row g-4 mt-2">
            {[
              {
                quote:
                  '"The team arrived within 30 minutes. Very professional wound dressing service. Highly recommended for home care in Shakargarh!"',
                name: 'Ahmad Ali',
                place: 'Shakargarh',
                rating: 5,
              },
              {
                quote:
                  '"My mother needed daily IV drips after surgery. Al-Haseeb staff were caring and punctual every single day. Excellent!"',
                name: 'Fatima Bibi',
                place: 'Narowal',
                rating: 5,
              },
              {
                quote:
                  '"Very easy to book via WhatsApp. The nurse came on time and the blood sampling was done professionally. Will use again!"',
                name: 'Muhammad Usman',
                place: 'Shakargarh',
                rating: 4.5,
              },
            ].map((review, index) => {
              const keys = [
                { quoteKey: 'q1', nameKey: 'n1', placeKey: 'p1' },
                { quoteKey: 'q2', nameKey: 'n2', placeKey: 'p2' },
                { quoteKey: 'q3', nameKey: 'n3', placeKey: 'p3' },
              ][index];
              return (
              <div key={keys.nameKey} className="col-md-4 fade-up">
                <div className="testimonial-card">
                  <div className="stars">
                    {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                      <i key={`f-${i}`} className="bi bi-star-fill" />
                    ))}
                    {review.rating % 1 !== 0 && <i className="bi bi-star-half" />}
                  </div>
                  <p>{t('testimonials', keys.quoteKey)}</p>
                  <div className="testimonial-author">
                    <div>
                      <h6>{t('testimonials', keys.nameKey)}</h6>
                      <span>{t('testimonials', keys.placeKey)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      <section className="section-dark text-center" id="appointment-cta">
        <div className="container fade-up">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-white text-dark px-3 py-2 mb-3 fw-semibold">
                <i className="bi bi-clock-fill text-primary-custom me-1" /> {t('cta', 'badge')}
              </span>
              <h2 className="text-white">{t('cta', 'title')}</h2>
              <p className="mt-2 mb-4 mx-auto" style={{ maxWidth: 550, opacity: 0.9 }}>
                {t('cta', 'desc')}
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/booking" className="btn-outline-custom btn-lg">
                  <i className="bi bi-calendar-check" /> {t('cta', 'book')}
                </Link>
                <a
                  href={whatsAppHref(WHATSAPP_PRESET_HI_SERVICE)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp btn-lg"
                  aria-label="Chat with us on WhatsApp"
                >
                  <i className="bi bi-whatsapp" /> {t('cta', 'whatsapp')}
                </a>
                <a href={CLINIC_PHONE_TEL_HREF} className="btn-emergency btn-lg" aria-label="Call clinic directly">
                  <i className="bi bi-telephone-fill" /> {t('cta', 'call')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="py-0">
        <div className="container-fluid px-0">
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-5 d-flex">
              <div className="map-info-panel fade-up">
                <p className="section-subtitle">{t('location', 'subtitle')}</p>
                <h3 className="mb-4">{t('location', 'title')}</h3>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <i className="bi bi-geo-alt-fill fs-4 text-primary-custom mt-1" />
                  <div>
                    <h6 className="mb-1">{t('location', 'locationLabel')}</h6>
                    <p className="text-muted mb-0">{t('location', 'locationValue')}</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <i className="bi bi-telephone-fill fs-4 text-primary-custom mt-1" />
                  <div>
                    <h6 className="mb-1">{t('location', 'phoneLabel')}</h6>
                    <a href={CLINIC_PHONE_TEL_HREF} className="text-primary-custom fw-semibold ltr-num">
                      {CLINIC_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <i className="bi bi-envelope-fill fs-4 text-primary-custom mt-1" />
                  <div>
                    <h6 className="mb-1">{t('location', 'emailLabel')}</h6>
                    <a href={CLINIC_MAILTO_HREF} className="text-primary-custom fw-semibold ltr-num">
                      {CLINIC_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <i className="bi bi-whatsapp fs-4 mt-1" style={{ color: 'var(--whatsapp)' }} />
                  <div>
                    <h6 className="mb-1">{t('location', 'whatsappLabel')}</h6>
                    <a
                      href={whatsAppHref()}
                      target="_blank"
                      rel="noreferrer"
                      className="fw-semibold"
                      style={{ color: 'var(--whatsapp)' }}
                    >
                      {t('location', 'chatNow')}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-4">
                  <i className="bi bi-clock-fill fs-4 text-primary-custom mt-1" />
                  <div>
                    <h6 className="mb-1">{t('location', 'hoursLabel')}</h6>
                    <p className="text-muted mb-0">{t('location', 'hoursValue')}</p>
                  </div>
                </div>
                <Link to="/booking" className="btn-primary-custom">
                  <i className="bi bi-calendar-check" /> {t('location', 'book')}
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <iframe
                title="Al-Haseeb Service Area"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53456.48!2d75.15!3d32.27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ee97bdc24b0e9%3A0x9e3ed593e36a3e3e!2sShakargarh%2C%20Narowal!5e0!3m2!1sen!2spk!4v1699900000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
