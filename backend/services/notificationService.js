const nodemailer = require('nodemailer');

const CLINIC_NAME = 'Al-Haseeb Medical Health Care Center';
const CLINIC_PHONE = '03088053238';

function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function isSmsConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
  );
}

function getMailTransport() {
  if (!isEmailConfigured()) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatAppointmentDate(date, time) {
  try {
    const d = new Date(date);
    const datePart = d.toLocaleDateString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return `${datePart} at ${time}`;
  } catch {
    return `${date} ${time}`;
  }
}

function buildStatusMessage(status) {
  switch (status) {
    case 'Confirmed':
      return 'Your appointment has been confirmed. Our team will visit you at the scheduled time.';
    case 'Completed':
      return 'Your appointment has been marked as completed. Thank you for choosing Al-Haseeb.';
    case 'Cancelled':
      return 'Your appointment has been cancelled. Contact us if you need to rebook.';
    default:
      return `Your appointment status is now: ${status}.`;
  }
}

function buildEmailHtml(appointment, status) {
  const when = formatAppointmentDate(appointment.date, appointment.time);
  const message = buildStatusMessage(status);
  return `
      <h2 style="color:#1e3a8a;margin:0 0 12px;">${CLINIC_NAME}</h2>
      <p style="margin:0 0 16px;">Hello ${appointment.patientName},</p>
      <p style="margin:0 0 16px;">${message}</p>
      <table style="border-collapse:collapse;width:100%;max-width:520px;">
        <tr><td style="padding:6px 0;color:#64748b;">Status</td><td><strong>${status}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Service</td><td>${appointment.serviceType}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">When</td><td>${when}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Address</td><td>${appointment.address}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td>${appointment.phone}</td></tr>
      </table>
      <p style="margin:20px 0 0;">Questions? Call <a href="tel:${CLINIC_PHONE}">${CLINIC_PHONE}</a> or reply on WhatsApp.</p>
      <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">Shakargarh, District Narowal</p>
  `;
}

function buildSmsText(appointment, status) {
  const when = formatAppointmentDate(appointment.date, appointment.time);
  return `${CLINIC_NAME}: Appointment ${status} — ${appointment.serviceType}, ${when}. Call ${CLINIC_PHONE}.`;
}

/** Comma-separated in ADMIN_NOTIFY_EMAIL, else falls back to ADMIN_EMAIL (managed account). */
function getAdminBookingNotifyRecipients() {
  const raw = (process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || '').trim();
  if (!raw) return [];
  return [...new Set(raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean))];
}

function buildNewBookingAdminSubject(appointment) {
  const tag = appointment.isEmergency ? ' [Emergency]' : '';
  return `New booking request${tag} — ${appointment.patientName}`;
}

function buildNewBookingAdminEmailHtml(appointment) {
  const when = formatAppointmentDate(appointment.date, appointment.time);
  const emergency = appointment.isEmergency
    ? '<p style="margin:0 0 12px;color:#b91c1c;font-weight:700;">Emergency request</p>'
    : '';
  const emailLine = appointment.patientEmail
    ? `<tr><td style="padding:6px 0;color:#64748b;">Patient email</td><td>${appointment.patientEmail}</td></tr>`
    : '';
  return `
      <h2 style="color:#1e3a8a;margin:0 0 12px;">New appointment request</h2>
      <p style="margin:0 0 16px;">A patient submitted a booking through the website.</p>
      ${emergency}
      <table style="border-collapse:collapse;width:100%;max-width:520px;">
        <tr><td style="padding:6px 0;color:#64748b;">Patient</td><td><strong>${appointment.patientName}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td>${appointment.phone}</td></tr>
        ${emailLine}
        <tr><td style="padding:6px 0;color:#64748b;">Service</td><td>${appointment.serviceType}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">When</td><td>${when}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Address</td><td>${appointment.address}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Status</td><td>${appointment.status || 'Pending'}</td></tr>
      </table>
      ${appointment.notes ? `<p style="margin:16px 0 0;"><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      <p style="margin:20px 0 0;font-size:13px;color:#64748b;">Open the admin panel to confirm or manage this booking.</p>
  `;
}

async function notifyAdminsNewBooking(appointment) {
  const recipients = getAdminBookingNotifyRecipients();
  if (!recipients.length) {
    return { sent: false, reason: 'no_admin_email' };
  }
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const transport = getMailTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const when = formatAppointmentDate(appointment.date, appointment.time);
  const text = [
    `New booking from ${appointment.patientName}.`,
    appointment.isEmergency ? 'EMERGENCY REQUEST.' : '',
    `Phone: ${appointment.phone}`,
    appointment.patientEmail ? `Email: ${appointment.patientEmail}` : '',
    `Service: ${appointment.serviceType}`,
    `When: ${when}`,
    `Address: ${appointment.address}`,
    appointment.notes ? `Notes: ${appointment.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await transport.sendMail({
      from: `"${CLINIC_NAME}" <${from}>`,
      to: recipients,
      subject: buildNewBookingAdminSubject(appointment),
      text,
      html: buildNewBookingAdminEmailHtml(appointment),
    });
    return { sent: true, channel: 'email', to: recipients.length };
  } catch (e) {
    console.error('[notificationService] Admin new-booking email error:', e.message);
    return { sent: false, channel: 'email', error: e.message };
  }
}

async function sendAppointmentStatusEmail(appointment, status) {
  const to = appointment.patientEmail;
  if (!to || !isEmailConfigured()) {
    return { sent: false, channel: 'email', reason: !to ? 'no_email' : 'smtp_not_configured' };
  }

  const transport = getMailTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from: `"${CLINIC_NAME}" <${from}>`,
    to,
    subject: `Appointment ${status} — ${CLINIC_NAME}`,
    text: `${buildStatusMessage(status)}\n\nService: ${appointment.serviceType}\nWhen: ${formatAppointmentDate(appointment.date, appointment.time)}\nAddress: ${appointment.address}`,
    html: buildEmailHtml(appointment, status),
  });

  return { sent: true, channel: 'email' };
}

function normalizePhoneE164(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('92')) return `+${digits}`;
  if (digits.startsWith('0')) return `+92${digits.slice(1)}`;
  if (digits.length === 10) return `+92${digits}`;
  return `+${digits}`;
}

async function sendAppointmentStatusSms(appointment, status) {
  if (!isSmsConfigured()) {
    return { sent: false, channel: 'sms', reason: 'twilio_not_configured' };
  }

  const to = normalizePhoneE164(appointment.phone);
  if (!to) {
    return { sent: false, channel: 'sms', reason: 'invalid_phone' };
  }

  const auth = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString('base64');

  const body = new URLSearchParams({
    To: to,
    From: process.env.TWILIO_FROM_NUMBER,
    Body: buildSmsText(appointment, status),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('[notificationService] SMS failed:', errText);
    return { sent: false, channel: 'sms', reason: 'twilio_error' };
  }

  return { sent: true, channel: 'sms' };
}

const NOTIFY_STATUSES = ['Confirmed', 'Completed', 'Cancelled'];

async function notifyPatientOnStatusChange(appointment, newStatus, previousStatus) {
  if (!NOTIFY_STATUSES.includes(newStatus) || newStatus === previousStatus) {
    return { email: { sent: false }, sms: { sent: false } };
  }

  const results = { email: { sent: false }, sms: { sent: false } };

  try {
    results.email = await sendAppointmentStatusEmail(appointment, newStatus);
  } catch (e) {
    console.error('[notificationService] Email error:', e.message);
    results.email = { sent: false, error: e.message };
  }

  try {
    results.sms = await sendAppointmentStatusSms(appointment, newStatus);
  } catch (e) {
    console.error('[notificationService] SMS error:', e.message);
    results.sms = { sent: false, error: e.message };
  }

  if (results.email.sent || results.sms.sent) {
    console.log(
      `[notificationService] ${newStatus} notice for ${appointment.patientName}: email=${results.email.sent} sms=${results.sms.sent}`
    );
  }

  return results;
}

async function sendPasswordResetOtpEmail({ to, otp, greetingName }) {
  const transport = getMailTransport();
  if (!transport) {
    throw new Error('SMTP not configured');
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = greetingName || 'there';

  await transport.sendMail({
    from: `"${CLINIC_NAME}" <${from}>`,
    to,
    subject: `Your password reset code — ${CLINIC_NAME}`,
    text: [
      `Hello ${name},`,
      '',
      `Your verification code is: ${otp}`,
      '',
      'This code expires in 15 minutes.',
      '',
      'If you did not request a password reset, ignore this email.',
      '',
      CLINIC_NAME,
    ].join('\n'),
    html: `
      <h2 style="color:#1e3a8a;margin:0 0 12px;">${CLINIC_NAME}</h2>
      <p style="margin:0 0 12px;">Hello ${name},</p>
      <p style="margin:0 0 16px;">Use this code to reset your password:</p>
      <p style="font-size:28px;font-weight:800;letter-spacing:8px;color:#1e3a8a;margin:0 0 20px;">${otp}</p>
      <p style="margin:0 0 12px;color:#64748b;font-size:14px;">Expires in <strong>15 minutes</strong>.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;">If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = {
  notifyPatientOnStatusChange,
  notifyAdminsNewBooking,
  buildNewBookingAdminSubject,
  buildStatusMessage,
  buildSmsText,
  normalizePhoneE164,
  isEmailConfigured,
  isSmsConfigured,
  sendPasswordResetOtpEmail,
};
