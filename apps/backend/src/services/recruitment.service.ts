import { CandidateRepository } from '../repositories/candidate.repository';
import { RecruitmentRepository, type RecruitmentWithRelations } from '../repositories/recruitment.repository';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { AppError } from '../utils/app-error';
import type { RecruitmentCreateInput } from '../validations/recruitment.validation';

export class RecruitmentService {
  constructor(
    private readonly recruitmentRepository = new RecruitmentRepository(),
    private readonly candidateRepository = new CandidateRepository(),
    private readonly vacancyRepository = new VacancyRepository(),
  ) {}

  async create(
    input: RecruitmentCreateInput,
    createdBy: string,
  ): Promise<RecruitmentWithRelations> {
    const candidate = await this.candidateRepository.findById(input.candidate_id);

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    const vacancy = await this.vacancyRepository.findById(input.vacancy_id);

    if (!vacancy) {
      throw new AppError('Vacancy not found', 404);
    }

    if (vacancy.status !== 'ACTIVE') {
      throw new AppError('Vacancy must be ACTIVE', 400);
    }

    return this.recruitmentRepository.create(input, createdBy);
  }

  async getById(id: string): Promise<RecruitmentWithRelations> {
    const recruitment = await this.recruitmentRepository.findById(id);

    if (!recruitment) {
      throw new AppError('Recruitment not found', 404);
    }

    return recruitment;
  }

  list(): Promise<RecruitmentWithRelations[]> {
    return this.recruitmentRepository.list();
  }
}
