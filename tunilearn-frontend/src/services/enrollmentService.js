import axios from '../lib/axios';

// Always use the correct base path (no duplicate /api)
export const enrollInCourse = async (studentId, courseId) => {
  const res = await axios.post('/enrollments', { studentId, courseId });
  return res.data;
};

export const fetchStudentEnrollments = async (studentId) => {
  const res = await axios.get(`/enrollments/students/${studentId}/enrollments`);
  return res.data;
};
