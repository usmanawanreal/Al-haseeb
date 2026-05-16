const { createApp } = require('../app');
const { connectDatabase, runSeedsInBackground } = require('../lib/runStartup');
const { invokeExpress } = require('../lib/invokeExpress');

let app;
let initPromise;

async function getApp() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDatabase();
      const expressApp = createApp();
      runSeedsInBackground();
      return expressApp;
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

module.exports = async (req, res) => {
  try {
    const expressApp = await getApp();
    await invokeExpress(expressApp, req, res);
  } catch (err) {
    console.error('[api] Request failed:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        message:
          'API could not start. Check MONGO_URI and MongoDB Atlas → Network Access → allow 0.0.0.0/0.',
        detail: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }
};
