const Feedback   = require('../models/Feedback');
const Enrollment = require('../models/Enrollment');

// @desc    Get enrollments eligible for feedback
// @route   GET /api/feedback/eligible
// @access  Private (Employee)
const getEligibleEnrollments = async (req, res) => {
  try {
    // Get enrolled or completed enrollments
    const enrollments = await Enrollment.find({
      employee: req.user.id,
      status: { $in: ['Enrolled', 'Completed'] }
    })
      .populate('course', 'courseName courseCode category trainerName')
      .populate('batch',  'batchName batchCode startDate endDate');

    // Check which ones already have feedback
    const feedbacks = await Feedback.find({ employee: req.user.id });
    const feedbackEnrollmentIds = feedbacks.map(f => f.enrollment.toString());

    const eligibleEnrollments = enrollments.map(e => ({
      ...e.toObject(),
      hasFeedback: feedbackEnrollmentIds.includes(e._id.toString())
    }));

    res.status(200).json({ enrollments: eligibleEnrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (Employee)
const submitFeedback = async (req, res) => {
  try {
    const {
      enrollmentId,
      courseRating,
      trainerRating,
      courseComments,
      trainerComments,
      wouldRecommend,
      overallExperience
    } = req.body;

    // Get enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check ownership
    if (enrollment.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check status
    if (!['Enrolled', 'Completed'].includes(enrollment.status)) {
      return res.status(400).json({
        message: 'Feedback can only be submitted for enrolled or completed courses'
      });
    }

    // Check already submitted
    const existing = await Feedback.findOne({
      employee:   req.user.id,
      enrollment: enrollmentId
    });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }

    const feedback = await Feedback.create({
      employee:         req.user.id,
      course:           enrollment.course,
      batch:            enrollment.batch,
      enrollment:       enrollmentId,
      courseRating,
      trainerRating,
      courseComments,
      trainerComments,
      wouldRecommend,
      overallExperience
    });

    // Update enrollment status to Completed
    enrollment.status = 'Completed';
    await enrollment.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my feedback
// @route   GET /api/feedback/my-feedback
// @access  Private (Employee)
const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ employee: req.user.id })
      .populate('course', 'courseName courseCode trainerName')
      .populate('batch',  'batchName batchCode')
      .sort({ createdAt: -1 });

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all feedback for admin
// @route   GET /api/feedback/all
// @access  Private (Admin)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('employee', 'firstName lastName employeeId department')
      .populate('course',   'courseName courseCode trainerName')
      .populate('batch',    'batchName batchCode')
      .sort({ createdAt: -1 });

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEligibleEnrollments,
  submitFeedback,
  getMyFeedback,
  getAllFeedback
};