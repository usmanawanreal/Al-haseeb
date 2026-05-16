import { WHATSAPP_PRESET_NEED_SERVICE, whatsAppHref } from '../constants/clinicContact';

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsAppHref(WHATSAPP_PRESET_NEED_SERVICE)}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      title="WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <i className="bi bi-whatsapp" />
    </a>
  );
}
