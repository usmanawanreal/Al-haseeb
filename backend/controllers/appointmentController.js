const Appointment = require('../models/Appointment');
const {
  notifyPatientOnStatusChange,
  notifyAdminsNewBooking,
} = require('../services/notificationService');

const createAppointment = async (req, res) => {
  try {
    const { patientName, phone, serviceType, date, time, address } = req.body;

    if (!patientName || !phone || !serviceType || !date || !time || !address) {
      return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    const payload = {
      patientName: String(patientName).trim(),
      phone: String(phone).trim(),
      serviceType: String(serviceType).trim(),
      date,
      time: String(time).trim(),
      address: String(address).trim(),
      notes: req.body.notes ? String(req.body.notes).trim() : '',
      isEmergency: Boolean(req.body.isEmergency),
    };

    const emailRaw = (req.body.patientEmail || '').trim().toLowerCase();
    if (emailRaw) {
      payload.patientEmail = emailRaw;
    }

    if (req.user && req.user.role === 'Patient') {
      payload.userId = req.user._id;
      if (req.user.email) {
        payload.patientEmail = req.user.email;
      }
    }

    const appointment = await Appointment.create(payload);

    try {
      const adminMail = await notifyAdminsNewBooking(appointment);
      if (!adminMail.sent && adminMail.reason !== 'smtp_not_configured') {
        console.warn('[appointments] Admin booking email not sent:', adminMail.reason || adminMail.error);
      }
    } catch (e) {
      console.error('[appointments] Admin booking notify failed:', e.message);
    }

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
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const existing = await Appointment.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const previousStatus = existing.status;
    existing.status = status || existing.status;

    const appointment = await existing.save();

    let notifications = null;
    if (status && status !== previousStatus && appointment.lastNotifiedStatus !== status) {
      notifications = await notifyPatientOnStatusChange(appointment, status, previousStatus);
      appointment.lastNotifiedStatus = status;
      await appointment.save();
    }

    const response = appointment.toObject();
    response.notifications = notifications;
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };
