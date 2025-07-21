const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
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

  // Hash for all demo users
  const hash = await bcrypt.hash('TestPass123', 10);

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@tunilearn.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@tunilearn.com',
      password: hash,
      role: 'ADMIN',
    }
  });
  await prisma.user.upsert({
    where: { email: 'teacher@tunilearn.com' },
    update: {},
    create: {
      name: 'Teacher User',
      email: 'teacher@tunilearn.com',
      password: hash,
      role: 'TEACHER',
    }
  });
  await prisma.user.upsert({
    where: { email: 'student@tunilearn.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@tunilearn.com',
      password: hash,
      role: 'STUDENT',
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
