import type { RecruitmentStageName, RecruitmentStageStatus } from './recruitment';

export type DashboardStageCounts = Record<RecruitmentStageName, number>;
export type DashboardStatusCounts = Record<RecruitmentStageStatus, number>;

export interface DashboardSummary {
  total_candidates: number;
  total_active_vacancies: number;
  total_recruitments: number;
  recruitment_count_by_current_stage: DashboardStageCounts;
  recruitment_count_by_current_status: DashboardStatusCounts;
}
