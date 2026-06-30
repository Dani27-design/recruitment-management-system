import { http } from '../api/http';
import type { Candidate, CandidateFormInput, CandidateListParams } from '../types/candidate';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listCandidates(params: CandidateListParams = {}): Promise<Candidate[]> {
  const response = await http.get<ApiResponse<Candidate[]>>('/candidates', {
    params,
  });

  return response.data.data;
}

export async function getCandidate(id: string): Promise<Candidate> {
  const response = await http.get<ApiResponse<Candidate>>(`/candidates/${id}`);

  return response.data.data;
}

export async function createCandidate(input: CandidateFormInput): Promise<Candidate> {
  const response = await http.post<ApiResponse<Candidate>>('/candidates', input);

  return response.data.data;
}

export async function updateCandidate(id: string, input: Partial<CandidateFormInput>): Promise<Candidate> {
  const response = await http.put<ApiResponse<Candidate>>(`/candidates/${id}`, input);

  return response.data.data;
}

export async function deleteCandidate(id: string): Promise<Candidate> {
  const response = await http.delete<ApiResponse<Candidate>>(`/candidates/${id}`);

  return response.data.data;
}
