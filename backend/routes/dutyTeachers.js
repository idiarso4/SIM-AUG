const express = require('express');
const router = express.Router();
const { DutyTeacher, StudentPermission, GateLog } = require('../models/DutyTeacher');

// Get all duty schedules
router.get('/', async (req, res) => {
    try {
        const { teacher, status, date, page = 1, limit = 10 } = req.query;
        const query = {};

        if (teacher) query.teacher = teacher;
        if (status) query.status = status;
        if (date) query.date = { $gte: new Date(date).setHours(0, 0, 0), $lt: new Date(date).setHours(23, 59, 59) };

        const schedules = await DutyTeacher.find(query)
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .sort({ date: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await DutyTeacher.countDocuments(query);

        res.json({
            schedules,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching duty schedules:', error);
        res.status(500).json({ message: 'Error fetching schedules' });
    }
});

// Create new duty schedule
router.post('/', async (req, res) => {
    try {
        const schedule = new DutyTeacher(req.body);
        await schedule.save();

        const populatedSchedule = await DutyTeacher.findById(schedule._id)
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            });

        res.status(201).json(populatedSchedule);
    } catch (error) {
        console.error('Error creating duty schedule:', error);
        res.status(400).json({ message: 'Error creating schedule', error: error.message });
    }
});

// Update duty schedule
router.put('/:id', async (req, res) => {
    try {
        const schedule = await DutyTeacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('teacher', 'teacherId user')
        .populate({
            path: 'teacher',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Duty schedule not found' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error updating duty schedule:', error);
        res.status(400).json({ message: 'Error updating duty schedule', error: error.message });
    }
});

// Delete duty schedule
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await DutyTeacher.findByIdAndDelete(req.params.id);

        if (!schedule) {
            return res.status(404).json({ message: 'Duty schedule not found' });
        }

        res.json({ message: 'Duty schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting duty schedule:', error);
        res.status(500).json({ message: 'Error deleting duty schedule' });
    }
});

// Get all student permissions
router.get('/permissions', async (req, res) => {
    try {
        const { student, dutyTeacher, status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (student) query.student = student;
        if (dutyTeacher) query.dutyTeacher = dutyTeacher;
        if (status) query.status = status;

        const permissions = await StudentPermission.find(query)
            .populate('student', 'studentId user')
            .populate('dutyTeacher', 'teacher date')
            .sort({ requestedAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await StudentPermission.countDocuments(query);

        res.json({
            permissions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching student permissions:', error);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
});

// Create new student permission request
router.post('/permissions', async (req, res) => {
    try {
        const permission = new StudentPermission(req.body);
        await permission.save();

        const populatedPermission = await StudentPermission.findById(permission._id)
            .populate('student', 'studentId user')
            .populate('dutyTeacher', 'teacher date');

        res.status(201).json(populatedPermission);
    } catch (error) {
        console.error('Error creating student permission:', error);
        res.status(400).json({ message: 'Error creating permission', error: error.message });
    }
});

// Approve or reject student permission
router.patch('/permissions/:id', async (req, res) => {
    try {
        const { status, approvedBy, approvedAt, rejectionReason } = req.body;

        const permission = await StudentPermission.findById(req.params.id);

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        permission.status = status || permission.status;
        permission.approvedBy = approvedBy || permission.approvedBy;
        permission.approvedAt = approvedAt || permission.approvedAt;
        permission.rejectionReason = rejectionReason || permission.rejectionReason;

        await permission.save();

        res.json(permission);
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ message: 'Error updating permission' });
    }
});

module.exports = router;

