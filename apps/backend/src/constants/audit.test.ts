import { describe, expect, it } from 'vitest';
import { AUDIT_ENTITY_TYPES, AUDIT_EVENT_TYPES } from './audit';

describe('audit constants', () => {
  it('defines supported audit event and entity types', () => {
    expect(AUDIT_EVENT_TYPES).toEqual({
      CREATE: 'CREATE',
      DELETE: 'DELETE',
      UPDATE: 'UPDATE',
    });
    expect(AUDIT_ENTITY_TYPES).toMatchObject({
      CANDIDATE: 'CANDIDATE',
      RECRUITMENT: 'RECRUITMENT',
      RECRUITMENT_DOCUMENT: 'RECRUITMENT_DOCUMENT',
      RECRUITMENT_STAGE: 'RECRUITMENT_STAGE',
      VACANCY: 'VACANCY',
    });
  });
});
