/** Public clinic contact — phone, WhatsApp, email (single source for navbar, footer, contact section, Home). */

export const CLINIC_EMAIL = 'alhaseebmedicalskg@gmail.com';
export const CLINIC_MAILTO_HREF = `mailto:${CLINIC_EMAIL}`;

/** Display format for Pakistan mobile */
export const CLINIC_PHONE_DISPLAY = '03088053238';

/** Opens native dialer with country code */
export const CLINIC_PHONE_TEL_HREF = 'tel:+923088053238';

/**
 * WhatsApp `wa.me` expects digits only: country code + number without leading 0.
 * 03088053238 → 923088053238
 */
export const CLINIC_WHATSAPP_WA_ME = '923088053238';

export const CLINIC_WHATSAPP_URL = `https://wa.me/${CLINIC_WHATSAPP_WA_ME}`;

/** @param {string} [encodedText] pre-encoded query value for `text=` (e.g. from encodeURIComponent or fixed literals) */
export function whatsAppHref(encodedText) {
  if (!encodedText) return CLINIC_WHATSAPP_URL;
  return `${CLINIC_WHATSAPP_URL}?text=${encodedText}`;
}

/** Common deep-link payloads (already URL-encoded for ?text=) */
export const WHATSAPP_PRESET_HI_SERVICE = 'Hi%2C%20I%20need%20home%20healthcare%20service.';
export const WHATSAPP_PRESET_NEED_SERVICE = 'I%20need%20home%20healthcare%20service';
