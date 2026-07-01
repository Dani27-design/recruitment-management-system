import { z } from 'zod';

export const documentTypeSchema = z.enum(['CV', 'PORTFOLIO']);

export const recruitmentDocumentListParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const recruitmentDocumentUploadSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    document_type: documentTypeSchema,
  }),
});

export const recruitmentDocumentIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type RecruitmentDocumentUploadInput = z.infer<
  typeof recruitmentDocumentUploadSchema
>['body'];
