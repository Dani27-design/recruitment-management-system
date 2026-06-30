import { http } from '../api/http';
import type { Recruitment, RecruitmentFormInput } from '../types/recruitment';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listRecruitments(): Promise<Recruitment[]> {
  const response = await http.get<ApiResponse<Recruitment[]>>('/recruitments');

  return response.data.data;
}

export async function getRecruitment(id: string): Promise<Recruitment> {
  const response = await http.get<ApiResponse<Recruitment>>(`/recruitments/${id}`);

  return response.data.data;
}

export async function createRecruitment(input: RecruitmentFormInput): Promise<Recruitment> {
  const response = await http.post<ApiResponse<Recruitment>>('/recruitments', input);

  return response.data.data;
}
