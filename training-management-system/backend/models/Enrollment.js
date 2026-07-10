const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: [true, 'Batch is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: [
      'Pending',    // Employee requested, waiting for manager
      'Approved',   // Manager approved, waiting for admin to enrol
      'Rejected',   // Manager rejected
      'Enrolled',   // Admin enrolled into batch
      'Completed'   // Course completed
    ],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt:  { type: Date },
  rejectedAt:  { type: Date },
  enrolledAt:  { type: Date }
}, { timestamps: true });

// Prevent duplicate enrolment requests
EnrollmentSchema.index({ employee: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);