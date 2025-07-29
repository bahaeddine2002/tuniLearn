// Controller for Section CRUD
const prisma = require('../lib/prisma');

exports.createSection = async (req, res) => {
  try {
    const section = await prisma.section.create({ data: req.body });
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSection = async (req, res) => {
  try {
    const section = await prisma.section.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const section = await prisma.section.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    await prisma.section.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
