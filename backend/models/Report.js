const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true // createdAt, updatedAt otomatis
});

module.exports = mongoose.model('Report', ReportSchema);