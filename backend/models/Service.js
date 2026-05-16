const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
      type: String,
      default: 'bi-heart-pulse'
    },
    basePrice: {
      type: Number,
      required: [true, 'Please add a base price']
    },
    isAvailable24_7: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Service', ServiceSchema);
