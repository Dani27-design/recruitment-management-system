import type { Candidate } from '@prisma/client';
import { AUDIT_ENTITY_TYPES, AUDIT_EVENT_TYPES } from '../constants/audit';
import { CandidateRepository } from '../repositories/candidate.repository';
import { AppError } from '../utils/app-error';
import type {
  CandidateCreateInput,
  CandidateListQuery,
  CandidateUpdateInput,
} from '../validations/candidate.validation';
import { AuditService } from './audit.service';

export class CandidateService {
  constructor(
    private readonly candidateRepository = new CandidateRepository(),
    private readonly auditService = new AuditService(),
  ) {}

  async create(input: CandidateCreateInput, actorId: string): Promise<Candidate> {
    await this.ensureEmailIsUnique(input.email);

    const candidate = await this.candidateRepository.create(input);

    await this.auditService.record({
      actorId,
      after: candidate,
      entityId: candidate.id,
      entityType: AUDIT_ENTITY_TYPES.CANDIDATE,
      eventType: AUDIT_EVENT_TYPES.CREATE,
    });

    return candidate;
  }

  async update(id: string, input: CandidateUpdateInput, actorId: string): Promise<Candidate> {
    const before = await this.getById(id);

    if (input.email) {
      await this.ensureEmailIsUnique(input.email, id);
    }

    const candidate = await this.candidateRepository.update(id, input);

    await this.auditService.record({
      actorId,
      before,
      after: candidate,
      entityId: candidate.id,
      entityType: AUDIT_ENTITY_TYPES.CANDIDATE,
      eventType: AUDIT_EVENT_TYPES.UPDATE,
    });

    return candidate;
  }

  async delete(id: string, actorId: string): Promise<Candidate> {
    const before = await this.getById(id);
    const candidate = await this.candidateRepository.delete(id);

    await this.auditService.record({
      actorId,
      before,
      entityId: candidate.id,
      entityType: AUDIT_ENTITY_TYPES.CANDIDATE,
      eventType: AUDIT_EVENT_TYPES.DELETE,
    });

    return candidate;
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

  private async ensureEmailIsUnique(email: string, currentCandidateId?: string): Promise<void> {
    const existingCandidate = await this.candidateRepository.findByEmail(email);

    if (existingCandidate && existingCandidate.id !== currentCandidateId) {
      throw new AppError('Candidate email already exists', 409);
    }
  }
}
