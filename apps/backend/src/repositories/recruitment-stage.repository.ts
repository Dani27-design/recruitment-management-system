import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma/client';

const recruitmentStageInclude = {
  assigned_user: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.RecruitmentStageInclude;

export type RecruitmentStageWithAssignee = Prisma.RecruitmentStageGetPayload<{
  include: typeof recruitmentStageInclude;
}>;

type RecruitmentStageCreateInput = {
  recruitment_id: string;
  stage: Prisma.RecruitmentStageCreateInput['stage'];
  status: Prisma.RecruitmentStageCreateInput['status'];
  assigned_user_id?: string | null;
  scheduled_at?: Date | null;
  notes?: string | null;
};

type RecruitmentStageUpdateInput = {
  status?: Prisma.RecruitmentStageUpdateInput['status'];
  completed_at?: Date | null;
  notes?: string | null;
};

export class RecruitmentStageRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: RecruitmentStageCreateInput): Promise<RecruitmentStageWithAssignee> {
    return this.db.recruitmentStage.create({
      data: input,
      include: recruitmentStageInclude,
    });
  }

  findById(id: string): Promise<RecruitmentStageWithAssignee | null> {
    return this.db.recruitmentStage.findUnique({
      where: { id },
      include: recruitmentStageInclude,
    });
  }

  listByRecruitmentId(recruitmentId: string): Promise<RecruitmentStageWithAssignee[]> {
    return this.db.recruitmentStage.findMany({
      where: { recruitment_id: recruitmentId },
      include: recruitmentStageInclude,
      orderBy: { created_at: 'asc' },
    });
  }

  update(
    id: string,
    data: RecruitmentStageUpdateInput,
  ): Promise<RecruitmentStageWithAssignee> {
    return this.db.recruitmentStage.update({
      where: { id },
      data,
      include: recruitmentStageInclude,
    });
  }

  completeStage(
    id: string,
    data: RecruitmentStageUpdateInput,
    nextStage?: RecruitmentStageCreateInput,
  ): Promise<RecruitmentStageWithAssignee> {
    return this.db.$transaction(async (tx) => {
      const updatedStage = await tx.recruitmentStage.update({
        where: { id },
        data,
        include: recruitmentStageInclude,
      });

      if (nextStage) {
        await tx.recruitmentStage.create({
          data: nextStage,
        });
      }

      return updatedStage;
    });
  }
}
