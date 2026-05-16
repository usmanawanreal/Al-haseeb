const Appointment = require('../models/Appointment');
const Inquiry = require('../models/Inquiry');

// @desc    Get dashboard aggregate statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    // 1. Total appointments (all time)
    const totalAppointments = await Appointment.countDocuments();

    // 2. Pending appointments (requires action)
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

    // 3. Completed appointments
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

    // 4. Bookings for today (based on scheduled appointment date)
    const todayBookings = await Appointment.countDocuments({
      date: { $gte: startOfToday, $lt: endOfToday },
    });

    const totalInquiries = await Inquiry.countDocuments();
    const unreadInquiries = await Inquiry.countDocuments({ status: 'Unread' });

    res.json({
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      todayBookings,
      totalInquiries,
      unreadInquiries,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// @desc    Get recent activity feed
// @route   GET /api/dashboard/recent-activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    // Fetch last 5 appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('patientName serviceType status createdAt');

    // Fetch last 5 inquiries
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status createdAt');

    // Combine and sort by date descending
    const activity = [
      ...recentAppointments.map(a => ({ type: 'Appointment', data: a, date: a.createdAt })),
      ...recentInquiries.map(i => ({ type: 'Inquiry', data: i, date: i.createdAt }))
    ];

    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return the top 10 most recent events overall
    res.json(activity.slice(0, 10));
  } catch {
    res.status(500).json({ message: 'Failed to fetch recent activity' });
  }
};

module.exports = { getDashboardStats, getRecentActivity };
