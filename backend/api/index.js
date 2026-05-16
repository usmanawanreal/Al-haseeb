const serverless = require('serverless-http');
const { createApp } = require('../app');
const { connectDatabase, runSeedsInBackground } = require('../lib/runStartup');

let handler;
let initPromise;

async function initialize() {
  await connectDatabase();
  const app = createApp();
  handler = serverless(app, { binary: false });
  runSeedsInBackground();
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
    return await handler(req, res);
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
