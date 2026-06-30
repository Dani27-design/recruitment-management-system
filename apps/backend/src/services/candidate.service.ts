import type { Candidate } from '@prisma/client';
import { CandidateRepository } from '../repositories/candidate.repository';
import { AppError } from '../utils/app-error';
import type {
  CandidateCreateInput,
  CandidateListQuery,
  CandidateUpdateInput,
} from '../validations/candidate.validation';

export class CandidateService {
  constructor(private readonly candidateRepository = new CandidateRepository()) {}

  async create(input: CandidateCreateInput): Promise<Candidate> {
    await this.ensureEmailIsUnique(input.email);

    return this.candidateRepository.create(input);
  }

  async update(id: string, input: CandidateUpdateInput): Promise<Candidate> {
    await this.ensureCandidateExists(id);

    if (input.email) {
      await this.ensureEmailIsUnique(input.email, id);
    }

    return this.candidateRepository.update(id, input);
  }

  async delete(id: string): Promise<Candidate> {
    await this.ensureCandidateExists(id);

    return this.candidateRepository.delete(id);
  }

  async getById(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findById(id);

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    return candidate;
  }

  list(query: CandidateListQuery): Promise<Candidate[]> {
    return this.candidateRepository.list(query.search);
  }

  private async ensureCandidateExists(id: string): Promise<void> {
    await this.getById(id);
  }

  private async ensureEmailIsUnique(email: string, currentCandidateId?: string): Promise<void> {
    const existingCandidate = await this.candidateRepository.findByEmail(email);

    if (existingCandidate && existingCandidate.id !== currentCandidateId) {
      throw new AppError('Candidate email already exists', 409);
    }
  }
}
