const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async ({ name, email, password, role }) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashed, role }
  });
};

exports.findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
}; 