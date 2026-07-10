const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technical', 'Non-Technical']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  durationUnit: {
    type: String,
    enum: ['Days', 'Hours'],
    default: 'Days'
  },
  trainingMode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    required: [true, 'Training mode is required']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Max participants is required']
  },
  trainerName: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  prerequisites: {
    type: String,
    trim: true,
    default: 'None'
  },
  department: {
    type: String,
    enum: ['HR', 'IT', 'Finance', 'Operations', 'Sales', 'Marketing', 'All'],
    default: 'All'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);