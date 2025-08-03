const Report = require('../models/Report');

// Create report
exports.createReport = async (req, res) => {
  try {
    const { title, description, data } = req.body;
    const createdBy = req.user._id;
    const report = await Report.create({ title, description, data, createdBy });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('createdBy', 'name email');
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get report by id
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('createdBy', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update report
exports.updateReport = async (req, res) => {
  try {
    const { title, description, data } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { title, description, data },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};