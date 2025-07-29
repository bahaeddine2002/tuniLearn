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
export const getChapters = () => api.get('/chapters');
export const getChapter = (id) => api.get(`/chapters/${id}`);
export const createChapter = (data) => api.post('/chapters', data);
export const updateChapter = (id, data) => api.put(`/chapters/${id}`, data);
export const deleteChapter = (id) => api.delete(`/chapters/${id}`);

// Sections
export const getSections = () => api.get('/sections');
export const getSection = (id) => api.get(`/sections/${id}`);
export const createSection = (data) => api.post('/sections', data);
export const updateSection = (id, data) => api.put(`/sections/${id}`, data);
export const deleteSection = (id) => api.delete(`/sections/${id}`);

// Subjects
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
