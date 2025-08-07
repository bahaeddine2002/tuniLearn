const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { courseUpload } = require('../middleware/upload.middleware');

router.get('/:id', teacherController.getTeacherProfile);
router.put('/:id', courseUpload.fields([{ name: 'profileImage', maxCount: 1 }]), teacherController.updateTeacherProfile);

module.exports = router;
