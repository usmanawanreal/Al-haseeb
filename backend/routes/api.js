const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middlewares/authMiddleware');
const { optionalProtect } = require('../middlewares/optionalProtect');
const { requirePatient } = require('../middlewares/requirePatient');

const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { getMyAppointments, getMyAppointmentStats } = require('../controllers/patientAppointmentController');
const { createInquiry, getInquiries, updateInquiry } = require('../controllers/inquiryController');
const { loginAdmin, setupAdmin, registerPatient, loginUser, getMe } = require('../controllers/authController');
const {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithToken,
} = require('../controllers/passwordResetController');
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');

// Public
router.route('/appointments').post(optionalProtect, createAppointment).get(protect, requireAdmin, getAppointments);
router.get('/patient/appointments', protect, requirePatient, getMyAppointments);
router.get('/patient/appointments/stats', protect, requirePatient, getMyAppointmentStats);
router.route('/appointments/:id').put(protect, requireAdmin, updateAppointment).delete(protect, requireAdmin, deleteAppointment);

router.route('/inquiries').post(createInquiry).get(protect, requireAdmin, getInquiries);
router.route('/inquiries/:id').put(protect, requireAdmin, updateInquiry);

router.route('/services').post(protect, requireAdmin, createService).get(getServices);
router.route('/services/:id').put(protect, requireAdmin, updateService).delete(protect, requireAdmin, deleteService);

router.post('/admin/login', loginAdmin);
router.post('/admin/setup', setupAdmin);

router.post('/auth/register', registerPatient);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password/send-otp', sendForgotPasswordOtp);
router.post('/auth/forgot-password/verify-otp', verifyForgotPasswordOtp);
router.post('/auth/forgot-password/reset', resetPasswordWithToken);
router.get('/auth/me', protect, getMe);

const { getDashboardStats, getRecentActivity } = require('../controllers/dashboardController');
router.route('/dashboard/stats').get(protect, requireAdmin, getDashboardStats);
router.route('/dashboard/recent-activity').get(protect, requireAdmin, getRecentActivity);

module.exports = router;
