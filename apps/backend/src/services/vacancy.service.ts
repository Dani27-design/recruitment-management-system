import type { Vacancy } from '@prisma/client';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { AppError } from '../utils/app-error';
import type { VacancyCreateInput, VacancyUpdateInput } from '../validations/vacancy.validation';

export class VacancyService {
  constructor(private readonly vacancyRepository = new VacancyRepository()) {}

  create(input: VacancyCreateInput): Promise<Vacancy> {
    return this.vacancyRepository.create(input);
  }

  async update(id: string, input: VacancyUpdateInput): Promise<Vacancy> {
    await this.ensureVacancyExists(id);

    return this.vacancyRepository.update(id, input);
  }

  async delete(id: string): Promise<Vacancy> {
    await this.ensureVacancyExists(id);

    return this.vacancyRepository.delete(id);
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

  private async ensureVacancyExists(id: string): Promise<void> {
    await this.getById(id);
  }
}
