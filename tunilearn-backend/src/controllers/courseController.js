// Controller for Course CRUD
const prisma = require('../lib/prisma');
const path = require('path');

exports.createCourse = async (req, res) => {
  try {
    let data = req.body;
    // Handle thumbnail
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      data.coverImageUrl = `/uploads/${req.files.thumbnail[0].filename}`;
    }
    // Handle multiple resources
    if (req.files && req.files.resources) {
      const resourceUrls = req.files.resources.map(f => `/uploads/${f.filename}`);
      data.resourceUrls = JSON.stringify(resourceUrls);
    }
    // Parse and stringify extra fields for DB storage
    if (typeof data.learningObjectives === 'string') {
      try {
        data.learningObjectives = JSON.stringify(JSON.parse(data.learningObjectives));
      } catch {
        data.learningObjectives = JSON.stringify([data.learningObjectives]);
      }
    }
    if (typeof data.features === 'string') {
      try {
        data.features = JSON.stringify(JSON.parse(data.features));
      } catch {
        data.features = JSON.stringify([data.features]);
      }
    }
    // prerequisites is just a string, no need to parse
      const course = await prisma.course.create({
        data: {
          ...data,
          subjectId: parseInt(data.subjectId, 10),
          teacherId: parseInt(data.teacherId, 10),
          price: parseInt(data.price, 10),
        }
      });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let where = {};
    // If ?approved=false, return only unapproved; if ?all=true, return all; else only approved
    if (req.query.all === 'true') {
      // no filter
    } else if (req.query.approved === 'false') {
      where.approved = false;
    } else {
      where.approved = true;
    }
    const courses = await prisma.course.findMany({ where, include: { chapters: true } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(req.params.id) },
      include: { chapters: true }
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
