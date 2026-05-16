const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alhaseeb_secret_key', { expiresIn: '30d' });
};

const buildAuthResponse = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  fullName: user.fullName,
  phone: user.phone,
  role: user.role,
  token: generateToken(user._id),
});

const findUserByLoginId = async (raw) => {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  let user = await User.findOne({ email: lower });
  if (!user) user = await User.findOne({ username: trimmed });
  if (!user) user = await User.findOne({ username: lower });
  return user;
};

const authenticateUser = async (raw, password) => {
  const user = await findUserByLoginId(raw);
  if (!user || !password) return null;
  if (!(await user.matchPassword(password))) return null;
  return user;
};

// @desc    Auth admin & get token (email or username + password)
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const raw = String(req.body.email || req.body.username || '').trim();
    const { password } = req.body;

    if (!raw || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const user = await authenticateUser(raw, password);

    if (!user || !['Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register patient
// @route   POST /api/auth/register
// @access  Public
const registerPatient = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    const fullName = (req.body.fullName || '').trim();
    let username = (req.body.username || '').trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!username) {
      let base = email.split('@')[0].replace(/[^a-z0-9]/gi, '') || 'user';
      if (base.length < 4) base = `${base}user`;
      username = base;
      let n = 0;
      while (await User.findOne({ username })) {
        n += 1;
        username = `${base}${n}`;
      }
    } else {
      if (username.length < 4) {
        return res.status(400).json({ message: 'Username must be at least 4 characters' });
      }
      if (await User.findOne({ username })) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const phone = (req.body.phone || '').trim();

    const user = await User.create({
      username,
      email,
      fullName,
      phone: phone || undefined,
      password,
      role: 'Patient',
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login any user (Patient, Admin, SuperAdmin) — shared sign-in page
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const raw = String(req.body.email || req.body.username || '').trim();
    const { password } = req.body;

    if (!raw || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const user = await authenticateUser(raw, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    fullName: req.user.fullName,
    phone: req.user.phone,
    role: req.user.role,
  });
};

// @desc    Register initial admin (Run once for setup)
// @route   POST /api/admin/setup
// @access  Public
const setupAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const user = await User.create({
      username: 'admin',
      password: 'adminpassword123',
      role: 'SuperAdmin'
    });

    if (user) {
      res.status(201).json(buildAuthResponse(user));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  setupAdmin,
  registerPatient,
  loginUser,
  getMe
};
