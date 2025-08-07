const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
// ...existing code...

// Public routes
router.get('/', chapterController.getChapters);
router.get('/:id', chapterController.getChapter);

// Protected routes (authentication required)
// ...existing code...

// Teacher-only routes
router.post('/', chapterController.createChapter);
router.put('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);

// Course creation flow - add sections to chapters
router.post('/:chapterId/sections', chapterController.addSectionToChapter);

module.exports = router;
