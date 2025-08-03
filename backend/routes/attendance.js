const express = require('express');
const { auth, isTeacher } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, isTeacher, (req, res) => {
    res.json({ message: 'Get all attendance - To be implemented' });
});

router.post('/', auth, isTeacher, (req, res) => {
    res.json({ message: 'Create attendance - To be implemented' });
});

router.get('/:id', auth, (req, res) => {
    res.json({ message: `Get attendance ${req.params.id} - To be implemented` });
});

router.put('/:id', auth, isTeacher, (req, res) => {
    res.json({ message: `Update attendance ${req.params.id} - To be implemented` });
});

router.delete('/:id', auth, isTeacher, (req, res) => {
    res.json({ message: `Delete attendance ${req.params.id} - To be implemented` });
});

module.exports = router;
