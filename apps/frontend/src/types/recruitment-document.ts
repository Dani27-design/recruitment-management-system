export type RecruitmentDocumentType = 'CV' | 'PORTFOLIO';

export interface RecruitmentDocument {
  id: string;
  recruitment_id: string;
  document_type: RecruitmentDocumentType;
  original_filename: string;
  stored_filename: string;
  mime_type: string;
  file_size: number;
  storage_provider: string;
  storage_path: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uploader?: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export interface RecruitmentDocumentUploadInput {
  document_type: RecruitmentDocumentType;
  file: File;
}
