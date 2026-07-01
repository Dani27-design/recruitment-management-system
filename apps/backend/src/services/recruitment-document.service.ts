import type { RecruitmentDocumentType } from '@prisma/client';
import { randomUUID } from 'crypto';
import path from 'path';
import {
  RecruitmentDocumentRepository,
  type RecruitmentDocumentWithUploader,
} from '../repositories/recruitment-document.repository';
import { RecruitmentRepository } from '../repositories/recruitment.repository';
import type { AuthenticatedUser } from '../types/auth';
import { AppError, ForbiddenError } from '../utils/app-error';
import { DocumentStorageService } from './document-storage.service';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const allowedMimeTypes: Record<RecruitmentDocumentType, string[]> = {
  CV: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  PORTFOLIO: ['application/pdf', 'image/png', 'image/jpeg'],
};

interface UploadDocumentInput {
  recruitmentId: string;
  documentType: RecruitmentDocumentType;
  file?: Express.Multer.File;
  user: AuthenticatedUser;
}

export class RecruitmentDocumentService {
  constructor(
    private readonly recruitmentDocumentRepository = new RecruitmentDocumentRepository(),
    private readonly recruitmentRepository = new RecruitmentRepository(),
    private readonly documentStorageService = new DocumentStorageService(),
  ) {}

  async listByRecruitmentId(
    recruitmentId: string,
    user: AuthenticatedUser,
  ): Promise<RecruitmentDocumentWithUploader[]> {
    await this.ensureRecruitmentAccess(recruitmentId, user);

    return this.recruitmentDocumentRepository.listByRecruitmentId(recruitmentId);
  }

  async upload(input: UploadDocumentInput): Promise<RecruitmentDocumentWithUploader> {
    await this.ensureRecruitmentAccess(input.recruitmentId, input.user);
    this.validateFile(input.documentType, input.file);

    const file = input.file!;
    const storedFilename = this.buildStoredFilename(file.originalname);
    const storagePath = `${input.recruitmentId}/${storedFilename}`;
    const storageResult = await this.documentStorageService.upload({
      buffer: file.buffer,
      mimeType: file.mimetype,
      storagePath,
    });

    try {
      return await this.recruitmentDocumentRepository.create({
        recruitment_id: input.recruitmentId,
        document_type: input.documentType,
        original_filename: file.originalname,
        stored_filename: storedFilename,
        mime_type: file.mimetype,
        file_size: file.size,
        storage_provider: storageResult.storage_provider,
        storage_path: storageResult.storage_path,
        uploaded_by: input.user.id,
      });
    } catch (error) {
      await this.documentStorageService.deletePhysicalFile(storagePath);
      throw error;
    }
  }

  async createDownloadUrl(id: string, user: AuthenticatedUser): Promise<{ url: string }> {
    const document = await this.getAccessibleDocument(id, user);
    const url = await this.documentStorageService.createSignedDownloadUrl(document.storage_path);

    return { url };
  }

  async softDelete(id: string, user: AuthenticatedUser): Promise<RecruitmentDocumentWithUploader> {
    if (user.role !== 'ADMINISTRATOR') {
      throw new ForbiddenError('Only administrators may delete recruitment documents');
    }

    const document = await this.getAccessibleDocument(id, user);

    return this.recruitmentDocumentRepository.softDelete(document.id);
  }

  private async getAccessibleDocument(id: string, user: AuthenticatedUser) {
    const document = await this.recruitmentDocumentRepository.findById(id);

    if (!document) {
      throw new AppError('Recruitment document not found', 404);
    }

    await this.ensureRecruitmentAccess(document.recruitment_id, user);

    return document;
  }

  private async ensureRecruitmentAccess(recruitmentId: string, user: AuthenticatedUser) {
    const recruitment =
      user.role === 'ADMINISTRATOR'
        ? await this.recruitmentRepository.findById(recruitmentId)
        : await this.recruitmentRepository.findAssignedById(recruitmentId, user.id);

    if (!recruitment) {
      throw new AppError('Recruitment not found', 404);
    }
  }

  private validateFile(documentType: RecruitmentDocumentType, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError('Document file is required', 400);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new AppError('Document file size exceeds 10 MB', 400);
    }

    if (!allowedMimeTypes[documentType].includes(file.mimetype)) {
      throw new AppError('Unsupported file type for document type', 400);
    }
  }

  private buildStoredFilename(originalFilename: string) {
    const extension = path.extname(originalFilename).toLowerCase();

    return `${randomUUID()}${extension}`;
  }
}
