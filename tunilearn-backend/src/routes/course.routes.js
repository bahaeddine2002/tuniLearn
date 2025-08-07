const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const { authenticate, isTeacher, requireProfileCompletion } = require('../middleware/auth.middleware');
const { courseUpload, handleMulterError } = require('../middleware/upload.middleware');

// Public routes (no authentication required)
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// Protected routes (authentication required)
router.use(authenticate);
router.use(requireProfileCompletion);

// Teacher-only routes
router.post('/', isTeacher, courseUpload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'resources', maxCount: 10 }
]), courseController.createCourse);

router.put('/:id', isTeacher, courseController.updateCourse);
router.delete('/:id', isTeacher, courseController.deleteCourse);

// Course creation flow - add chapters to courses
router.post('/:courseId/chapters', isTeacher, courseController.addChapterToCourse);

// Handle multer errors
router.use(handleMulterError);

module.exports = router;
