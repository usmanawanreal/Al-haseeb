const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    patientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [120, 'Email cannot exceed 120 characters'],
    },
    patientName: {
      type: String,
      required: [true, 'Please add a patient name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    serviceType: {
      type: String,
      required: [true, 'Please select a service type']
    },
    date: {
      type: Date,
      required: [true, 'Please add an appointment date']
    },
    time: {
      type: String,
      required: [true, 'Please add an appointment time']
    },
    address: {
      type: String,
      required: [true, 'Please add a home address for the visit'],
      maxlength: [250, 'Address cannot exceed 250 characters']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    lastNotifiedStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', null],
      default: null,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
