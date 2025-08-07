const prisma = require('../lib/prisma');

class TeacherService {
  async getTeacherProfile(teacherId) {
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImageUrl: true,
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            coverImageUrl: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!teacher) return null;
    return {
      id: teacher.id,
      fullName: teacher.name,
      bio: teacher.bio,
      profileImageUrl: teacher.profileImageUrl,
      courses: teacher.courses
    };
  }

  async updateTeacherProfile(teacherId, req) {
    // Handle file upload (profileImage)
    let profileImageUrl;
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      profileImageUrl = `/uploads/${req.files.profileImage[0].filename}`;
    }
    const data = {
      name: req.body.name,
      bio: req.body.bio,
    };
    if (profileImageUrl) data.profileImageUrl = profileImageUrl;
    const updated = await prisma.user.update({
      where: { id: teacherId },
      data
    });
    return {
      id: updated.id,
      fullName: updated.name,
      bio: updated.bio,
      profileImageUrl: updated.profileImageUrl
    };
  }
}

module.exports = new TeacherService();


