import { http } from '../api/http';
import type { LoginRequest, LoginResponse } from '../types/auth';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function loginRequest(input: LoginRequest): Promise<LoginResponse> {
  const response = await http.post<ApiResponse<LoginResponse>>('/auth/login', input);

  return response.data.data;
}

export async function logoutRequest(): Promise<void> {
  await http.post('/auth/logout');
}
