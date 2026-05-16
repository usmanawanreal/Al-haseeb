import {
  CLINIC_PHONE_TEL_HREF,
  WHATSAPP_PRESET_NEED_SERVICE,
  whatsAppHref,
} from '../constants/clinicContact';

export default function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar d-md-none">
      <a
        href={whatsAppHref(WHATSAPP_PRESET_NEED_SERVICE)}
        target="_blank"
        rel="noreferrer"
        className="btn-sticky btn-sticky-whatsapp"
        aria-label="Chat with us on WhatsApp"
      >
        <i className="bi bi-whatsapp" /> WhatsApp
      </a>
      <a href={CLINIC_PHONE_TEL_HREF} className="btn-sticky btn-sticky-call" aria-label="Call clinic directly">
        <i className="bi bi-telephone-fill" /> Call Now
      </a>
    </div>
  );
}
