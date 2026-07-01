import { http } from '../api/http';
import type {
  RecruitmentDocument,
  RecruitmentDocumentUploadInput,
} from '../types/recruitment-document';

interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export async function listRecruitmentDocuments(
  recruitmentId: string,
): Promise<RecruitmentDocument[]> {
  const response = await http.get<ApiResponse<RecruitmentDocument[]>>(
    `/recruitments/${recruitmentId}/documents`,
  );

  return response.data.data;
}

export async function uploadRecruitmentDocument(
  recruitmentId: string,
  input: RecruitmentDocumentUploadInput,
): Promise<RecruitmentDocument> {
  const formData = new FormData();
  formData.append('document_type', input.document_type);
  formData.append('file', input.file);

  const response = await http.post<ApiResponse<RecruitmentDocument>>(
    `/recruitments/${recruitmentId}/documents`,
    formData,
  );

  return response.data.data;
}

export async function createRecruitmentDocumentDownloadUrl(documentId: string): Promise<string> {
  const response = await http.get<ApiResponse<{ url: string }>>(
    `/documents/${documentId}/download`,
  );

  return response.data.data.url;
}

export async function deleteRecruitmentDocument(documentId: string): Promise<RecruitmentDocument> {
  const response = await http.delete<ApiResponse<RecruitmentDocument>>(`/documents/${documentId}`);

  return response.data.data;
}
