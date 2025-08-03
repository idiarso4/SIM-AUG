const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nisn: {
        type: String,
        unique: true,
        sparse: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    religion: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        default: 'Indonesia'
    },
    currentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: null
    },
    parentInfo: {
        father: {
            name: String,
            occupation: String,
            phoneNumber: String,
            email: String
        },
        mother: {
            name: String,
            occupation: String,
            phoneNumber: String,
            email: String
        },
        guardian: {
            name: String,
            relationship: String,
            phoneNumber: String,
            email: String
        }
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    medicalInfo: {
        allergies: [String],
        medications: [String],
        medicalConditions: [String]
    },
    enrollmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    graduationDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'graduated', 'transferred', 'dropped_out', 'suspended'],
        default: 'active'
    },
    documents: [{
        name: String,
        url: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Generate student ID
studentSchema.pre('save', async function(next) {
    if (!this.studentId) {
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments();
        this.studentId = `${year}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);
