import type { Request, Response } from 'express';
import { VacancyService } from '../services/vacancy.service';
import { sendSuccess } from '../utils/api-response';

export class VacancyController {
  constructor(private readonly vacancyService = new VacancyService()) {}

  list = async (_req: Request, res: Response) => {
    const vacancies = await this.vacancyService.list();

    return sendSuccess(res, 200, 'Vacancies retrieved successfully', vacancies);
  };

  getById = async (req: Request, res: Response) => {
    const vacancy = await this.vacancyService.getById(req.params.id);

    return sendSuccess(res, 200, 'Vacancy retrieved successfully', vacancy);
  };

  create = async (req: Request, res: Response) => {
    const vacancy = await this.vacancyService.create(req.body, req.user!.id);

    return sendSuccess(res, 201, 'Vacancy created successfully', vacancy);
  };

  update = async (req: Request, res: Response) => {
    const vacancy = await this.vacancyService.update(req.params.id, req.body, req.user!.id);

    return sendSuccess(res, 200, 'Vacancy updated successfully', vacancy);
  };

  delete = async (req: Request, res: Response) => {
    const vacancy = await this.vacancyService.delete(req.params.id, req.user!.id);

    return sendSuccess(res, 200, 'Vacancy deleted successfully', vacancy);
  };
}
