const prisma = require('../lib/prisma');
const { validateCourseData, validateChapterData, validateSectionData, extractYouTubeId } = require('../utils/validation');

/**
 * Course creation service with comprehensive validation and business logic
 */

class CourseCreationService {
  
  /**
   * Create a new course with validation
   */
  async createCourse(courseData, teacherId) {
    // Validate input data
    const validation = validateCourseData({ ...courseData, teacherId });
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if teacher exists and has TEACHER role
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId }
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    if (teacher.role !== 'TEACHER') {
      throw new Error('User must have TEACHER role to create courses');
    }

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(courseData.subjectId) }
    });

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Parse JSON fields if they're strings
    let learningObjectives = courseData.learningObjectives;
    let features = courseData.features;

    if (typeof learningObjectives === 'string') {
      try {
        learningObjectives = JSON.stringify(JSON.parse(learningObjectives));
      } catch {
        learningObjectives = JSON.stringify([learningObjectives]);
      }
    } else if (Array.isArray(learningObjectives)) {
      learningObjectives = JSON.stringify(learningObjectives);
    }

    if (typeof features === 'string') {
      try {
        features = JSON.stringify(JSON.parse(features));
      } catch {
        features = JSON.stringify([features]);
      }
    } else if (Array.isArray(features)) {
      features = JSON.stringify(features);
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        subjectId: parseInt(courseData.subjectId),
        teacherId: teacherId,
        price: parseFloat(courseData.price),
        coverImageUrl: courseData.coverImageUrl,
        learningObjectives,
        prerequisites: courseData.prerequisites?.trim(),
        features,
        resourceUrls: courseData.resourceUrls,
        approved: false // All new courses are pending by default
      },
      include: {
        subject: true,
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return course;
  }

  /**
   * Add chapter to course with validation
   */
  async addChapterToCourse(courseId, chapterData, teacherId) {
    // Validate chapter data
    const validation = validateChapterData({ ...chapterData, courseId });
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if course exists and teacher owns it
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { chapters: { orderBy: { order: 'desc' } } }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    if (course.teacherId !== teacherId) {
      throw new Error('You can only add chapters to your own courses');
    }

    // Check for duplicate chapter titles in the same course
    const existingChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
        title: chapterData.title.trim()
      }
    });

    if (existingChapter) {
      throw new Error('A chapter with this title already exists in this course');
    }

    // Set order if not provided (next available order)
    let order = chapterData.order;
    if (order === undefined || order === null) {
      const lastChapter = course.chapters[0]; // First item due to desc order
      order = lastChapter ? lastChapter.order + 1 : 1;
    } else {
      order = parseInt(order);
    }

    // Create chapter
    const chapter = await prisma.chapter.create({
      data: {
        title: chapterData.title.trim(),
        courseId: courseId,
        order: order
      },
      include: {
        course: {
          select: { id: true, title: true }
        }
      }
    });

    return chapter;
  }

  /**
   * Add section to chapter with content validation
   */
  async addSectionToChapter(chapterId, sectionData, teacherId) {
    // Validate section data
    const validation = validateSectionData({ ...sectionData, chapterId });
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if chapter exists and teacher owns the course
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true,
        sections: { orderBy: { order: 'desc' } }
      }
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    if (chapter.course.teacherId !== teacherId) {
      throw new Error('You can only add sections to chapters in your own courses');
    }

    // Check for duplicate section titles in the same chapter
    const existingSection = await prisma.section.findFirst({
      where: {
        chapterId: chapterId,
        title: sectionData.title.trim()
      }
    });

    if (existingSection) {
      throw new Error('A section with this title already exists in this chapter');
    }

    // Set order if not provided
    let order = sectionData.order;
    if (order === undefined || order === null) {
      const lastSection = chapter.sections[0]; // First item due to desc order
      order = lastSection ? lastSection.order + 1 : 1;
    } else {
      order = parseInt(order);
    }

    // Process video URL if provided
    let videoUrl = null;
    if (sectionData.videoUrl) {
      const videoId = extractYouTubeId(sectionData.videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      // Store just the video ID for flexibility in frontend
      videoUrl = videoId;
    }

    // Create section
    const section = await prisma.section.create({
      data: {
        title: sectionData.title.trim(),
        chapterId: chapterId,
        videoUrl: videoUrl,
        pdfUrl: sectionData.pdfUrl || null,
        order: order
      },
      include: {
        chapter: {
          select: { id: true, title: true, course: { select: { id: true, title: true } } }
        }
      }
    });

    return section;
  }

  /**
   * Get course with full hierarchy (chapters and sections)
   */
  async getCourseWithContent(courseId, teacherId = null) {
    const whereClause = { id: courseId };
    
    // If teacherId is provided, ensure they own the course (for draft access)
    if (teacherId) {
      whereClause.teacherId = teacherId;
    } else {
      // For public access, only show approved courses
      whereClause.approved = true;
    }

    const course = await prisma.course.findUnique({
      where: whereClause,
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
        }
      }
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return course;
  }

  /**
   * Update section content (video or PDF)
   */
  async updateSectionContent(sectionId, contentData, teacherId) {
    // Validate that user owns the course
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        chapter: {
          include: { course: true }
        }
      }
    });

    if (!section) {
      throw new Error('Section not found');
    }

    if (section.chapter.course.teacherId !== teacherId) {
      throw new Error('You can only update sections in your own courses');
    }

    // Validate content (must have video XOR PDF)
    const validation = validateSectionData({ 
      ...contentData, 
      title: section.title, 
      chapterId: section.chapterId 
    });
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Process video URL if provided
    let videoUrl = null;
    if (contentData.videoUrl) {
      const videoId = extractYouTubeId(contentData.videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      videoUrl = videoId;
    }

    // Update section
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        videoUrl: videoUrl,
        pdfUrl: contentData.pdfUrl || null
      }
    });

    return updatedSection;
  }

  /**
   * Delete course and all its content (chapters, sections)
   */
  async deleteCourse(courseId, teacherId) {
    // Check ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    if (course.teacherId !== teacherId) {
      throw new Error('You can only delete your own courses');
    }

    // Delete course (cascade will handle chapters and sections)
    await prisma.course.delete({
      where: { id: courseId }
    });

    return { message: 'Course deleted successfully' };
  }
}

module.exports = new CourseCreationService();
