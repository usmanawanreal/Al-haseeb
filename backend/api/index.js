const serverless = require('serverless-http');
const { createApp } = require('../app');
const { runStartupWithTimeout } = require('../lib/runStartup');

let handler;
let initPromise;

function requestPath(req) {
  return (req.url || '').split('?')[0];
}

async function initialize() {
  await runStartupWithTimeout();
  const app = createApp();
  handler = serverless(app, { binary: false });
}

function getInitPromise() {
  if (!initPromise) {
    initPromise = initialize().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

module.exports = async (req, res) => {
  try {
    await getInitPromise();
    return handler(req, res);
  } catch (err) {
    console.error('[api] Initialization failed:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        message:
          'API could not start. Check MONGO_URI and MongoDB Atlas → Network Access → allow 0.0.0.0/0.',
        detail: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }
};
