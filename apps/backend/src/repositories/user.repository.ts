import type { PrismaClient, User } from '@prisma/client';
import { prisma } from '../prisma/client';

export class UserRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }
}
