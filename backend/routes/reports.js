const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Create report
router.post('/', auth, reportController.createReport);
// Get all reports
router.get('/', auth, reportController.getReports);
// Get report by id
router.get('/:id', auth, reportController.getReportById);
// Update report
router.put('/:id', auth, reportController.updateReport);
// Delete report
router.delete('/:id', auth, reportController.deleteReport);

module.exports = router;