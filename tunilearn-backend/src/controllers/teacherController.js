exports.updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const updated = await teacherService.updateTeacherProfile(teacherId, req);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
const teacherService = require('../services/teacher.service');

exports.getTeacherProfile = async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const profile = await teacherService.getTeacherProfile(teacherId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
