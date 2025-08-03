const Subject = require('../models/Subject');

// Get all subjects
const getAllSubjects = async (req, res) => {
    try {
// Removed demo data handling
        
        const subjects = await Subject.find().populate('prerequisites').populate('createdBy', 'firstName lastName');
        res.json({ subjects });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subjects', error: error.message });
    }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('prerequisites').populate('createdBy', 'firstName lastName');
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ subject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subject', error: error.message });
    }
};

// Create new subject
const createSubject = async (req, res) => {
    try {
        const newSubject = new Subject({
            ...req.body,
            createdBy: req.user._id
        });
        await newSubject.save();
        res.status(201).json({ message: 'Subject created successfully', subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subject', error: error.message });
    }
};

// Update subject
const updateSubject = async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('prerequisites').populate('createdBy', 'firstName lastName');
        if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject updated successfully', subject: updatedSubject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subject', error: error.message });
    }
};

// Delete subject
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subject', error: error.message });
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};
