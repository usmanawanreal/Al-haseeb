const requirePatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (req.user.role !== 'Patient') {
    return res.status(403).json({ message: 'Patient access required' });
  }
  return next();
};

module.exports = { requirePatient };
