const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.json({ message: 'Get all announcements - To be implemented' });
});

router.post('/', auth, isAdmin, (req, res) => {
    res.json({ message: 'Create announcement - To be implemented' });
});

router.get('/:id', auth, (req, res) => {
    res.json({ message: `Get announcement ${req.params.id} - To be implemented` });
});

router.put('/:id', auth, isAdmin, (req, res) => {
    res.json({ message: `Update announcement ${req.params.id} - To be implemented` });
});

router.delete('/:id', auth, isAdmin, (req, res) => {
    res.json({ message: `Delete announcement ${req.params.id} - To be implemented` });
});

module.exports = router;
