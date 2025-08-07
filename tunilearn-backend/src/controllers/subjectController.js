const prisma = require('../lib/prisma');

exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return res.status(400).json({ error: 'Subject name cannot be empty' });
    }

    // Check if subject already exists (case-insensitive)
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        }
      }
    });

    if (existingSubject) {
      return res.status(400).json({ error: 'A subject with this name already exists' });
    }

    const subject = await prisma.subject.create({ 
      data: { name: trimmedName } 
    });
    
    res.status(201).json(subject);
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
