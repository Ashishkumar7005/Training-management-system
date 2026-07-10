const express = require('express');
const router  = express.Router();
const {
  getAvailableBatches,
  requestEnrollment,
  getMyEnrollments,
  getPendingRequests,
  getManagerRequests,
  approveEnrollment,
  rejectEnrollment,
  getAllEnrollments,
  enrollParticipant
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Employee routes
router.get('/available-batches', authorize('employee'), getAvailableBatches);
router.post('/request',          authorize('employee'), requestEnrollment);
router.get('/my-enrollments',    authorize('employee'), getMyEnrollments);

// Manager routes
router.get('/pending',           authorize('manager'),  getPendingRequests);
router.get('/manager-requests',  authorize('manager'),  getManagerRequests);
router.put('/:id/approve',       authorize('manager'),  approveEnrollment);
router.put('/:id/reject',        authorize('manager'),  rejectEnrollment);

// Admin routes
router.get('/all',               authorize('admin'),    getAllEnrollments);
router.put('/:id/enroll',        authorize('admin'),    enrollParticipant);

module.exports = router;