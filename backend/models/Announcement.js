const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'teachers', 'parents', 'staff'],
        default: 'all'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['general', 'academic', 'event', 'holiday', 'exam', 'fee', 'admission'],
        default: 'general'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    eventDate: {
        type: Date
    },
    attachments: [{
        filename: String,
        url: String,
        fileType: String,
        fileSize: Number
    }],
    tags: [{
        type: String,
        trim: true
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    isSticky: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
announcementSchema.index({ targetAudience: 1, isPublished: 1, publishDate: -1 });
announcementSchema.index({ category: 1, isPublished: 1 });
announcementSchema.index({ priority: 1, isPublished: 1 });
announcementSchema.index({ expiryDate: 1 });

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
    return this.readBy.length;
});

// Virtual to check if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
    return this.expiryDate && this.expiryDate < new Date();
});

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
