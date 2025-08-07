const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { authenticate, isTeacher, requireProfileCompletion } = require('../middleware/auth.middleware');

// Public routes
router.get('/', chapterController.getChapters);
router.get('/:id', chapterController.getChapter);

// Protected routes (authentication required)
router.use(authenticate);
router.use(requireProfileCompletion);

// Teacher-only routes
router.post('/', isTeacher, chapterController.createChapter);
router.put('/:id', isTeacher, chapterController.updateChapter);
router.delete('/:id', isTeacher, chapterController.deleteChapter);

// Course creation flow - add sections to chapters
router.post('/:chapterId/sections', isTeacher, chapterController.addSectionToChapter);

module.exports = router;
