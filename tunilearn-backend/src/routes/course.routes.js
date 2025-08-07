const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
// ...existing code...
const { courseUpload, handleMulterError } = require('../middleware/upload.middleware');

// Public routes (no authentication required)
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// Protected routes (authentication required)
// ...existing code...

// Teacher-only routes
router.post('/', courseUpload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'resources', maxCount: 10 }
]), courseController.createCourse);

router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Course creation flow - add chapters to courses
router.post('/:courseId/chapters', courseController.addChapterToCourse);

// Handle multer errors
router.use(handleMulterError);

module.exports = router;
