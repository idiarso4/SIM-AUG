const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
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
    assignmentType: {
        type: String,
        enum: ['homework', 'project', 'essay', 'research', 'presentation', 'lab', 'quiz'],
        default: 'homework'
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    totalPoints: {
        type: Number,
        default: 100,
        min: 1
    },
    instructions: {
        type: String,
        trim: true
    },
    attachments: [{
        filename: String,
        url: String,
        fileType: String,
        fileSize: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    rubric: [{
        criteria: String,
        maxPoints: Number,
        description: String
    }],
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        content: String,
        attachments: [{
            filename: String,
            url: String,
            fileType: String,
            fileSize: Number
        }],
        score: {
            type: Number,
            min: 0
        },
        feedback: String,
        gradedAt: Date,
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        },
        status: {
            type: String,
            enum: ['submitted', 'late', 'graded', 'returned'],
            default: 'submitted'
        },
        isLate: {
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'archived'],
        default: 'draft'
    },
    allowLateSubmissions: {
        type: Boolean,
        default: true
    },
    latePenalty: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
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
    settings: {
        allowResubmission: {
            type: Boolean,
            default: false
        },
        showScoreToStudents: {
            type: Boolean,
            default: true
        },
        requireFileUpload: {
            type: Boolean,
            default: false
        },
        maxFileSize: {
            type: Number,
            default: 10 // MB
        },
        allowedFileTypes: [String]
    }
}, {
    timestamps: true
});

// Index for efficient queries
assignmentSchema.index({ teacher: 1, dueDate: -1 });
assignmentSchema.index({ class: 1, dueDate: -1 });
assignmentSchema.index({ subject: 1, dueDate: -1 });
assignmentSchema.index({ status: 1, dueDate: -1 });
assignmentSchema.index({ academicYear: 1, semester: 1 });

// Virtual for submission count
assignmentSchema.virtual('submissionCount').get(function() {
    return this.submissions.length;
});

// Virtual for average score
assignmentSchema.virtual('averageScore').get(function() {
    const gradedSubmissions = this.submissions.filter(s => s.score !== undefined);
    if (gradedSubmissions.length === 0) return 0;
    const total = gradedSubmissions.reduce((sum, s) => sum + s.score, 0);
    return total / gradedSubmissions.length;
});

// Virtual to check if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
    return this.dueDate < new Date();
});

// Pre-save middleware to mark late submissions
assignmentSchema.pre('save', function(next) {
    this.submissions.forEach(submission => {
        if (submission.submittedAt > this.dueDate) {
            submission.isLate = true;
        }
    });
    next();
});

// Ensure virtual fields are serialized
assignmentSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
