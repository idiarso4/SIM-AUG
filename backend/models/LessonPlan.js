const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema({
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
    objectives: [String],
    materials: [{
        name: String,
        type: {
            type: String,
            enum: ['document', 'video', 'audio', 'image', 'link']
        },
        url: String,
        description: String
    }],
    activities: [{
        name: String,
        duration: Number, // in minutes
        description: String
    }],
    homework: {
        title: String,
        description: String,
        dueDate: Date,
        attachments: [{
            filename: String,
            url: String
        }]
    },
    status: {
        type: String,
        enum: ['planned', 'ongoing', 'completed', 'cancelled'],
        default: 'planned'
    },
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            default: 'present'
        },
        notes: String
    }],
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
lessonPlanSchema.index({ teacher: 1, date: 1 });
lessonPlanSchema.index({ class: 1, date: 1 });
lessonPlanSchema.index({ subject: 1, date: 1 });
lessonPlanSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);
