const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('manager', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { username, email, employeeId, role } = req.body;

    // Prevent creating admin
    if (role === 'admin') {
      return res.status(400).json({ message: 'Cannot create admin users' });
    }

    // Check employeeId exists
    const empIdExists = await User.findOne({ employeeId });
    if (empIdExists) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Check username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create(req.body);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id:         user._id,
        employeeId: user.employeeId,
        username:   user.username,
        firstName:  user.firstName,
        lastName:   user.lastName,
        email:      user.email,
        role:       user.role,
        isActive:   user.isActive
      }
    });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent updating admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot update admin users' });
    }

    // Prevent changing role to admin
    if (req.body.role === 'admin') {
      return res.status(400).json({ message: 'Cannot assign admin role' });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password;
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'User updated successfully',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get all managers
// @route GET /api/users/managers
// @access Private
const getManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: 'manager',
      isActive: true
    }).select('firstName lastName employeeId');

    res.status(200).json({ managers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getManagers
};