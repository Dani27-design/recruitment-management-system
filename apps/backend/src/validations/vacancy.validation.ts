import { z } from 'zod';

export const vacancyStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const vacancyCreateSchema = z.object({
  body: z.object({
    position_name: z.string().trim().min(1),
    department: z.string().trim().min(1),
    hiring_needed: z.coerce.number().int().min(1),
    status: vacancyStatusSchema,
  }),
});

export const vacancyUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    position_name: z.string().trim().min(1).optional(),
    department: z.string().trim().min(1).optional(),
    hiring_needed: z.coerce.number().int().min(1).optional(),
    status: vacancyStatusSchema.optional(),
  }),
});

export const vacancyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type VacancyCreateInput = z.infer<typeof vacancyCreateSchema>['body'];
export type VacancyUpdateInput = z.infer<typeof vacancyUpdateSchema>['body'];
