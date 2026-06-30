import { describe, expect, it } from 'vitest';
import {
  candidateCreateSchema,
  candidateIdParamSchema,
  candidateListQuerySchema,
  candidateUpdateSchema,
} from './candidate.validation';

describe('candidate validation schemas', () => {
  it('accepts valid candidate create payloads', () => {
    const parsed = candidateCreateSchema.parse({
      body: {
        full_name: 'Jane Doe',
        email: 'JANE@example.com',
        phone_number: '+62 812-3456-7890',
      },
    });

    expect(parsed.body.email).toBe('jane@example.com');
  });

  it('rejects invalid phone numbers', () => {
    expect(() =>
      candidateCreateSchema.parse({
        body: {
          full_name: 'Jane Doe',
          email: 'jane@example.com',
          phone_number: 'phone!',
        },
      }),
    ).toThrow();
  });

  it('accepts partial candidate update payloads', () => {
    const parsed = candidateUpdateSchema.parse({
      params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      body: { full_name: 'Jane Updated' },
    });

    expect(parsed.body.full_name).toBe('Jane Updated');
  });

  it('validates candidate id params and list search query', () => {
    expect(
      candidateIdParamSchema.parse({
        params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      }).params.id,
    ).toBe('550e8400-e29b-41d4-a716-446655440000');

    expect(candidateListQuerySchema.parse({ query: { search: 'Jane' } }).query.search).toBe(
      'Jane',
    );
  });
});
