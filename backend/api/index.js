const serverless = require('serverless-http');
const { createApp } = require('../app');
const connectDB = require('../config/db');
const { ensureDefaultAccounts } = require('../seed/ensureDefaultAccounts');
const { ensureDefaultServices } = require('../seed/ensureDefaultServices');

let handler;
let initPromise;

async function initialize() {
  await connectDB();
  await ensureDefaultAccounts();
  await ensureDefaultServices();
  const app = createApp();
  handler = serverless(app);
}

module.exports = async (req, res) => {
  if (!initPromise) {
    initPromise = initialize().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  try {
    await initPromise;
    return handler(req, res);
  } catch (err) {
    console.error('[api] Initialization failed:', err.message);
    res.status(503).json({
      message: 'API is starting or misconfigured. Check MONGO_URI and environment variables.',
    });
  }
};
