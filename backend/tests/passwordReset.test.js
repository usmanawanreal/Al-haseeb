const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSixDigitOtp } = require('../controllers/passwordResetController');

test('generateSixDigitOtp returns exactly six digits', () => {
  for (let i = 0; i < 40; i++) {
    const o = generateSixDigitOtp();
    assert.equal(o.length, 6);
    assert.match(o, /^\d{6}$/);
  }
});
