const express = require('express');
const router = express.Router();
const { clearAllData, loadSampleData, getDatabaseStats } = require('../controllers/dataController');
const auth = require('../middleware/auth');

// Get database statistics
router.get('/stats', auth, getDatabaseStats);

// Clear all data (admin only)
router.delete('/clear', auth, (req, res, next) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang dapat menghapus semua data.'
        });
    }
    next();
}, clearAllData);

// Load sample data (admin only)  
router.post('/sample', auth, (req, res, next) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang dapat memuat data sampel.'
        });
    }
    next();
}, loadSampleData);

module.exports = router;
