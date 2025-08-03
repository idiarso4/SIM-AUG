const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacherController');

const router = express.Router();

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get('/', auth, getAllTeachers);

// @route   POST /api/teachers
// @desc    Create teacher
// @access  Private (Admin)
router.post('/', auth, isAdmin, createTeacher);

// @route   GET /api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', auth, getTeacherById);

// @route   PUT /api/teachers/:id
// @desc    Update teacher
// @access  Private (Admin)
router.put('/:id', auth, isAdmin, updateTeacher);

// @route   DELETE /api/teachers/:id
// @desc    Delete teacher
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, deleteTeacher);

module.exports = router;
