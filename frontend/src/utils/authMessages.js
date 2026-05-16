/** Map known backend auth texts to translation keys (Urdu UX). */

export function localizeAuthApiMessage(message, lang, t) {
  if (!message || lang !== 'ur') return message;

  const exact = {
    'Invalid email or password': 'errInvalidLogin',
    'Email/username and password are required': 'errCredentialsRequired',
    'Email and password are required': 'errEmailPasswordRequired',
    'Email already registered': 'errEmailTaken',
    'Username already taken': 'errUsernameTaken',
    'Username must be at least 4 characters': 'errUsernameShort',
    'Valid email is required': 'errValidEmailRequired',
    'Password must be at least 6 characters.': 'errPasswordShortDot',
    'Password must be at least 6 characters': 'errPasswordShort',
    'Passwords do not match.': 'errPasswordMismatchDot',
    'Passwords do not match': 'errPasswordMismatch',
    'Reset session expired. Start forgot-password again.': 'errResetExpired',
    'Invalid or expired code. Request a new one.': 'errOtpInvalid',
    'Incorrect verification code.': 'errOtpWrong',
    'Too many incorrect attempts. Request a new code.': 'errOtpTooMany',
    'Password reset by email is not available because outgoing mail is not configured on the server.':
      'errSmtpNotConfigured',
    'We could not send the email right now. Try again later or contact support.': 'errEmailSendFailed',
    'If an account exists for that email, we sent a 6-digit code. Check your inbox and spam folder.':
      'otpSentGeneric',
    'Password updated. You can sign in now.': 'passwordUpdatedToast',
    'A valid email address is required.': 'errValidEmailAddress',
    'Email and the 6-digit code from your email are required.': 'errEmailOtpRequired',
    'Reset token, password, and confirm password are required.': 'errResetFieldsRequired',
    'Invalid reset token.': 'errInvalidResetToken',
  };

  const key = exact[message];
  if (key) return t('auth', key);

  return message;
}

export function localizeBookingApiMessage(message, lang, t) {
  if (!message || lang !== 'ur') return message;
  const exact = {
    'Please fill out all required fields.': 'errRequiredFields',
  };
  const key = exact[message];
  if (key) return t('booking', key);
  return message;
}
