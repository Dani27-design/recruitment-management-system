import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma/client';

const recruitmentDocumentInclude = {
  uploader: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.RecruitmentDocumentInclude;

export type RecruitmentDocumentWithUploader = Prisma.RecruitmentDocumentGetPayload<{
  include: typeof recruitmentDocumentInclude;
}>;

export type RecruitmentDocumentCreateInput = {
  recruitment_id: string;
  document_type: Prisma.RecruitmentDocumentCreateInput['document_type'];
  original_filename: string;
  stored_filename: string;
  mime_type: string;
  file_size: number;
  storage_provider: string;
  storage_path: string;
  uploaded_by: string;
};

export class RecruitmentDocumentRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: RecruitmentDocumentCreateInput): Promise<RecruitmentDocumentWithUploader> {
    return this.db.recruitmentDocument.create({
      data: input,
      include: recruitmentDocumentInclude,
    });
  }

  findById(id: string): Promise<RecruitmentDocumentWithUploader | null> {
    return this.db.recruitmentDocument.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: recruitmentDocumentInclude,
    });
  }

  listByRecruitmentId(recruitmentId: string): Promise<RecruitmentDocumentWithUploader[]> {
    return this.db.recruitmentDocument.findMany({
      where: {
        recruitment_id: recruitmentId,
        deleted_at: null,
      },
      include: recruitmentDocumentInclude,
      orderBy: { created_at: 'desc' },
    });
  }

  softDelete(id: string): Promise<RecruitmentDocumentWithUploader> {
    return this.db.recruitmentDocument.update({
      where: { id },
      data: { deleted_at: new Date() },
      include: recruitmentDocumentInclude,
    });
  }
}
