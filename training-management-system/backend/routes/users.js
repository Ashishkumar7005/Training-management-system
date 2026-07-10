const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getManagers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/managers', getManagers);

// router.get('/managers', protect, async (req, res) => {
// try {
//   const managers = await User.find({ role: 'manager', isActive: true })
//   .select('firstName lastName employeeId')
//   .sort({ firstName: 1 });
//     res.status(200).json({ managers });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/toggle-status', toggleUserStatus);

module.exports = router;