import type { PrismaClient, RecruitmentStageName, RecruitmentStageStatus } from '@prisma/client';
import { prisma } from '../prisma/client';

export interface DashboardRecruitmentStageSnapshot {
  stage: RecruitmentStageName;
  status: RecruitmentStageStatus;
  created_at: Date;
}

export interface DashboardRecruitmentSnapshot {
  id: string;
  stages: DashboardRecruitmentStageSnapshot[];
}

export class DashboardRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  countCandidates(): Promise<number> {
    return this.db.candidate.count();
  }

  countActiveVacancies(): Promise<number> {
    return this.db.vacancy.count({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  countRecruitments(): Promise<number> {
    return this.db.recruitment.count();
  }

  listRecruitmentStageSnapshots(): Promise<DashboardRecruitmentSnapshot[]> {
    return this.db.recruitment.findMany({
      select: {
        id: true,
        stages: {
          select: {
            stage: true,
            status: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });
  }
}
