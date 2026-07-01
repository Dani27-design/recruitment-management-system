import { z } from 'zod';

const statusSchema = z.enum(['PASSED', 'REJECTED']);

export const recruitmentStageListParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const recruitmentStageStatusUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      status: statusSchema.optional(),
      notes: z.string().max(2000).nullable().optional(),
    })
    .refine((value) => value.status !== undefined || value.notes !== undefined, {
      message: 'Status or notes is required',
    }),
});

export const recruitmentStageAssignmentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    assigned_user_id: z.string().uuid(),
  }),
});

export type RecruitmentStageStatusUpdateInput = z.infer<
  typeof recruitmentStageStatusUpdateSchema
>['body'];

export type RecruitmentStageAssignmentInput = z.infer<
  typeof recruitmentStageAssignmentSchema
>['body'];
