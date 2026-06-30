import { describe, expect, it } from 'vitest';
import { recruitmentCreateSchema, recruitmentIdParamSchema } from './recruitment.validation';

describe('recruitment validation schemas', () => {
  it('accepts valid recruitment create payloads', () => {
    const candidateId = '550e8400-e29b-41d4-a716-446655440000';
    const vacancyId = '550e8400-e29b-41d4-a716-446655440001';

    const parsed = recruitmentCreateSchema.parse({
      body: {
        candidate_id: candidateId,
        vacancy_id: vacancyId,
      },
    });

    expect(parsed.body).toEqual({
      candidate_id: candidateId,
      vacancy_id: vacancyId,
    });
  });

  it('rejects invalid recruitment identifiers', () => {
    expect(() =>
      recruitmentCreateSchema.parse({
        body: {
          candidate_id: 'candidate-1',
          vacancy_id: 'vacancy-1',
        },
      }),
    ).toThrow();
  });

  it('validates recruitment id params', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';

    expect(recruitmentIdParamSchema.parse({ params: { id } }).params.id).toBe(id);
  });
});
