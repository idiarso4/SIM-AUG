const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
} = require('../controllers/subjectController');

const router = express.Router();

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get('/', auth, getAllSubjects);

// @route   POST /api/subjects
// @desc    Create subject
// @access  Private (Admin)
router.post('/', auth, isAdmin, createSubject);

// @route   GET /api/subjects/:id
// @desc    Get subject by ID
// @access  Private
router.get('/:id', auth, getSubjectById);

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private (Admin)
router.put('/:id', auth, isAdmin, updateSubject);

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, deleteSubject);

module.exports = router;
