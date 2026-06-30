import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = [
  {
    email: 'admin@rms.local',
    password: 'Admin@12345',
    role: Role.ADMINISTRATOR,
  },
  {
    email: 'manager@rms.local',
    password: 'Manager@12345',
    role: Role.MANAGER,
  },
];

async function main() {
  for (const user of seedUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password_hash: passwordHash,
        role: user.role,
      },
      create: {
        email: user.email,
        password_hash: passwordHash,
        role: user.role,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
