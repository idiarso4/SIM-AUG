const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    category: {
        type: String,
        required: true,
        enum: ['core', 'elective', 'mandatory', 'optional']
    },
    grades: [{
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }],
    department: {
        type: String,
        trim: true
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
