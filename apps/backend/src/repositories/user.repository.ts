import type { PrismaClient, User } from '@prisma/client';
import { prisma } from '../prisma/client';

const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  created_at: true,
  updated_at: true,
} as const;

export type PublicUser = Pick<User, 'id' | 'email' | 'role' | 'created_at' | 'updated_at'>;

export class UserRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  findManagers(): Promise<PublicUser[]> {
    return this.db.user.findMany({
      where: { role: 'MANAGER' },
      select: userPublicSelect,
      orderBy: { email: 'asc' },
    });
  }
}
