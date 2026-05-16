const User = require('../models/User');

/**
 * Upserts the admin user from environment variables into MongoDB on server start.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in `.env` (recommended — avoids hardcoding secrets).
 */
async function ensureDefaultAccounts() {
  // Defaults match project admin; override with ADMIN_EMAIL / ADMIN_PASSWORD in .env
  const email = (process.env.ADMIN_EMAIL || 'ua8241@gmail.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '12345654321uU';

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
        role: 'SuperAdmin'
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

    existing.username = email;
    existing.email = email;
    existing.password = password;
    existing.role = 'SuperAdmin';
    if (process.env.ADMIN_FULL_NAME) {
      existing.fullName = process.env.ADMIN_FULL_NAME.trim();
    }
    await existing.save();
    console.log(`[ensureDefaultAccounts] Admin user synced from .env: ${email}`);
  } catch (e) {
    console.error('[ensureDefaultAccounts]', e.message);
  }
}

module.exports = { ensureDefaultAccounts };
