const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Get all permissions
router.get('/', async (req, res) => {
    try {
        const { status, type, page = 1, limit = 10 } = req.query;
        const query = {};
        
        if (status) query.status = status;
        if (type) query.type = type;

        const permissions = await Permission.find(query)
            .populate('student', 'studentId user')
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('approvedBy', 'teacherId user')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Permission.countDocuments(query);

        res.json({
            permissions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
});

// Get permission by ID
router.get('/:id', async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id)
            .populate('student', 'studentId user')
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('approvedBy', 'teacherId user');

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json(permission);
    } catch (error) {
        console.error('Error fetching permission:', error);
        res.status(500).json({ message: 'Error fetching permission' });
    }
});

// Create new permission
router.post('/', async (req, res) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        
        const populatedPermission = await Permission.findById(permission._id)
            .populate('student', 'studentId user')
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            });

        res.status(201).json(populatedPermission);
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(400).json({ message: 'Error creating permission', error: error.message });
    }
});

// Update permission
router.put('/:id', async (req, res) => {
    try {
        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('student', 'studentId user')
        .populate({
            path: 'student',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        })
        .populate('approvedBy', 'teacherId user');

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json(permission);
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(400).json({ message: 'Error updating permission', error: error.message });
    }
});

// Approve/Reject permission
router.patch('/:id/approve', async (req, res) => {
    try {
        const { status, notes, approvedBy } = req.body;
        
        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            {
                status,
                notes,
                approvedBy,
                approvedAt: new Date()
            },
            { new: true }
        )
        .populate('student', 'studentId user')
        .populate({
            path: 'student',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        })
        .populate('approvedBy', 'teacherId user');

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json(permission);
    } catch (error) {
        console.error('Error approving permission:', error);
        res.status(400).json({ message: 'Error approving permission', error: error.message });
    }
});

// Delete permission
router.delete('/:id', async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ message: 'Error deleting permission' });
    }
});

module.exports = router;
