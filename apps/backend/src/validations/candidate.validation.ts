import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(20)
  .regex(/^[+]?[\d\s()-]+$/, 'Phone number contains invalid characters');

export const candidateCreateSchema = z.object({
  body: z.object({
    full_name: z.string().trim().min(1),
    email: z.string().trim().email().toLowerCase(),
    phone_number: phoneSchema,
  }),
});

export const candidateUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    full_name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    phone_number: phoneSchema.optional(),
  }),
});

export const candidateIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const candidateListQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
  }),
});

export type CandidateCreateInput = z.infer<typeof candidateCreateSchema>['body'];
export type CandidateUpdateInput = z.infer<typeof candidateUpdateSchema>['body'];
export type CandidateListQuery = z.infer<typeof candidateListQuerySchema>['query'];
