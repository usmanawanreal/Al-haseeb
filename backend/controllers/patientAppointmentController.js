const Appointment = require('../models/Appointment');

function patientAppointmentFilter(user) {
  const email = (user.email || '').trim().toLowerCase();
  const phone = (user.phone || '').trim();
  const or = [{ userId: user._id }];
  if (email) or.push({ patientEmail: email });
  if (phone) or.push({ phone });
  return { $or: or };
}

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(patientAppointmentFilter(req.user)).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointmentStats = async (req, res) => {
  try {
    const filter = patientAppointmentFilter(req.user);
    const rows = await Appointment.find(filter).select('status serviceType');

    const stats = {
      total: rows.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      servicesBooked: new Set(rows.map((r) => r.serviceType).filter(Boolean)).size,
    };

    rows.forEach((row) => {
      const key = String(row.status || '').toLowerCase();
      if (key === 'pending') stats.pending += 1;
      else if (key === 'confirmed') stats.confirmed += 1;
      else if (key === 'completed') stats.completed += 1;
      else if (key === 'cancelled') stats.cancelled += 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyAppointments, getMyAppointmentStats };
