const Class = require('../models/Class');

// Get all classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('homeroom').populate('students');
        res.json({ classes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve classes', error: error.message });
    }
};

// Get class by ID
const getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id).populate('homeroom').populate('students');
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.json({ class: classData });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve class', error: error.message });
    }
};

// Create new class
const createClass = async (req, res) => {
    try {
        const newClass = new Class(req.body);
        await newClass.save();
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create class', error: error.message });
    }
};

// Update class
const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('homeroom').populate('students');
        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
        res.json({ message: 'Class updated successfully', class: updatedClass });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update class', error: error.message });
    }
};

// Delete class
const deleteClass = async (req, res) => {
    try {
        const classData = await Class.findByIdAndDelete(req.params.id);
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete class', error: error.message });
    }
};

module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
};
