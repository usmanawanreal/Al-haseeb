import os
import json

# Create directories
dirs = ['backend/config', 'backend/controllers', 'backend/middlewares']
for d in dirs:
    os.makedirs(d, exist_ok=True)

# 1. config/db.js
db_js = """const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/alhaseeb');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
"""
with open('backend/config/db.js', 'w') as f: f.write(db_js)

# 2. middlewares/authMiddleware.js
auth_middleware = """const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alhaseeb_secret_key');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
"""
with open('backend/middlewares/authMiddleware.js', 'w') as f: f.write(auth_middleware)

# 3. controllers/appointmentController.js
appt_controller = """const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment };
"""
with open('backend/controllers/appointmentController.js', 'w') as f: f.write(appt_controller)

# 4. controllers/inquiryController.js
inq_controller = """const Inquiry = require('../models/Inquiry');

const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInquiry, getInquiries };
"""
with open('backend/controllers/inquiryController.js', 'w') as f: f.write(inq_controller)

# 5. controllers/authController.js
auth_controller = """const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alhaseeb_secret_key', { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { loginAdmin };
"""
with open('backend/controllers/authController.js', 'w') as f: f.write(auth_controller)

# 6. Refactor routes/api.js
routes_api = """const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const { createAppointment, getAppointments, updateAppointment } = require('../controllers/appointmentController');
const { createInquiry, getInquiries } = require('../controllers/inquiryController');
const { loginAdmin } = require('../controllers/authController');

// Appointments
router.route('/appointments').post(createAppointment).get(protect, getAppointments);
router.route('/appointments/:id').put(protect, updateAppointment);

// Inquiries
router.route('/inquiries').post(createInquiry).get(protect, getInquiries);

// Auth
router.post('/admin/login', loginAdmin);

module.exports = router;
"""
with open('backend/routes/api.js', 'w') as f: f.write(routes_api)

# 7. Refactor server.js
server_js = """const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount Routes
app.use('/api', apiRoutes);

// Error Fallback
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
"""
with open('backend/server.js', 'w') as f: f.write(server_js)

# 8. Create .env
env_content = """NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/alhaseeb
JWT_SECRET=super_secret_alhaseeb_key_2026
"""
with open('backend/.env', 'w') as f: f.write(env_content)



print("Backend structural refactoring completed.")
