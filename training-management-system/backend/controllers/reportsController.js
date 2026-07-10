const Enrollment = require('../models/Enrollment');
const Batch      = require('../models/Batch');
const Course     = require('../models/Course');
const User       = require('../models/User');

// @desc    Get course calendar report
// @route   GET /api/reports/course-calendar
// @access  Private (Admin)
const getCourseCalendarReport = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('course', 'courseName courseCode category trainingMode duration durationUnit')
      .sort({ startDate: 1 });

    res.status(200).json({ batches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get participant enrollment requests report
// @route   GET /api/reports/enrollment-requests
// @access  Private (Admin)
const getEnrollmentRequestsReport = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('employee', 'firstName lastName email employeeId department')
      .populate('batch',    'batchName batchCode startDate endDate')
      .populate('course',   'courseName courseCode category')
      .populate('manager',  'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get enrollment status summary report
// @route   GET /api/reports/enrollment-status
// @access  Private (Admin)
const getEnrollmentStatusReport = async (req, res) => {
  try {
    const [
      requested,
      approved,
      rejected,
      enrolled,
      completed,
      total
    ] = await Promise.all([
      Enrollment.countDocuments({ status: 'Pending' }),
      Enrollment.countDocuments({ status: 'Approved' }),
      Enrollment.countDocuments({ status: 'Rejected' }),
      Enrollment.countDocuments({ status: 'Enrolled' }),
      Enrollment.countDocuments({ status: 'Completed' }),
      Enrollment.countDocuments()
    ]);

    // Per course breakdown
    const courses = await Course.find();
    const courseBreakdown = await Promise.all(
      courses.map(async (c) => {
        const count = await Enrollment.countDocuments({ course: c._id });
        return {
          courseName: c.courseName,
          courseCode: c.courseCode,
          total:      count
        };
      })
    );

    res.status(200).json({
      summary: { requested, approved, rejected, enrolled, completed, total },
      courseBreakdown: courseBreakdown.filter(c => c.total > 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourseCalendarReport,
  getEnrollmentRequestsReport,
  getEnrollmentStatusReport
};