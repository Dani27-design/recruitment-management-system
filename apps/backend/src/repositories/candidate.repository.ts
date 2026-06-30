import type { Candidate, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { CandidateCreateInput, CandidateUpdateInput } from '../validations/candidate.validation';

export class CandidateRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: CandidateCreateInput): Promise<Candidate> {
    return this.db.candidate.create({
      data: input,
    });
  }

  update(id: string, input: CandidateUpdateInput): Promise<Candidate> {
    return this.db.candidate.update({
      where: { id },
      data: input,
    });
  }

  delete(id: string): Promise<Candidate> {
    return this.db.candidate.delete({
      where: { id },
    });
  }

  findById(id: string): Promise<Candidate | null> {
    return this.db.candidate.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<Candidate | null> {
    return this.db.candidate.findUnique({
      where: { email },
    });
  }

  list(search?: string): Promise<Candidate[]> {
    const where: Prisma.CandidateWhereInput | undefined = search
      ? {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone_number: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    return this.db.candidate.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  }
}
