import { http } from '../api/http';
import type { RecruitmentStage, RecruitmentStageUpdateInput } from '../types/recruitment';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listRecruitmentStages(recruitmentId: string): Promise<RecruitmentStage[]> {
  const response = await http.get<ApiResponse<RecruitmentStage[]>>(
    `/recruitments/${recruitmentId}/stages`,
  );

  return response.data.data;
}

export async function updateRecruitmentStage(
  stageId: string,
  input: RecruitmentStageUpdateInput,
): Promise<RecruitmentStage> {
  const response = await http.patch<ApiResponse<RecruitmentStage>>(
    `/stages/${stageId}/status`,
    input,
  );

  return response.data.data;
}

export async function assignRecruitmentStageManager(
  stageId: string,
  assignedUserId: string,
): Promise<RecruitmentStage> {
  const response = await http.patch<ApiResponse<RecruitmentStage>>(
    `/stages/${stageId}/assignment`,
    { assigned_user_id: assignedUserId },
  );

  return response.data.data;
}
