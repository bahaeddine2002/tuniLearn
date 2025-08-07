const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Subjects
  await prisma.subject.createMany({
    data: [
      { name: 'Mathematics' },
      { name: 'Science' },
      { name: 'Literature' }
    ],
    skipDuplicates: true,
  });

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@tunilearn.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@tunilearn.com',
      role: 'ADMIN',
      googleId: 'admin-google-id',
    }
  });
  await prisma.user.upsert({
    where: { email: 'teacher@tunilearn.com' },
    update: {},
    create: {
      name: 'Teacher User',
      email: 'teacher@tunilearn.com',
      role: 'TEACHER',
      googleId: 'teacher-google-id',
    }
  });
  await prisma.user.upsert({
    where: { email: 'student@tunilearn.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@tunilearn.com',
      role: 'STUDENT',
      googleId: 'student-google-id',
    }
  });


  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
