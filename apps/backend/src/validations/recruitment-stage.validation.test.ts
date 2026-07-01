import { describe, expect, it } from 'vitest';
import {
  recruitmentStageAssignmentSchema,
  recruitmentStageListParamSchema,
  recruitmentStageStatusUpdateSchema,
} from './recruitment-stage.validation';

const uuid = '11111111-1111-4111-8111-111111111111';

describe('recruitment-stage.validation', () => {
  it('validates recruitment stage list params', () => {
    expect(() =>
      recruitmentStageListParamSchema.parse({
        params: { id: uuid },
      }),
    ).not.toThrow();
  });

  it('validates stage status update input', () => {
    expect(() =>
      recruitmentStageStatusUpdateSchema.parse({
        params: { id: uuid },
        body: { status: 'PASSED', notes: 'Strong candidate' },
      }),
    ).not.toThrow();

    expect(() =>
      recruitmentStageStatusUpdateSchema.parse({
        params: { id: uuid },
        body: { status: 'PENDING' },
      }),
    ).toThrow();
  });

  it('requires status or notes', () => {
    expect(() =>
      recruitmentStageStatusUpdateSchema.parse({
        params: { id: uuid },
        body: {},
      }),
    ).toThrow();
  });

  it('validates stage assignment input', () => {
    expect(() =>
      recruitmentStageAssignmentSchema.parse({
        params: { id: uuid },
        body: { assigned_user_id: uuid },
      }),
    ).not.toThrow();

    expect(() =>
      recruitmentStageAssignmentSchema.parse({
        params: { id: uuid },
        body: { assigned_user_id: 'not-a-uuid' },
      }),
    ).toThrow();
  });
});
