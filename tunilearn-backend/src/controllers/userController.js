const prisma = require('../lib/prisma');

exports.getUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, bio } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        createdAt: true
      }
    });
    
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
