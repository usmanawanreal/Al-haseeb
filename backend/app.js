const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

function buildCorsOptions() {
  const raw = process.env.FRONTEND_URL || '';
  const origins = raw
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    return { origin: true, credentials: true };
  }

  return { origin: origins, credentials: true };
}

function createApp() {
  const app = express();

  app.use(cors(buildCorsOptions()));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'al-haseeb-api' });
  });

  app.use('/api', apiRoutes);

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = { createApp, buildCorsOptions };
