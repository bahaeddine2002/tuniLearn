const express = require('express');
const router = express.Router();

// No-op endpoints for dev mode
router.get('/check', (req, res) => res.json({ success: true, user: { role: 'TEACHER', name: 'Static Teacher' } }));
router.post('/logout', (req, res) => res.json({ success: true }));

module.exports = router;
