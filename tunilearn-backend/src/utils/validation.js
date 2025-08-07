const validator = require('validator');

/**
 * Validation utilities for course creation
 */

// YouTube URL validation
exports.validateYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'YouTube URL is required' };
  }

  // YouTube URL patterns
  const patterns = [
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  let videoId = null;
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      videoId = match[1];
      break;
    }
  }

  if (!videoId) {
    return { isValid: false, error: 'Invalid YouTube URL format' };
  }

  return { isValid: true, videoId };
};

// Extract YouTube video ID from URL
exports.extractYouTubeId = (url) => {
  const validation = this.validateYouTubeUrl(url);
  return validation.isValid ? validation.videoId : null;
};

// Validate section content (must have either video OR PDF, not both)
exports.validateSectionContent = (videoUrl, pdfUrl) => {
  const hasVideo = videoUrl && videoUrl.trim() !== '';
  const hasPdf = pdfUrl && pdfUrl.trim() !== '';

  if (!hasVideo && !hasPdf) {
    return { isValid: false, error: 'Section must have either a video URL or PDF file' };
  }

  if (hasVideo && hasPdf) {
    return { isValid: false, error: 'Section cannot have both video and PDF content' };
  }

  return { isValid: true };
};

// Validate course data
exports.validateCourseData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Course title must be at least 3 characters long');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Course description must be at least 10 characters long');
  }

  if (!data.subjectId || !Number.isInteger(parseInt(data.subjectId))) {
    errors.push('Valid subject ID is required');
  }

  if (!data.teacherId || !Number.isInteger(parseInt(data.teacherId))) {
    errors.push('Valid teacher ID is required');
  }

  if (!data.price || parseFloat(data.price) < 0) {
    errors.push('Course price must be a non-negative number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate chapter data
exports.validateChapterData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 2) {
    errors.push('Chapter title must be at least 2 characters long');
  }

  if (!data.courseId || !Number.isInteger(parseInt(data.courseId))) {
    errors.push('Valid course ID is required');
  }

  if (data.order !== undefined && (!Number.isInteger(parseInt(data.order)) || parseInt(data.order) < 0)) {
    errors.push('Chapter order must be a non-negative integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate section data
exports.validateSectionData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 2) {
    errors.push('Section title must be at least 2 characters long');
  }

  if (!data.chapterId || !Number.isInteger(parseInt(data.chapterId))) {
    errors.push('Valid chapter ID is required');
  }

  if (data.order !== undefined && (!Number.isInteger(parseInt(data.order)) || parseInt(data.order) < 0)) {
    errors.push('Section order must be a non-negative integer');
  }

  // Validate content (video XOR PDF)
  const contentValidation = this.validateSectionContent(data.videoUrl, data.pdfUrl);
  if (!contentValidation.isValid) {
    errors.push(contentValidation.error);
  }

  // If video URL is provided, validate it
  if (data.videoUrl) {
    const videoValidation = this.validateYouTubeUrl(data.videoUrl);
    if (!videoValidation.isValid) {
      errors.push(videoValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize YouTube URL for embedding
exports.sanitizeYouTubeUrl = (url) => {
  const videoId = this.extractYouTubeId(url);
  if (!videoId) return null;
  
  // Return clean embed URL with privacy-enhanced mode and no related videos
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
};
