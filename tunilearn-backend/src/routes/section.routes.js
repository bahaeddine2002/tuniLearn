const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
// ...existing code...
const { pdfUpload, handleMulterError } = require('../middleware/upload.middleware');

// Public routes
router.get('/', sectionController.getSections);
router.get('/:id', sectionController.getSection);

// Protected routes (authentication required)
// ...existing code...

// Teacher-only routes
router.post('/', pdfUpload.single('pdf'), sectionController.createSection);
router.put('/:id', pdfUpload.single('pdf'), sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

// Utility route for PDF upload
router.post('/upload-pdf', pdfUpload.single('pdf'), sectionController.uploadPdf);

// Handle multer errors
router.use(handleMulterError);

module.exports = router;
