/** Instant health check — no MongoDB (used by Vercel route before main API). */
module.exports = (_req, res) => {
  res.status(200).json({ ok: true, service: 'al-haseeb-api' });
};
