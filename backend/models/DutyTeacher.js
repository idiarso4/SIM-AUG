const mongoose = require('mongoose');

const dutyTeacherSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shift: {
        type: String,
        enum: ['morning', 'afternoon', 'full_day'],
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
    location: {
        type: String,
        default: 'Main Gate'
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Student Permission Request Schema
const studentPermissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    dutyTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DutyTeacher',
        required: true
    },
    permissionType: {
        type: String,
        enum: ['leave_early', 'arrive_late', 'skip_class', 'emergency', 'medical', 'family_matter'],
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    approvedAt: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    parentContact: {
        name: String,
        phone: String,
        contacted: {
            type: Boolean,
            default: false
        },
        contactedAt: Date
    },
    actualExitTime: {
        type: Date
    },
    actualReturnTime: {
        type: Date
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    medicalNote: {
        hasNote: {
            type: Boolean,
            default: false
        },
        noteUrl: String,
        issuedBy: String,
        validUntil: Date
    },
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpNotes: String,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    }
}, {
    timestamps: true
});

// Gate Log Schema for tracking entries and exits
const gateLogSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    dutyTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DutyTeacher',
        required: true
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPermission'
    },
    logType: {
        type: String,
        enum: ['entry', 'exit', 'return'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isAuthorized: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        default: 'Main Gate'
    },
    verificationMethod: {
        type: String,
        enum: ['manual', 'id_card', 'biometric', 'parent_pickup'],
        default: 'manual'
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
dutyTeacherSchema.index({ teacher: 1, date: 1 });
dutyTeacherSchema.index({ date: 1, shift: 1 });
dutyTeacherSchema.index({ status: 1, date: 1 });

studentPermissionSchema.index({ student: 1, requestedAt: -1 });
studentPermissionSchema.index({ dutyTeacher: 1, status: 1 });
studentPermissionSchema.index({ status: 1, startTime: 1 });
studentPermissionSchema.index({ permissionType: 1, status: 1 });

gateLogSchema.index({ student: 1, timestamp: -1 });
gateLogSchema.index({ dutyTeacher: 1, timestamp: -1 });
gateLogSchema.index({ logType: 1, timestamp: -1 });

// Virtual for duty duration
dutyTeacherSchema.virtual('duration').get(function() {
    const start = new Date(`1970-01-01T${this.startTime}:00`);
    const end = new Date(`1970-01-01T${this.endTime}:00`);
    return Math.round((end - start) / (1000 * 60 * 60)); // hours
});

// Virtual for permission duration
studentPermissionSchema.virtual('duration').get(function() {
    if (!this.endTime) return null;
    return Math.round((this.endTime - this.startTime) / (1000 * 60)); // minutes
});

// Virtual to check if permission is expired
studentPermissionSchema.virtual('isExpired').get(function() {
    if (this.status !== 'approved') return false;
    const now = new Date();
    return this.endTime ? now > this.endTime : now > this.startTime;
});

// Ensure virtual fields are serialized
dutyTeacherSchema.set('toJSON', { virtuals: true });
studentPermissionSchema.set('toJSON', { virtuals: true });
gateLogSchema.set('toJSON', { virtuals: true });

const DutyTeacher = mongoose.model('DutyTeacher', dutyTeacherSchema);
const StudentPermission = mongoose.model('StudentPermission', studentPermissionSchema);
const GateLog = mongoose.model('GateLog', gateLogSchema);

module.exports = {
    DutyTeacher,
    StudentPermission,
    GateLog
};
