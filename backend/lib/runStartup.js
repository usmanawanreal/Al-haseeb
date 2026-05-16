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

async function connectDatabase() {
  return withTimeout(connectDB(), STARTUP_TIMEOUT_MS, 'MongoDB connection');
}

async function runSeeds() {
  await ensureDefaultAccounts();
  await ensureDefaultServices();
}

let seedsStarted = false;

function runSeedsInBackground() {
  if (seedsStarted) return;
  seedsStarted = true;
  runSeeds().catch((err) => {
    console.error('[runStartup] Seed error:', err.message);
    seedsStarted = false;
  });
}

module.exports = {
  connectDatabase,
  runSeeds,
  runSeedsInBackground,
  STARTUP_TIMEOUT_MS,
};
