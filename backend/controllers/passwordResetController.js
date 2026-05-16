const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordResetOtp = require('../models/PasswordResetOtp');
const { isEmailConfigured, sendPasswordResetOtpEmail } = require('../services/notificationService');

const OTP_TTL_MS = 15 * 60 * 1000;
const RESET_JWT_EXPIRY = '30m';
const MAX_OTP_ATTEMPTS = 5;

function jwtSecret() {
  return process.env.JWT_SECRET || 'alhaseeb_secret_key';
}

/** Exported for tests — produces a 6-digit string including leading zeros conceptually via randomInt range */
function generateSixDigitOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

const GENERIC_SEND_RESPONSE =
  'If an account exists for that email, we sent a 6-digit code. Check your inbox and spam folder.';

// @route POST /api/auth/forgot-password/send-otp
const sendForgotPasswordOtp = async (req, res) => {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({
        message:
          'Password reset by email is not available because outgoing mail is not configured on the server.',
      });
    }

    const email = (req.body.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: GENERIC_SEND_RESPONSE });
    }

    const otp = generateSixDigitOtp();
    const codeHash = await bcrypt.hash(otp, 10);

    await PasswordResetOtp.deleteMany({ email });
    await PasswordResetOtp.create({
      email,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      attempts: 0,
    });

    try {
      await sendPasswordResetOtpEmail({
        to: email,
        otp,
        greetingName: user.fullName || user.username,
      });
    } catch (err) {
      console.error('[passwordReset] Email send failed:', err.message);
      await PasswordResetOtp.deleteMany({ email });
      return res.status(503).json({
        message: 'We could not send the email right now. Try again later or contact support.',
      });
    }

    return res.json({ message: GENERIC_SEND_RESPONSE });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/forgot-password/verify-otp
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const digits = String(req.body.otp || req.body.code || '').replace(/\D/g, '').slice(0, 6);

    if (!email || digits.length !== 6) {
      return res.status(400).json({ message: 'Email and the 6-digit code from your email are required.' });
    }

    const record = await PasswordResetOtp.findOne({ email });
    if (!record || record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired code. Request a new one.' });
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await PasswordResetOtp.deleteMany({ email });
      return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' });
    }

    const ok = await bcrypt.compare(digits, record.codeHash);
    if (!ok) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Incorrect verification code.' });
    }

    await PasswordResetOtp.deleteMany({ email });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code. Request a new one.' });
    }

    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: 'password-reset' },
      jwtSecret(),
      { expiresIn: RESET_JWT_EXPIRY }
    );

    return res.json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/forgot-password/reset
const resetPasswordWithToken = async (req, res) => {
  try {
    const resetToken = (req.body.resetToken || '').trim();
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!resetToken || password == null || confirmPassword == null) {
      return res.status(400).json({ message: 'Reset token, password, and confirm password are required.' });
    }

    const pwd = String(password);
    const confirm = String(confirmPassword);

    if (pwd !== confirm) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (pwd.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, jwtSecret());
    } catch {
      return res.status(400).json({ message: 'Reset session expired. Start forgot-password again.' });
    }

    if (decoded.purpose !== 'password-reset' || !decoded.id) {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    user.password = pwd;
    await user.save();

    res.json({ message: 'Password updated. You can sign in now.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithToken,
  generateSixDigitOtp,
};
