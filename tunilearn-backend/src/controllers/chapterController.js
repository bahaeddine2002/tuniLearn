// Controller for Chapter CRUD
const prisma = require('../lib/prisma');

exports.createChapter = async (req, res) => {
  try {
    const chapter = await prisma.chapter.create({ data: req.body });
    res.status(201).json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({ include: { sections: true } });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: Number(req.params.id) },
      include: { sections: true }
    });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const chapter = await prisma.chapter.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    await prisma.chapter.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
