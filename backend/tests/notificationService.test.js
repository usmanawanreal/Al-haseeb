const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildStatusMessage,
  buildSmsText,
  normalizePhoneE164,
  buildNewBookingAdminSubject,
} = require('../services/notificationService');

test('buildStatusMessage returns text for confirmed status', () => {
  const msg = buildStatusMessage('Confirmed');
  assert.match(msg, /confirmed/i);
});

test('normalizePhoneE164 formats Pakistan mobile', () => {
  assert.equal(normalizePhoneE164('03088053238'), '+923088053238');
});

test('buildNewBookingAdminSubject includes patient name', () => {
  const subject = buildNewBookingAdminSubject({ patientName: 'Sara', isEmergency: false });
  assert.match(subject, /Sara/);
  assert.match(subject, /New booking/i);
});

test('buildSmsText includes clinic name and status', () => {
  const text = buildSmsText(
    {
      patientName: 'Ali',
      serviceType: 'Injection',
      date: new Date('2026-05-20'),
      time: '10:00',
      address: 'Shakargarh',
      phone: '03088053238',
    },
    'Completed'
  );
  assert.match(text, /Al-Haseeb/);
  assert.match(text, /Completed/);
});
