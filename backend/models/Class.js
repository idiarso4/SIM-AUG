const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    grade: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    section: {
        type: String,
        required: true,
        trim: true
    },
    academicYear: {
        type: String,
        required: true
    },
    homeroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    maxCapacity: {
        type: Number,
        default: 30
    },
    room: {
        type: String,
        trim: true
    },
    schedule: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            required: true
        },
        periods: [{
            periodNumber: {
                type: Number,
                required: true
            },
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject'
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teacher'
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }]
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

// Virtual for current student count
classSchema.virtual('currentStudentCount').get(function() {
    return this.students.length;
});

// Virtual to check if class is full
classSchema.virtual('isFull').get(function() {
    return this.students.length >= this.maxCapacity;
});

// Ensure virtual fields are serialized
classSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Class', classSchema);
