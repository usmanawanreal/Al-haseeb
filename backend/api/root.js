/** Root URL — instant response (no MongoDB). */
module.exports = (_req, res) => {
  res.status(200).json({
    service: 'Al-Haseeb API',
    status: 'running',
    health: '/api/health',
    hint: 'Use your frontend URL for the website. API routes are under /api/…',
  });
};
