const mongoose = require('mongoose');

const cbtSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    questions: [{
        content: String,
        type: {
            type: String,
            enum: ['multiple-choice', 'essay'],
            required: true
        },
        options: [String],
        correctAnswer: String,
        score: Number
    }],
    totalScore: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    results: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        score: Number,
        submittedAt: Date,
        answers: [{
            questionIndex: Number,
            answer: String
        }]
    }]
}, {
    timestamps: true
});

// Index for efficient queries
cbtSchema.index({ teacher: 1, date: 1 });
cbtSchema.index({ class: 1, date: 1 });
cbtSchema.index({ subject: 1, date: 1 });

module.exports = mongoose.model('CBT', cbtSchema);
