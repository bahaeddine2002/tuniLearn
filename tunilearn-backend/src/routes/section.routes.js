const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const { authenticate, isTeacher, requireProfileCompletion } = require('../middleware/auth.middleware');
const { pdfUpload, handleMulterError } = require('../middleware/upload.middleware');

// Public routes
router.get('/', sectionController.getSections);
router.get('/:id', sectionController.getSection);

// Protected routes (authentication required)
router.use(authenticate);
router.use(requireProfileCompletion);

// Teacher-only routes
router.post('/', isTeacher, pdfUpload.single('pdf'), sectionController.createSection);
router.put('/:id', isTeacher, pdfUpload.single('pdf'), sectionController.updateSection);
router.delete('/:id', isTeacher, sectionController.deleteSection);

// Utility route for PDF upload
router.post('/upload-pdf', isTeacher, pdfUpload.single('pdf'), sectionController.uploadPdf);

// Handle multer errors
router.use(handleMulterError);

module.exports = router;
