import { http } from '../api/http';
import type { Vacancy, VacancyFormInput } from '../types/vacancy';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listVacancies(): Promise<Vacancy[]> {
  const response = await http.get<ApiResponse<Vacancy[]>>('/vacancies');

  return response.data.data;
}

export async function getVacancy(id: string): Promise<Vacancy> {
  const response = await http.get<ApiResponse<Vacancy>>(`/vacancies/${id}`);

  return response.data.data;
}

export async function createVacancy(input: VacancyFormInput): Promise<Vacancy> {
  const response = await http.post<ApiResponse<Vacancy>>('/vacancies', input);

  return response.data.data;
}

export async function updateVacancy(id: string, input: Partial<VacancyFormInput>): Promise<Vacancy> {
  const response = await http.put<ApiResponse<Vacancy>>(`/vacancies/${id}`, input);

  return response.data.data;
}

export async function deleteVacancy(id: string): Promise<Vacancy> {
  const response = await http.delete<ApiResponse<Vacancy>>(`/vacancies/${id}`);

  return response.data.data;
}
