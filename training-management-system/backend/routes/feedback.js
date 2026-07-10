const express = require('express');
const router  = express.Router();
const {
  getEligibleEnrollments,
  submitFeedback,
  getMyFeedback,
  getAllFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/eligible',    authorize('employee'), getEligibleEnrollments);
router.post('/',           authorize('employee'), submitFeedback);
router.get('/my-feedback', authorize('employee'), getMyFeedback);
router.get('/all',         authorize('admin'),    getAllFeedback);

module.exports = router;