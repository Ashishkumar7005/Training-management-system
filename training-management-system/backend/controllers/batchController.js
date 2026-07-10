const Batch = require('../models/Batch');
const Course = require('../models/Course');

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('course', 'courseName courseCode category')
      .populate('createdBy', 'firstName lastName')
      .populate('enrolledParticipants', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: batches.length, batches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Private
const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course', 'courseName courseCode category')
      .populate('enrolledParticipants', 'firstName lastName email');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ batch });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create batch
// @route   POST /api/batches
// @access  Private (Admin only)
const createBatch = async (req, res) => {
  try {
    // Check if batch code exists
    const existing = await Batch.findOne({
      batchCode: req.body.batchCode?.toUpperCase()
    });

    if (existing) {
      return res.status(400).json({ message: 'Batch code already exists' });
    }

    // Validate dates
    if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const batch = await Batch.create({
      ...req.body,
      createdBy: req.user.id
    });

    const populated = await Batch.findById(batch._id)
      .populate('course', 'courseName courseCode');

    res.status(201).json({
      message: 'Batch created successfully',
      batch: populated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private (Admin only)
const updateBatch = async (req, res) => {
  try {
    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'courseName courseCode');

    res.status(200).json({
      message: 'Batch updated successfully',
      batch
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private (Admin only)
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await Batch.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch
};