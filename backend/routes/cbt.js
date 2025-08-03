const express = require('express');
const router = express.Router();
const CBT = require('../models/CBT');

// Get all CBT tests
router.get('/', async (req, res) => {
    try {
        const { teacher, class: classId, subject, status, page = 1, limit = 10 } = req.query;
        const query = {};
        
        if (teacher) query.teacher = teacher;
        if (classId) query.class = classId;
        if (subject) query.subject = subject;
        if (status) query.status = status;

        const tests = await CBT.find(query)
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
            .sort({ date: -1, startTime: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await CBT.countDocuments(query);

        res.json({
            tests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching CBT tests:', error);
        res.status(500).json({ message: 'Error fetching CBT tests' });
    }
});

// Get CBT test by ID
router.get('/:id', async (req, res) => {
    try {
        const test = await CBT.findById(req.params.id)
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
            .populate('results.student', 'studentId user');

        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        res.json(test);
    } catch (error) {
        console.error('Error fetching CBT test:', error);
        res.status(500).json({ message: 'Error fetching CBT test' });
    }
});

// Get CBT test for student (without correct answers)
router.get('/:id/student', async (req, res) => {
    try {
        const test = await CBT.findById(req.params.id)
            .populate('subject', 'name code')
            .populate('class', 'name grade')
            .select('-questions.correctAnswer');

        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        if (test.status !== 'active') {
            return res.status(400).json({ message: 'Test is not active' });
        }

        res.json(test);
    } catch (error) {
        console.error('Error fetching CBT test for student:', error);
        res.status(500).json({ message: 'Error fetching CBT test' });
    }
});

// Create new CBT test
router.post('/', async (req, res) => {
    try {
        const test = new CBT(req.body);
        await test.save();
        
        const populatedTest = await CBT.findById(test._id)
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

        res.status(201).json(populatedTest);
    } catch (error) {
        console.error('Error creating CBT test:', error);
        res.status(400).json({ message: 'Error creating CBT test', error: error.message });
    }
});

// Update CBT test
router.put('/:id', async (req, res) => {
    try {
        const test = await CBT.findByIdAndUpdate(
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

        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        res.json(test);
    } catch (error) {
        console.error('Error updating CBT test:', error);
        res.status(400).json({ message: 'Error updating CBT test', error: error.message });
    }
});

// Submit CBT answers
router.post('/:id/submit', async (req, res) => {
    try {
        const { studentId, answers } = req.body;
        
        const test = await CBT.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        if (test.status !== 'active') {
            return res.status(400).json({ message: 'Test is not active' });
        }

        // Check if student already submitted
        const existingResult = test.results.find(result => 
            result.student.toString() === studentId
        );
        
        if (existingResult) {
            return res.status(400).json({ message: 'Student has already submitted this test' });
        }

        // Calculate score
        let score = 0;
        answers.forEach((answer, index) => {
            if (test.questions[answer.questionIndex] && 
                test.questions[answer.questionIndex].correctAnswer === answer.answer) {
                score += test.questions[answer.questionIndex].score;
            }
        });

        // Add result to test
        test.results.push({
            student: studentId,
            score,
            submittedAt: new Date(),
            answers
        });

        await test.save();

        res.json({ 
            message: 'Test submitted successfully', 
            score,
            totalScore: test.totalScore 
        });
    } catch (error) {
        console.error('Error submitting CBT test:', error);
        res.status(400).json({ message: 'Error submitting test', error: error.message });
    }
});

// Get test results
router.get('/:id/results', async (req, res) => {
    try {
        const test = await CBT.findById(req.params.id)
            .populate('results.student', 'studentId user')
            .populate({
                path: 'results.student',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            });

        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        res.json({
            title: test.title,
            totalScore: test.totalScore,
            results: test.results
        });
    } catch (error) {
        console.error('Error fetching test results:', error);
        res.status(500).json({ message: 'Error fetching test results' });
    }
});

// Delete CBT test
router.delete('/:id', async (req, res) => {
    try {
        const test = await CBT.findByIdAndDelete(req.params.id);
        
        if (!test) {
            return res.status(404).json({ message: 'CBT test not found' });
        }

        res.json({ message: 'CBT test deleted successfully' });
    } catch (error) {
        console.error('Error deleting CBT test:', error);
        res.status(500).json({ message: 'Error deleting CBT test' });
    }
});

module.exports = router;
