const express = require('express');
const { auth, canManageUsers } = require('../middleware/auth');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/', auth, canManageUsers, getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin)
router.get('/:id', auth, canManageUsers, getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin)
// @route   POST /api/users
// @desc    Create user
// @access  Private (Admin)
router.post('/', auth, canManageUsers, createUser);

router.put('/:id', auth, canManageUsers, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/:id', auth, canManageUsers, deleteUser);

module.exports = router;
