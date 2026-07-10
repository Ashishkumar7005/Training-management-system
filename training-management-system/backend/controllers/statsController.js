const User       = require('../models/User');
const Course     = require('../models/Course');
const Batch      = require('../models/Batch');
const Enrollment = require('../models/Enrollment');

// @desc    Get admin dashboard stats
// @route   GET /api/stats/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const [
      totalCourses,
      activeBatches,
      totalUsers,
      pendingRequests
    ] = await Promise.all([
      Course.countDocuments(),
      Batch.countDocuments({ status: 'Upcoming' }),
      User.countDocuments(),
      Enrollment.countDocuments({ status: 'Pending' })
    ]);

    res.status(200).json({
      totalCourses,
      activeBatches,
      totalUsers,
      pendingRequests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/stats/manager
// @access  Private (Manager)
const getManagerStats = async (req, res) => {
  try {
    const [
      pending,
      approved,
      rejected,
      availableBatches
    ] = await Promise.all([
      Enrollment.countDocuments({ status: 'Pending' }),
      Enrollment.countDocuments({ status: 'Approved' }),
      Enrollment.countDocuments({ status: 'Rejected' }),
      Batch.countDocuments({ status: 'Upcoming' })
    ]);

    res.status(200).json({
      pending,
      approved,
      rejected,
      availableBatches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get employee dashboard stats
// @route   GET /api/stats/employee
// @access  Private (Employee)
const getEmployeeStats = async (req, res) => {
  try {
    const [
      myEnrollments,
      pending,
      completed,
      availableCourses
    ] = await Promise.all([
      Enrollment.countDocuments({ employee: req.user.id }),
      Enrollment.countDocuments({ employee: req.user.id, status: 'Pending' }),
      Enrollment.countDocuments({ employee: req.user.id, status: 'Completed' }),
      Batch.countDocuments({ status: 'Upcoming' })
    ]);

    res.status(200).json({
      myEnrollments,
      pending,
      completed,
      availableCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminStats,
  getManagerStats,
  getEmployeeStats
};