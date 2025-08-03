const Student = require('../models/Student');

// Get all students
const getAllStudents = async (req, res) => {
    try {
// Removed demo data handling
        
        const students = await Student.find().populate('user', '-password');
        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve students', error: error.message });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user', '-password');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ student });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve student', error: error.message });
    }
};

// Create new student
const createStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully', student: newStudent });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create student', error: error.message });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', '-password');
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update student', error: error.message });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error: error.message });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
