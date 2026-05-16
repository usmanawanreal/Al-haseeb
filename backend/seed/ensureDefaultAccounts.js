const User = require('../models/User');

/**
 * Upserts the admin user from environment variables into MongoDB on server start.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in `.env` (recommended — avoids hardcoding secrets).
 */
async function ensureDefaultAccounts() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const email = (
    process.env.ADMIN_EMAIL || (isProduction ? '' : 'ua8241@gmail.com')
  )
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || (isProduction ? '' : '12345654321uU');

  if (!email || !password) {
    console.warn(
      '[ensureDefaultAccounts] Skipped — set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel/backend env.'
    );
    return;
  }

  try {
    const existing = await User.findOne({
      $or: [{ email }, { username: email }]
    });

    if (!existing) {
      await User.create({
        username: email,
        email,
        fullName: process.env.ADMIN_FULL_NAME || 'Administrator',
        password,
        role: 'SuperAdmin',
      });
      console.log(`[ensureDefaultAccounts] Admin user created: ${email}`);
      return;
    }

    if (!['Admin', 'SuperAdmin'].includes(existing.role)) {
      console.warn(
        `[ensureDefaultAccounts] An account already exists for ${email} with role "${existing.role}". Not overwriting.`
      );
      return;
    }

    if (process.env.ADMIN_FORCE_SYNC !== 'true') {
      return;
    }

    existing.username = email;
    existing.email = email;
    existing.password = password;
    existing.role = 'SuperAdmin';
    if (process.env.ADMIN_FULL_NAME) {
      existing.fullName = process.env.ADMIN_FULL_NAME.trim();
    }
    await existing.save();
    console.log(`[ensureDefaultAccounts] Admin user synced (ADMIN_FORCE_SYNC): ${email}`);
  } catch (e) {
    console.error('[ensureDefaultAccounts]', e.message);
  }
}

module.exports = { ensureDefaultAccounts };
