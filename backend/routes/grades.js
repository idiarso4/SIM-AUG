const express = require('express');
const { auth, isTeacher } = require('../middleware/auth');
const {
    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade
} = require('../controllers/gradeController');

const router = express.Router();

// @route   GET /api/grades
// @desc    Get all grades
// @access  Private (Teacher)
router.get('/', auth, isTeacher, getAllGrades);

// @route   POST /api/grades
// @desc    Create grade
// @access  Private (Teacher)
router.post('/', auth, isTeacher, createGrade);

// @route   GET /api/grades/:id
// @desc    Get grade by ID
// @access  Private
router.get('/:id', auth, getGradeById);

// @route   PUT /api/grades/:id
// @desc    Update grade
// @access  Private (Teacher)
router.put('/:id', auth, isTeacher, updateGrade);

// @route   DELETE /api/grades/:id
// @desc    Delete grade
// @access  Private (Teacher)
router.delete('/:id', auth, isTeacher, deleteGrade);

module.exports = router;
