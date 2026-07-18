const mongoose = require('mongoose');

/**
 * Donor Schema
 * Defines the structure for blood donor profiles in the Blood Donor Finder System
 */
const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [50, 'Full name cannot exceed 50 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor must not exceed 65 years old']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: '{VALUE} is not a valid gender'
    }
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group'
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    match: [
      /^[0-9]{10,15}$/,
      'Please provide a valid contact number (10-15 digits)'
    ]
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  availabilityStatus: {
    type: String,
    required: [true, 'Availability status is required'],
    enum: {
      values: ['Available', 'Not Available'],
      message: '{VALUE} is not a valid availability status'
    },
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
donorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
donorSchema.index({ userId: 1 });
donorSchema.index({ bloodGroup: 1, city: 1 });
donorSchema.index({ availabilityStatus: 1 });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
