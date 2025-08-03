const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} = require('../controllers/classController');

const router = express.Router();

// @route   GET /api/classes
// @desc    Get all classes
// @access  Private
router.get('/', auth, getAllClasses);

// @route   POST /api/classes
// @desc    Create class
// @access  Private (Admin)
router.post('/', auth, isAdmin, createClass);

// @route   GET /api/classes/:id
// @desc    Get class by ID
// @access  Private
router.get('/:id', auth, getClassById);

// @route   PUT /api/classes/:id
// @desc    Update class
// @access  Private (Admin)
router.put('/:id', auth, isAdmin, updateClass);

// @route   DELETE /api/classes/:id
// @desc    Delete class
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, deleteClass);

module.exports = router;
