// Controller for Chapter CRUD with enhanced validation
const prisma = require('../lib/prisma');
const courseCreationService = require('../services/courseCreation.service');

exports.createChapter = async (req, res) => {
  try {
    const chapter = await courseCreationService.addChapterToCourse(
      parseInt(req.body.courseId),
      req.body,
      req.user.userId
    );
    
    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: chapter
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getChapters = async (req, res) => {
  try {
    let where = {};
    
    // Filter by course if specified
    if (req.query.courseId) {
      where.courseId = parseInt(req.query.courseId);
    }
    
    const chapters = await prisma.chapter.findMany({ 
      where,
      include: { 
        course: {
          select: { id: true, title: true, teacherId: true }
        },
        sections: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    res.json({
      success: true,
      data: chapters
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);
    
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { 
        course: {
          select: { id: true, title: true, teacherId: true, approved: true }
        },
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        error: 'Chapter not found' 
      });
    }
    
    // Check access permissions
    const isOwner = req.user?.userId === chapter.course.teacherId;
    const isApproved = chapter.course.approved;
    
    if (!isApproved && !isOwner && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }
    
    res.json({
      success: true,
      data: chapter
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);
    
    // Check ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true }
    });
    
    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        error: 'Chapter not found' 
      });
    }
    
    if (chapter.course.teacherId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'You can only update chapters in your own courses' 
      });
    }
    
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title: req.body.title?.trim(),
        order: req.body.order ? parseInt(req.body.order) : undefined
      },
      include: {
        course: {
          select: { id: true, title: true }
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Chapter updated successfully',
      data: updatedChapter
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);
    
    // Check ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true }
    });
    
    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        error: 'Chapter not found' 
      });
    }
    
    if (chapter.course.teacherId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'You can only delete chapters in your own courses' 
      });
    }
    
    await prisma.chapter.delete({ where: { id: chapterId } });
    
    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Add section to chapter
exports.addSectionToChapter = async (req, res) => {
  try {
    const chapterId = parseInt(req.params.chapterId);
    
    const section = await courseCreationService.addSectionToChapter(
      chapterId,
      req.body,
      req.user.userId
    );
    
    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: section
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};
