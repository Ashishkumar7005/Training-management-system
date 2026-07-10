const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: [true, 'Batch is required']
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment is required']
  },
  courseRating: {
    type: Number,
    required: [true, 'Course rating is required'],
    min: 1,
    max: 5
  },
  trainerRating: {
    type: Number,
    required: [true, 'Trainer rating is required'],
    min: 1,
    max: 5
  },
  courseComments: {
    type: String,
    trim: true,
    required: [true, 'Course comments are required']
  },
  trainerComments: {
    type: String,
    trim: true,
    required: [true, 'Trainer comments are required']
  },
  wouldRecommend: {
    type: Boolean,
    required: [true, 'Recommendation is required']
  },
  overallExperience: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    required: [true, 'Overall experience is required']
  }
}, { timestamps: true });

// Prevent duplicate feedback
FeedbackSchema.index({ employee: 1, enrollment: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);