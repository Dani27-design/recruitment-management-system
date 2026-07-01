import type { RecruitmentStageName, RecruitmentStageStatus } from '@prisma/client';
import {
  DashboardRepository,
  type DashboardRecruitmentSnapshot,
  type DashboardRecruitmentStageSnapshot,
} from '../repositories/dashboard.repository';

const WORKFLOW_STAGES: RecruitmentStageName[] = [
  'APPLIED',
  'SCREENING',
  'TECHNICAL_TEST',
  'INTERVIEW',
  'ACCEPTANCE',
];

const STAGE_STATUSES: RecruitmentStageStatus[] = ['PENDING', 'PASSED', 'REJECTED'];

type StageCounts = Record<RecruitmentStageName, number>;
type StatusCounts = Record<RecruitmentStageStatus, number>;

export interface DashboardSummary {
  total_candidates: number;
  total_active_vacancies: number;
  total_recruitments: number;
  recruitment_count_by_current_stage: StageCounts;
  recruitment_count_by_current_status: StatusCounts;
}

export class DashboardService {
  constructor(private readonly dashboardRepository = new DashboardRepository()) {}

  async getSummary(): Promise<DashboardSummary> {
    const [
      totalCandidates,
      totalActiveVacancies,
      totalRecruitments,
      recruitmentSnapshots,
    ] = await Promise.all([
      this.dashboardRepository.countCandidates(),
      this.dashboardRepository.countActiveVacancies(),
      this.dashboardRepository.countRecruitments(),
      this.dashboardRepository.listRecruitmentStageSnapshots(),
    ]);

    return {
      total_candidates: totalCandidates,
      total_active_vacancies: totalActiveVacancies,
      total_recruitments: totalRecruitments,
      recruitment_count_by_current_stage: this.countByCurrentStage(recruitmentSnapshots),
      recruitment_count_by_current_status: this.countByCurrentStatus(recruitmentSnapshots),
    };
  }

  private countByCurrentStage(recruitments: DashboardRecruitmentSnapshot[]): StageCounts {
    const counts = this.createStageCounts();

    for (const recruitment of recruitments) {
      const currentStage = this.findCurrentStage(recruitment.stages);

      if (currentStage) {
        counts[currentStage.stage] += 1;
      }
    }

    return counts;
  }

  private countByCurrentStatus(recruitments: DashboardRecruitmentSnapshot[]): StatusCounts {
    const counts = this.createStatusCounts();

    for (const recruitment of recruitments) {
      const currentStage = this.findCurrentStage(recruitment.stages);

      if (currentStage) {
        counts[currentStage.status] += 1;
      }
    }

    return counts;
  }

  private findCurrentStage(
    stages: DashboardRecruitmentStageSnapshot[],
  ): DashboardRecruitmentStageSnapshot | undefined {
    const sortedStages = this.sortByWorkflow(stages);
    const pendingStage = sortedStages.find((stage) => stage.status === 'PENDING');

    return pendingStage ?? sortedStages.at(-1);
  }

  private sortByWorkflow(
    stages: DashboardRecruitmentStageSnapshot[],
  ): DashboardRecruitmentStageSnapshot[] {
    return [...stages].sort(
      (left, right) => WORKFLOW_STAGES.indexOf(left.stage) - WORKFLOW_STAGES.indexOf(right.stage),
    );
  }

  private createStageCounts(): StageCounts {
    return WORKFLOW_STAGES.reduce(
      (counts, stage) => ({
        ...counts,
        [stage]: 0,
      }),
      {} as StageCounts,
    );
  }

  private createStatusCounts(): StatusCounts {
    return STAGE_STATUSES.reduce(
      (counts, status) => ({
        ...counts,
        [status]: 0,
      }),
      {} as StatusCounts,
    );
  }
}
