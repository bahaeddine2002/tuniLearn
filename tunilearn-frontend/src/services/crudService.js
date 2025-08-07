import api from '../lib/axios';

// Courses
export const getCourses = (params) => api.get('/courses', { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) =>
  api.post('/courses', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Chapters
export const getChapters = (courseId) => api.get(`/courses/${courseId}/chapters`);
export const getChapter = (id) => api.get(`/chapters/${id}`);
export const createChapter = (courseId, data) => api.post(`/courses/${courseId}/chapters`, data);
export const updateChapter = (id, data) => api.put(`/chapters/${id}`, data);
export const deleteChapter = (id) => api.delete(`/chapters/${id}`);

// Sections
export const getSections = (chapterId) => api.get(`/chapters/${chapterId}/sections`);
export const getSection = (id) => api.get(`/sections/${id}`);
export const createSection = (chapterId, data) => {
  // Handle both FormData (for PDF uploads) and JSON data
  const config = data instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  return api.post(`/chapters/${chapterId}/sections`, data, config);
};
export const updateSection = (id, data) => api.put(`/sections/${id}`, data);
export const deleteSection = (id) => api.delete(`/sections/${id}`);

// Subjects
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
