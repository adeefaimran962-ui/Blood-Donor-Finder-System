const mongoose = require('mongoose');

/**
 * Blood Request Schema
 * Defines the structure for blood requests in the Blood Donor Finder System
 */
const bloodRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [50, 'Patient name cannot exceed 50 characters']
  },
  bloodGroupRequired: {
    type: String,
    required: [true, 'Blood group required is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group'
    }
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
    maxlength: [100, 'Hospital name cannot exceed 100 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  requiredDate: {
    type: Date,
    required: [true, 'Required date is required']
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
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Additional notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Approved', 'Completed', 'Rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
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
bloodRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
bloodRequestSchema.index({ userId: 1 });
bloodRequestSchema.index({ bloodGroupRequired: 1, city: 1 });
bloodRequestSchema.index({ status: 1 });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

module.exports = BloodRequest;
