import { http } from '../api/http';
import type { AuditLog, AuditLogFilters } from '../types/audit';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLog[]> {
  const response = await http.get<ApiResponse<AuditLog[]>>('/audit-logs', {
    params: filters,
  });

  return response.data.data;
}
