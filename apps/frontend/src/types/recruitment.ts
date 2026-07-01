import type { Candidate } from './candidate';
import type { Vacancy } from './vacancy';

export type RecruitmentStageName =
  | 'APPLIED'
  | 'SCREENING'
  | 'TECHNICAL_TEST'
  | 'INTERVIEW'
  | 'ACCEPTANCE';

export type RecruitmentStageStatus = 'PENDING' | 'PASSED' | 'REJECTED';

export interface RecruitmentStage {
  id: string;
  recruitment_id: string;
  stage: RecruitmentStageName;
  status: RecruitmentStageStatus;
  assigned_user_id: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export interface Recruitment {
  id: string;
  candidate_id: string;
  vacancy_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  candidate: Candidate;
  vacancy: Vacancy;
  stages: RecruitmentStage[];
}

export interface RecruitmentFormInput {
  candidate_id: string;
  vacancy_id: string;
}

export interface RecruitmentStageUpdateInput {
  status?: Exclude<RecruitmentStageStatus, 'PENDING'>;
  notes?: string | null;
}
