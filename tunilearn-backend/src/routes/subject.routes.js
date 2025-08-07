const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { authenticate, isTeacher, requireProfileCompletion } = require('../middleware/auth.middleware');

// Public routes
router.get('/', subjectController.getSubjects);

// Protected routes (authentication required)
router.use(authenticate);
router.use(requireProfileCompletion);

// Teacher-only routes
router.post('/', isTeacher, subjectController.createSubject);

module.exports = router;
