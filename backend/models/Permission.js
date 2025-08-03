const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    type: {
        type: String,
        enum: ['keluar', 'masuk', 'sakit', 'izin', 'alpha'],
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    attachments: [{
        filename: String,
        url: String,
        fileType: String
    }],
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    approvedAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
permissionSchema.index({ student: 1, startDate: 1 });
permissionSchema.index({ status: 1, createdAt: -1 });
permissionSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
