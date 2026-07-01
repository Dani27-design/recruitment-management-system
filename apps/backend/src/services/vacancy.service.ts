import type { Vacancy } from '@prisma/client';
import { AUDIT_ENTITY_TYPES, AUDIT_EVENT_TYPES } from '../constants/audit';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { AppError } from '../utils/app-error';
import type { VacancyCreateInput, VacancyUpdateInput } from '../validations/vacancy.validation';
import { AuditService } from './audit.service';

export class VacancyService {
  constructor(
    private readonly vacancyRepository = new VacancyRepository(),
    private readonly auditService = new AuditService(),
  ) {}

  async create(input: VacancyCreateInput, actorId: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.create(input);

    await this.auditService.record({
      actorId,
      after: vacancy,
      entityId: vacancy.id,
      entityType: AUDIT_ENTITY_TYPES.VACANCY,
      eventType: AUDIT_EVENT_TYPES.CREATE,
    });

    return vacancy;
  }

  async update(id: string, input: VacancyUpdateInput, actorId: string): Promise<Vacancy> {
    const before = await this.getById(id);
    const vacancy = await this.vacancyRepository.update(id, input);

    await this.auditService.record({
      actorId,
      before,
      after: vacancy,
      entityId: vacancy.id,
      entityType: AUDIT_ENTITY_TYPES.VACANCY,
      eventType: AUDIT_EVENT_TYPES.UPDATE,
    });

    return vacancy;
  }

  async delete(id: string, actorId: string): Promise<Vacancy> {
    const before = await this.getById(id);
    const vacancy = await this.vacancyRepository.delete(id);

    await this.auditService.record({
      actorId,
      before,
      entityId: vacancy.id,
      entityType: AUDIT_ENTITY_TYPES.VACANCY,
      eventType: AUDIT_EVENT_TYPES.DELETE,
    });

    return vacancy;
  }

  async getById(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findById(id);

    if (!vacancy) {
      throw new AppError('Vacancy not found', 404);
    }

    return vacancy;
  }

  list(): Promise<Vacancy[]> {
    return this.vacancyRepository.list();
  }

}
