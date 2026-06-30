import type { PrismaClient, Vacancy } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { VacancyCreateInput, VacancyUpdateInput } from '../validations/vacancy.validation';

export class VacancyRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: VacancyCreateInput): Promise<Vacancy> {
    return this.db.vacancy.create({
      data: input,
    });
  }

  update(id: string, input: VacancyUpdateInput): Promise<Vacancy> {
    return this.db.vacancy.update({
      where: { id },
      data: input,
    });
  }

  delete(id: string): Promise<Vacancy> {
    return this.db.vacancy.delete({
      where: { id },
    });
  }

  findById(id: string): Promise<Vacancy | null> {
    return this.db.vacancy.findUnique({
      where: { id },
    });
  }

  list(): Promise<Vacancy[]> {
    return this.db.vacancy.findMany({
      orderBy: { created_at: 'desc' },
    });
  }
}
