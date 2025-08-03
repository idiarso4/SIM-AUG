const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
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
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        enum: ['1', '2'],
        required: true
    },
    assessmentType: {
        type: String,
        enum: ['daily', 'quiz', 'midterm', 'final', 'project', 'presentation'],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    maxScore: {
        type: Number,
        default: 100
    },
    weight: {
        type: Number,
        default: 1,
        min: 0.1,
        max: 5
    },
    description: {
        type: String,
        trim: true
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    gradedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
gradeSchema.index({ student: 1, subject: 1, academicYear: 1, semester: 1 });
gradeSchema.index({ class: 1, subject: 1, academicYear: 1, semester: 1 });

// Virtual for percentage score
gradeSchema.virtual('percentage').get(function() {
    return (this.score / this.maxScore) * 100;
});

// Virtual for letter grade
gradeSchema.virtual('letterGrade').get(function() {
    const percentage = this.percentage;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
});

// Ensure virtual fields are serialized
gradeSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Grade', gradeSchema);
