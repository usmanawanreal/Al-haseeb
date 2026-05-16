const serverless = require('serverless-http');
const { createApp } = require('../app');
const { runStartupWithTimeout } = require('../lib/runStartup');

let handler;
let initPromise;

async function initialize() {
  await runStartupWithTimeout();
  const app = createApp();
  handler = serverless(app, { binary: false });
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
    if (!res.headersSent) {
      res.status(503).json({
        message:
          'API could not start. Check MONGO_URI (Atlas IP allowlist 0.0.0.0/0), JWT_SECRET, and Vercel env vars.',
        detail: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }
};
