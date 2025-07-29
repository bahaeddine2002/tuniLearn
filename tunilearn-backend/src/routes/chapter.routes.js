const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');

router.post('/', chapterController.createChapter);
router.get('/', chapterController.getChapters);
router.get('/:id', chapterController.getChapter);
router.put('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);

module.exports = router;
