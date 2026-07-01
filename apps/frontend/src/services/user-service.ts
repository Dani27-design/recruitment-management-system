import { http } from '../api/http';
import type { AuthUser } from '../types/auth';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listManagers(): Promise<AuthUser[]> {
  const response = await http.get<ApiResponse<AuthUser[]>>('/users/managers');

  return response.data.data;
}
