import { describe, expect, it } from 'vitest';
import {
  vacancyCreateSchema,
  vacancyIdParamSchema,
  vacancyStatusSchema,
  vacancyUpdateSchema,
} from './vacancy.validation';

describe('vacancy validation schemas', () => {
  it('accepts valid vacancy create payloads', () => {
    const parsed = vacancyCreateSchema.parse({
      body: {
        position_name: 'Software Engineer',
        department: 'Engineering',
        hiring_needed: '2',
        status: 'ACTIVE',
      },
    });

    expect(parsed.body.hiring_needed).toBe(2);
    expect(parsed.body.status).toBe('ACTIVE');
  });

  it('rejects invalid hiring needed values', () => {
    expect(() =>
      vacancyCreateSchema.parse({
        body: {
          position_name: 'Software Engineer',
          department: 'Engineering',
          hiring_needed: 0,
          status: 'ACTIVE',
        },
      }),
    ).toThrow();
  });

  it('accepts only documented vacancy statuses', () => {
    expect(vacancyStatusSchema.parse('ACTIVE')).toBe('ACTIVE');
    expect(vacancyStatusSchema.parse('INACTIVE')).toBe('INACTIVE');
    expect(() => vacancyStatusSchema.parse('CLOSED')).toThrow();
  });

  it('accepts partial vacancy update payloads and id params', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';

    expect(
      vacancyUpdateSchema.parse({
        params: { id },
        body: { status: 'INACTIVE' },
      }).body.status,
    ).toBe('INACTIVE');
    expect(vacancyIdParamSchema.parse({ params: { id } }).params.id).toBe(id);
  });
});
