export type VacancyStatus = 'ACTIVE' | 'INACTIVE';

export interface Vacancy {
  id: string;
  position_name: string;
  department: string;
  hiring_needed: number;
  status: VacancyStatus;
  created_at: string;
  updated_at: string;
}

export interface VacancyFormInput {
  position_name: string;
  department: string;
  hiring_needed: number;
  status: VacancyStatus;
}
