/**
 * Local development only. Vercel uses api/index.js (serverless) — never app.listen() on Vercel.
 */
const { createApp } = require('./app');
const { runStartup } = require('./lib/runStartup');

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  console.warn('[server.js] Ignored on Vercel — use api/index.js');
} else {
  (async () => {
    try {
      await runStartup();
      const app = createApp();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    }
  })();
}
