// Controller for Section CRUD with YouTube and PDF validation
const prisma = require('../lib/prisma');
const courseCreationService = require('../services/courseCreation.service');

exports.createSection = async (req, res) => {
  try {
    let sectionData = { ...req.body };
    
    // Handle PDF upload if file was uploaded
    if (req.file) {
      sectionData.pdfUrl = `/uploads/resources/${req.file.filename}`;
    }
    
    const section = await courseCreationService.addSectionToChapter(
      parseInt(sectionData.chapterId),
      sectionData,
      req.user.userId
    );
    
    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getSections = async (req, res) => {
  try {
    let where = {};
    
    // Filter by chapter if specified
    if (req.query.chapterId) {
      where.chapterId = parseInt(req.query.chapterId);
    }
    
    const sections = await prisma.section.findMany({
      where,
      include: {
        chapter: {
          select: { 
            id: true, 
            title: true, 
            course: { 
              select: { id: true, title: true, teacherId: true, approved: true } 
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    res.json({
      success: true,
      data: sections
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getSection = async (req, res) => {
  try {
    const sectionId = parseInt(req.params.id);
    
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        chapter: {
          include: {
            course: {
              select: { id: true, title: true, teacherId: true, approved: true }
            }
          }
        }
      }
    });
    
    if (!section) {
      return res.status(404).json({ 
        success: false,
        error: 'Section not found' 
      });
    }
    
    // Check access permissions
    const isOwner = req.user?.userId === section.chapter.course.teacherId;
    const isApproved = section.chapter.course.approved;
    
    if (!isApproved && !isOwner && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }
    
    res.json({
      success: true,
      data: section
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const sectionId = parseInt(req.params.id);
    let updateData = { ...req.body };
    
    // Handle PDF upload if new file was uploaded
    if (req.file) {
      updateData.pdfUrl = `/uploads/resources/${req.file.filename}`;
      // If uploading PDF, remove video URL
      updateData.videoUrl = null;
    }
    
    const section = await courseCreationService.updateSectionContent(
      sectionId,
      updateData,
      req.user.userId
    );
    
    res.json({
      success: true,
      message: 'Section updated successfully',
      data: section
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const sectionId = parseInt(req.params.id);
    
    // Check ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        chapter: {
          include: { course: true }
        }
      }
    });
    
    if (!section) {
      return res.status(404).json({ 
        success: false,
        error: 'Section not found' 
      });
    }
    
    if (section.chapter.course.teacherId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: 'You can only delete sections in your own courses' 
      });
    }
    
    await prisma.section.delete({ where: { id: sectionId } });
    
    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Upload PDF for section
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No PDF file uploaded' 
      });
    }
    
    const pdfUrl = `/uploads/resources/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'PDF uploaded successfully',
      data: { pdfUrl }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};
