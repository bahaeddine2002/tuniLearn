const prisma = require('../lib/prisma');

class EnrollmentService {
  async createEnrollment(studentId, courseId) {
    // Only allow one enrollment per student per course
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: studentId, courseId } }
    });
    if (existing) return existing;
    return prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId,
        enrolledAt: new Date()
      }
    });
  }

  async getStudentEnrollments(studentId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        course: {
          include: {
            teacher: true,
            subject: true,
            chapters: {
              include: {
                sections: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    return {
      data: enrollments
    };
  }
}

module.exports = new EnrollmentService();
