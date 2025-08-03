const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Get all assignments
router.get('/', async (req, res) => {
    try {
        const { teacher, class: classId, subject, status, page = 1, limit = 10 } = req.query;
        const query = {};
        
        if (teacher) query.teacher = teacher;
        if (classId) query.class = classId;
        if (subject) query.subject = subject;
        if (status) query.status = status;

        const assignments = await Assignment.find(query)
            .populate('subject', 'subjectName subjectCode')
            .populate('class', 'className grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('submissions.student', 'studentId user')
            .populate({
                path: 'submissions.student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .sort({ dueDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Assignment.countDocuments(query);

        res.json({
            assignments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('subject', 'subjectName subjectCode')
            .populate('class', 'className grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('submissions.student', 'studentId user')
            .populate({
                path: 'submissions.student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .populate('submissions.gradedBy', 'teacherId user');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ message: 'Error fetching assignment' });
    }
});

// Create new assignment
router.post('/', async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        await assignment.save();
        
        const populatedAssignment = await Assignment.findById(assignment._id)
            .populate('subject', 'subjectName subjectCode')
            .populate('class', 'className grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            });

        res.status(201).json(populatedAssignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(400).json({ message: 'Error creating assignment', error: error.message });
    }
});

// Update assignment
router.put('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('subject', 'subjectName subjectCode')
        .populate('class', 'className grade')
        .populate('teacher', 'teacherId user')
        .populate({
            path: 'teacher',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(400).json({ message: 'Error updating assignment', error: error.message });
    }
});

// Submit assignment (for students)
router.post('/:id/submit', async (req, res) => {
    try {
        const { studentId, content, attachments } = req.body;
        
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if student already submitted
        const existingSubmission = assignment.submissions.find(
            sub => sub.student.toString() === studentId
        );

        if (existingSubmission && !assignment.settings.allowResubmission) {
            return res.status(400).json({ message: 'Assignment already submitted' });
        }

        const now = new Date();
        const isLate = now > assignment.dueDate;

        if (existingSubmission) {
            // Update existing submission
            existingSubmission.content = content;
            existingSubmission.attachments = attachments || [];
            existingSubmission.submittedAt = now;
            existingSubmission.isLate = isLate;
            existingSubmission.status = isLate ? 'late' : 'submitted';
        } else {
            // Create new submission
            assignment.submissions.push({
                student: studentId,
                content,
                attachments: attachments || [],
                submittedAt: now,
                isLate,
                status: isLate ? 'late' : 'submitted'
            });
        }

        await assignment.save();

        res.json({ 
            message: 'Assignment submitted successfully',
            isLate,
            submittedAt: now
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Error submitting assignment' });
    }
});

// Grade assignment submission
router.post('/:id/grade', async (req, res) => {
    try {
        const { studentId, score, feedback, gradedBy } = req.body;
        
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const submission = assignment.submissions.find(
            sub => sub.student.toString() === studentId
        );

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.score = score;
        submission.feedback = feedback;
        submission.gradedBy = gradedBy;
        submission.gradedAt = new Date();
        submission.status = 'graded';

        await assignment.save();

        res.json({ message: 'Assignment graded successfully' });
    } catch (error) {
        console.error('Error grading assignment:', error);
        res.status(500).json({ message: 'Error grading assignment' });
    }
});

// Get assignments by student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const query = {
            'submissions.student': studentId
        };

        if (status) {
            query['submissions.status'] = status;
        }

        const assignments = await Assignment.find(query)
            .populate('subject', 'subjectName subjectCode')
            .populate('class', 'className grade')
            .populate('teacher', 'teacherId user')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .sort({ dueDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Filter submissions to only show the student's submission
        const filteredAssignments = assignments.map(assignment => {
            const studentSubmission = assignment.submissions.find(
                sub => sub.student.toString() === studentId
            );
            
            return {
                ...assignment.toObject(),
                submissions: studentSubmission ? [studentSubmission] : []
            };
        });

        res.json({
            assignments: filteredAssignments,
            total: filteredAssignments.length
        });
    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({ message: 'Error fetching student assignments' });
    }
});

// Get assignment statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const stats = {
            totalSubmissions: assignment.submissions.length,
            submittedOnTime: assignment.submissions.filter(s => !s.isLate).length,
            lateSubmissions: assignment.submissions.filter(s => s.isLate).length,
            gradedSubmissions: assignment.submissions.filter(s => s.status === 'graded').length,
            averageScore: assignment.averageScore,
            dueDate: assignment.dueDate,
            isOverdue: assignment.isOverdue
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching assignment stats:', error);
        res.status(500).json({ message: 'Error fetching assignment stats' });
    }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Error deleting assignment' });
    }
});

module.exports = router;
