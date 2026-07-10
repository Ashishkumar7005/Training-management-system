const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get available batches for employee
const getAvailableBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ status: 'Upcoming' })
      .populate('course', 'courseName courseCode category trainingMode duration durationUnit')
      .sort({ startDate: 1 });

    const enrollments = await Enrollment.find({ employee: req.user.id });
    const enrollmentMap = {};
    enrollments.forEach(e => {
      enrollmentMap[e.batch.toString()] = e.status;
    });

    const batchesWithStatus = batches.map(b => ({
      ...b.toObject(),
      alreadyRequested: !!enrollmentMap[b._id.toString()],
      requestStatus:    enrollmentMap[b._id.toString()] || null,
      availableSpots:   b.maxParticipants - (b.enrolledParticipants?.length || 0)
    }));

    res.status(200).json({ batches: batchesWithStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request enrollment
const requestEnrollment = async (req, res) => {
  try {
    const { batchId } = req.body;

    const batch = await Batch.findById(batchId).populate('course');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const availableSpots = batch.maxParticipants - (batch.enrolledParticipants?.length || 0);
    if (availableSpots <= 0) {
      return res.status(400).json({ message: 'No available spots in this batch' });
    }

    const existing = await Enrollment.findOne({
      employee: req.user.id,
      batch: batchId
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already requested enrollment for this batch' });
    }

    // ← Get the employee's assigned manager
    const employee = await User.findById(req.user.id);
    const managerId = employee?.manager || null;

    if (!managerId) {
      return res.status(400).json({ message: 'You do not have an assigned manager. Please contact admin.' });
    }

    const enrollment = await Enrollment.create({
      employee:    req.user.id,
      batch:       batchId,
      course:      batch.course._id,
      manager:     managerId,
      status:      'Pending',
      requestedAt: new Date()
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('batch',  'batchName batchCode startDate endDate')
      .populate('course', 'courseName courseCode');

    res.status(201).json({
      message: 'Enrollment request submitted successfully',
      enrollment: populated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my enrollments
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ employee: req.user.id })
      .populate('batch',   'batchName batchCode startDate endDate startTime endTime venue')
      .populate('course',  'courseName courseCode category trainingMode')
      .populate('manager', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get pending requests for manager
// const getPendingRequests = async (req, res) => {
//   try {
//     const enrollments = await Enrollment.find({ status: 'Pending' })
//       .populate('employee', 'firstName lastName email username')
//       .populate('batch',    'batchName batchCode startDate endDate')
//       .populate('course',   'courseName courseCode category')
//       .sort({ requestedAt: -1 });

//     res.status(200).json({ enrollments });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// @desc    Get all requests for manager
const getManagerRequests = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      manager: req.user.id,  // ← only show this manager's requests
      status: { $in: ['Pending', 'Approved', 'Rejected'] }
    })
      .populate('employee', 'firstName lastName email username employeeId')
      .populate('batch',    'batchName batchCode startDate endDate')
      .populate('course',   'courseName courseCode category')
      .sort({ createdAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      manager: req.user.id,  // ← only this manager's pending requests
      status: 'Pending'
    })
      .populate('employee', 'firstName lastName email username employeeId')
      .populate('batch',    'batchName batchCode startDate endDate')
      .populate('course',   'courseName courseCode category')
      .sort({ requestedAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve enrollment
const approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be approved' });
    }

    enrollment.status     = 'Approved';
    enrollment.manager    = req.user.id;
    enrollment.approvedAt = new Date();
    await enrollment.save();

    res.status(200).json({
      message: 'Enrollment request approved successfully',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject enrollment
const rejectEnrollment = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be rejected' });
    }

    enrollment.status          = 'Rejected';
    enrollment.manager         = req.user.id;
    enrollment.rejectionReason = reason;
    enrollment.rejectedAt      = new Date();
    await enrollment.save();

    res.status(200).json({
      message: 'Enrollment request rejected',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all enrollments for admin
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('employee', 'firstName lastName email username')
      .populate('batch',    'batchName batchCode startDate endDate')
      .populate('course',   'courseName courseCode category')
      .populate('manager',  'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Enroll participant into batch
const enrollParticipant = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status !== 'Approved') {
      return res.status(400).json({ message: 'Only approved requests can be enrolled' });
    }

    const batch = await Batch.findById(enrollment.batch);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (batch.enrolledParticipants.includes(enrollment.employee)) {
      return res.status(400).json({ message: 'Participant already enrolled in this batch' });
    }

    if (batch.enrolledParticipants.length >= batch.maxParticipants) {
      return res.status(400).json({ message: 'Batch is full' });
    }

    batch.enrolledParticipants.push(enrollment.employee);
    await batch.save();

    enrollment.status     = 'Enrolled';
    enrollment.enrolledAt = new Date();
    await enrollment.save();

    res.status(200).json({
      message: 'Participant enrolled successfully',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailableBatches,
  requestEnrollment,
  getMyEnrollments,
  getPendingRequests,
  getManagerRequests,
  approveEnrollment,
  rejectEnrollment,
  getAllEnrollments,
  enrollParticipant
};