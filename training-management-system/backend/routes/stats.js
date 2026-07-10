const express = require('express');
const router  = express.Router();
const {
  getAdminStats,
  getManagerStats,
  getEmployeeStats
} = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/admin',    authorize('admin'),    getAdminStats);
router.get('/manager',  authorize('manager'),  getManagerStats);
router.get('/employee', authorize('employee'), getEmployeeStats);

module.exports = router;