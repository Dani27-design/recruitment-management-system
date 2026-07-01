import { describe, expect, it } from 'vitest';
import { auditLogListQuerySchema } from './audit.validation';

describe('audit validation', () => {
  it('accepts supported audit filters', () => {
    expect(
      auditLogListQuerySchema.safeParse({
        query: { entity_type: 'CANDIDATE', event_type: 'CREATE' },
      }).success,
    ).toBe(true);
  });

  it('rejects unsupported audit filters', () => {
    expect(
      auditLogListQuerySchema.safeParse({
        query: { entity_type: 'UNKNOWN', event_type: 'CREATE' },
      }).success,
    ).toBe(false);
    expect(
      auditLogListQuerySchema.safeParse({
        query: { entity_type: 'CANDIDATE', event_type: 'LOGIN' },
      }).success,
    ).toBe(false);
  });
});
