const enrollmentService = require('../services/enrollment.service');

exports.createEnrollment = async (req, res) => {
  try {
    // Always use static studentId = 3 for dev/test
    let { courseId } = req.body;
    const studentId = 3;
    courseId = parseInt(courseId);
    console.log('ENROLLMENT DEBUG:', { studentId, courseId, body: req.body });
    if (!courseId || isNaN(courseId)) {
      console.error('ENROLLMENT ERROR: Invalid courseId', req.body);
      return res.status(400).json({ success: false, error: 'courseId is required and must be a number' });
    }
    const enrollment = await enrollmentService.createEnrollment(studentId, courseId);
    console.log('ENROLLMENT SUCCESS:', enrollment);
    res.json({ success: true, enrollment });
  } catch (err) {
    console.error('ENROLLMENT ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const data = await enrollmentService.getStudentEnrollments(studentId);
    if (!data) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
