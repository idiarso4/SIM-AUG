const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    dateOfHire: {
        type: Date,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate teacher ID
teacherSchema.pre('save', async function(next) {
    if (!this.teacherId) {
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments();
        this.teacherId = `T${year}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
