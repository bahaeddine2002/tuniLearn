// Controller for Course CRUD with comprehensive course creation flow
const prisma = require('../lib/prisma');
const path = require('path');
const courseCreationService = require('../services/courseCreation.service');

exports.createCourse = async (req, res) => {
  try {
    let data = { ...req.body };
    
    // Handle thumbnail upload
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      data.coverImageUrl = `/uploads/${req.files.thumbnail[0].filename}`;
    }
    
    // Handle multiple resource files
    if (req.files && req.files.resources) {
      const resourceUrls = req.files.resources.map(f => `/uploads/resources/${f.filename}`);
      data.resourceUrls = JSON.stringify(resourceUrls);
    }
    
    // Use the course creation service for validation and business logic
    const course = await courseCreationService.createCourse(data, req.user.userId);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let where = {};
    
    // Filter by teacher if specified
    if (req.query.teacherId) {
      where.teacherId = parseInt(req.query.teacherId);
    }
    
    // Admin can see all courses, teachers can see their own, public sees approved only
    if (req.user && req.user.role === 'ADMIN') {
      // Admin sees all courses based on approved query param
      if (req.query.approved === 'false') {
        where.approved = false;
      } else if (req.query.approved !== 'all') {
        where.approved = true;
      }
    } else if (req.user && req.user.role === 'TEACHER') {
      // Teachers see their own courses (all statuses) or public approved courses
      if (req.query.my === 'true') {
        where.teacherId = req.user.userId;
      } else {
        where.approved = true;
      }
    } else {
      // Public users see only approved courses
      where.approved = true;
    }
    
    const courses = await prisma.course.findMany({ 
      where, 
      include: { 
        subject: true,
        teacher: {
          select: { id: true, name: true, email: true }
        },
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            sections: {
              orderBy: { order: 'asc' }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: courses
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const teacherId = req.user?.role === 'TEACHER' ? req.user.userId : null;
    
    const course = await courseCreationService.getCourseWithContent(courseId, teacherId);
    
    res.json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(404).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    // Check if user owns the course (only teachers can update their own courses)
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'Only teachers can update courses' 
      });
    }
    
    // For teachers, ensure they own the course
    if (req.user.role === 'TEACHER') {
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });
      
      if (!course || course.teacherId !== req.user.userId) {
        return res.status(403).json({ 
          success: false,
          error: 'You can only update your own courses' 
        });
      }
    }
    
    const course = await prisma.course.update({
      where: { id: courseId },
      data: req.body,
      include: {
        subject: true,
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'Only teachers can delete courses' 
      });
    }
    
    // Use service for proper validation and cleanup
    const result = await courseCreationService.deleteCourse(courseId, req.user.userId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// New endpoints for course creation flow

exports.addChapterToCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    
    const chapter = await courseCreationService.addChapterToCourse(
      courseId, 
      req.body, 
      req.user.userId
    );
    
    res.status(201).json({
      success: true,
      message: 'Chapter added successfully',
      data: chapter
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};
