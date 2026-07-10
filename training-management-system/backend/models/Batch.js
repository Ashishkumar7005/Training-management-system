const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: [true, 'Batch name is required'],
    trim: true
  },
  batchCode: {
    type: String,
    required: [true, 'Batch code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  venue: {
    type: String,
    trim: true,
    default: 'Online'
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Max participants is required']
  },
  enrolledParticipants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);