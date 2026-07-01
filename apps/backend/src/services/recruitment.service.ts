import { CandidateRepository } from '../repositories/candidate.repository';
import { RecruitmentRepository, type RecruitmentWithRelations } from '../repositories/recruitment.repository';
import { VacancyRepository } from '../repositories/vacancy.repository';
import type { AuthenticatedUser } from '../types/auth';
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

  async getById(id: string, user: AuthenticatedUser): Promise<RecruitmentWithRelations> {
    const recruitment =
      user.role === 'ADMINISTRATOR'
        ? await this.recruitmentRepository.findById(id)
        : await this.recruitmentRepository.findAssignedById(id, user.id);

    if (!recruitment) {
      throw new AppError('Recruitment not found', 404);
    }

    return recruitment;
  }

  list(user: AuthenticatedUser): Promise<RecruitmentWithRelations[]> {
    if (user.role === 'ADMINISTRATOR') {
      return this.recruitmentRepository.list();
    }

    return this.recruitmentRepository.listAssignedToManager(user.id);
  }
}
