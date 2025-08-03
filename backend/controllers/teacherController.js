const Teacher = require('../models/Teacher');

// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
// Removed demo data handling
        
        const teachers = await Teacher.find().populate('user', '-password').populate('subjects').populate('classes');
        res.json({ teachers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve teachers', error: error.message });
    }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('user', '-password').populate('subjects').populate('classes');
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json({ teacher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve teacher', error: error.message });
    }
};

// Create new teacher
const createTeacher = async (req, res) => {
    try {
        const newTeacher = new Teacher(req.body);
        await newTeacher.save();
        res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create teacher', error: error.message });
    }
};

// Update teacher
const updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('user', '-password').populate('subjects').populate('classes');
        if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update teacher', error: error.message });
    }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete teacher', error: error.message });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
