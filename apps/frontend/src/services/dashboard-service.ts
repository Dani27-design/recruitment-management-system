import { http } from '../api/http';
import type { DashboardSummary } from '../types/dashboard';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await http.get<ApiResponse<DashboardSummary>>('/dashboard/summary');

  return response.data.data;
}
