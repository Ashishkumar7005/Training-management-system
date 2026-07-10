const express = require('express');
const router  = express.Router();
const {
  getCourseCalendarReport,
  getEnrollmentRequestsReport,
  getEnrollmentStatusReport
} = require('../controllers/reportsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/course-calendar',     getCourseCalendarReport);
router.get('/enrollment-requests', getEnrollmentRequestsReport);
router.get('/enrollment-status',   getEnrollmentStatusReport);

module.exports = router;