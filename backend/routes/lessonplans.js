const express = require('express');
const { auth, isTeacher } = require('../middleware/auth');
const router = express.Router();
const LessonPlan = require('../models/LessonPlan');

// Get all lesson plans
router.get('/', auth, async (req, res) => {
    try {
        const { teacher, class: classId, subject, date, status, page = 1, limit = 10 } = req.query;
        const query = {};
        
        if (teacher) query.teacher = teacher;
        if (classId) query.class = classId;
        if (subject) query.subject = subject;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }
        if (status) query.status = status;

        const lessonPlans = await LessonPlan.find(query)
            .populate('subject', 'name code')
            .populate('class', 'name grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('attendance.student', 'studentId user')
            .sort({ date: -1, startTime: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LessonPlan.countDocuments(query);

        res.json({
            lessonPlans,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching lesson plans:', error);
        res.status(500).json({ message: 'Error fetching lesson plans' });
    }
});

// Get lesson plan by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const lessonPlan = await LessonPlan.findById(req.params.id)
            .populate('subject', 'name code')
            .populate('class', 'name grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('attendance.student', 'studentId user');

        if (!lessonPlan) {
            return res.status(404).json({ message: 'Lesson plan not found' });
        }

        res.json(lessonPlan);
    } catch (error) {
        console.error('Error fetching lesson plan:', error);
        res.status(500).json({ message: 'Error fetching lesson plan' });
    }
});

// Create new lesson plan
router.post('/', auth, isTeacher, async (req, res) => {
    try {
        const lessonPlan = new LessonPlan(req.body);
        await lessonPlan.save();
        
        const populatedLessonPlan = await LessonPlan.findById(lessonPlan._id)
            .populate('subject', 'name code')
            .populate('class', 'name grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            });

        res.status(201).json(populatedLessonPlan);
    } catch (error) {
        console.error('Error creating lesson plan:', error);
        res.status(400).json({ message: 'Error creating lesson plan', error: error.message });
    }
});

// Update lesson plan
router.put('/:id', auth, isTeacher, async (req, res) => {
    try {
        const lessonPlan = await LessonPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('subject', 'name code')
        .populate('class', 'name grade')
        .populate('teacher', 'teacherId user')
        .populate({
            path: 'teacher',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        });

        if (!lessonPlan) {
            return res.status(404).json({ message: 'Lesson plan not found' });
        }

        res.json(lessonPlan);
    } catch (error) {
        console.error('Error updating lesson plan:', error);
        res.status(400).json({ message: 'Error updating lesson plan', error: error.message });
    }
});

// Update attendance for lesson plan
router.patch('/:id/attendance', auth, isTeacher, async (req, res) => {
    try {
        const { attendance } = req.body;
        
        const lessonPlan = await LessonPlan.findByIdAndUpdate(
            req.params.id,
            { attendance },
            { new: true }
        )
        .populate('subject', 'name code')
        .populate('class', 'name grade')
        .populate('attendance.student', 'studentId user');

        if (!lessonPlan) {
            return res.status(404).json({ message: 'Lesson plan not found' });
        }

        res.json(lessonPlan);
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(400).json({ message: 'Error updating attendance', error: error.message });
    }
});

// Delete lesson plan
router.delete('/:id', auth, isTeacher, async (req, res) => {
    try {
        const lessonPlan = await LessonPlan.findByIdAndDelete(req.params.id);
        
        if (!lessonPlan) {
            return res.status(404).json({ message: 'Lesson plan not found' });
        }

        res.json({ message: 'Lesson plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson plan:', error);
        res.status(500).json({ message: 'Error deleting lesson plan' });
    }
});

// Get teacher's daily agenda
router.get('/teacher/:teacherId/agenda', auth, async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { date } = req.query;
        
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);

        const agenda = await LessonPlan.find({
            teacher: teacherId,
            date: { $gte: startDate, $lte: endDate }
        })
        .populate('subject', 'name code')
        .populate('class', 'name grade')
        .sort({ startTime: 1 });

        res.json(agenda);
    } catch (error) {
        console.error('Error fetching teacher agenda:', error);
        res.status(500).json({ message: 'Error fetching teacher agenda' });
    }
});

module.exports = router;
