const connectDB = require('../config/db');
const { ensureDefaultAccounts } = require('../seed/ensureDefaultAccounts');
const { ensureDefaultServices } = require('../seed/ensureDefaultServices');

const STARTUP_TIMEOUT_MS = Number(process.env.STARTUP_TIMEOUT_MS) || 20000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

async function runStartup() {
  await connectDB();
  await ensureDefaultAccounts();
  await ensureDefaultServices();
}

async function runStartupWithTimeout() {
  return withTimeout(runStartup(), STARTUP_TIMEOUT_MS, 'API startup (MongoDB / seed)');
}

module.exports = { runStartup, runStartupWithTimeout, STARTUP_TIMEOUT_MS };
