import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { RecruitmentCreateInput } from '../validations/recruitment.validation';

const recruitmentInclude = {
  candidate: true,
  vacancy: true,
  creator: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
  stages: {
    orderBy: { created_at: 'asc' },
  },
} satisfies Prisma.RecruitmentInclude;

export type RecruitmentWithRelations = Prisma.RecruitmentGetPayload<{
  include: typeof recruitmentInclude;
}>;

export class RecruitmentRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: RecruitmentCreateInput, createdBy: string): Promise<RecruitmentWithRelations> {
    return this.db.$transaction(async (tx) => {
      const recruitment = await tx.recruitment.create({
        data: {
          candidate_id: input.candidate_id,
          vacancy_id: input.vacancy_id,
          created_by: createdBy,
        },
      });

      await tx.recruitmentStage.create({
        data: {
          recruitment_id: recruitment.id,
          stage: 'APPLIED',
          status: 'PENDING',
        },
      });

      return tx.recruitment.findUniqueOrThrow({
        where: { id: recruitment.id },
        include: recruitmentInclude,
      });
    });
  }

  findById(id: string): Promise<RecruitmentWithRelations | null> {
    return this.db.recruitment.findUnique({
      where: { id },
      include: recruitmentInclude,
    });
  }

  findAssignedById(id: string, managerId: string): Promise<RecruitmentWithRelations | null> {
    return this.db.recruitment.findFirst({
      where: {
        id,
        stages: {
          some: {
            assigned_user_id: managerId,
          },
        },
      },
      include: recruitmentInclude,
    });
  }

  list(): Promise<RecruitmentWithRelations[]> {
    return this.db.recruitment.findMany({
      include: recruitmentInclude,
      orderBy: { created_at: 'desc' },
    });
  }

  listAssignedToManager(managerId: string): Promise<RecruitmentWithRelations[]> {
    return this.db.recruitment.findMany({
      where: {
        stages: {
          some: {
            assigned_user_id: managerId,
          },
        },
      },
      include: recruitmentInclude,
      orderBy: { created_at: 'desc' },
    });
  }
}
