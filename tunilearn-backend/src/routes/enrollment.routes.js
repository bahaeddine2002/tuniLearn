const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.post('/', enrollmentController.createEnrollment);
router.get('/students/:id/enrollments', enrollmentController.getStudentEnrollments);

module.exports = router;
