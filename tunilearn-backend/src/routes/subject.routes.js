const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
// ...existing code...

// Public routes
router.get('/', subjectController.getSubjects);

// Protected routes (authentication required)
// ...existing code...

// Teacher-only routes
router.post('/', subjectController.createSubject);

module.exports = router;
