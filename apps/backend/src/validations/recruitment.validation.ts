import { z } from 'zod';

export const recruitmentCreateSchema = z.object({
  body: z.object({
    candidate_id: z.string().uuid(),
    vacancy_id: z.string().uuid(),
  }),
});

export const recruitmentIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type RecruitmentCreateInput = z.infer<typeof recruitmentCreateSchema>['body'];
