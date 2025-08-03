const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', auth, getAllStudents);

// @route   POST /api/students
// @desc    Create student
// @access  Private (Admin)
router.post('/', auth, isAdmin, createStudent);

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', auth, getStudentById);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin)
router.put('/:id', auth, isAdmin, updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, deleteStudent);

module.exports = router;
