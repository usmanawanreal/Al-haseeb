import os

os.makedirs('backend/models', exist_ok=True)
os.makedirs('backend/routes', exist_ok=True)

# 1. Appointment Model
appointment_model = """const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  isEmergency: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
"""

# 2. Inquiry Model
inquiry_model = """const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read', 'Resolved'], default: 'Unread' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
"""

# 3. User Model
user_model = """const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' }
});

module.exports = mongoose.model('User', UserSchema);
"""

# 4. Routes
routes_api = """const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'alhaseeb_secret_key';

// -- Appointments --
router.post('/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

router.put('/appointments/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// -- Inquiries --
router.post('/inquiries', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

router.put('/inquiries/:id', async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// -- Admin Auth --
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper route to create initial admin
router.post('/admin/setup', async (req, res) => {
  try {
    const exists = await User.findOne({ username: 'admin' });
    if (exists) return res.status(400).json({ error: 'Admin already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({ username: 'admin', password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin user created (admin / admin123)' });
  } catch (error) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

module.exports = router;
"""

# 5. Server Entry Point
server_js = """const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alhaseeb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to Alhaseeb Database'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Al-Haseeb Medical Center API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
"""

with open('backend/models/Appointment.js', 'w') as f: f.write(appointment_model)
with open('backend/models/Inquiry.js', 'w') as f: f.write(inquiry_model)
with open('backend/models/User.js', 'w') as f: f.write(user_model)
with open('backend/routes/api.js', 'w') as f: f.write(routes_api)
with open('backend/server.js', 'w') as f: f.write(server_js)

print("Backend scaffolded successfully.")
