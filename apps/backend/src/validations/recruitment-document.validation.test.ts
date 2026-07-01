import { describe, expect, it } from 'vitest';
import {
  recruitmentDocumentIdParamSchema,
  recruitmentDocumentListParamSchema,
  recruitmentDocumentUploadSchema,
} from './recruitment-document.validation';

const uuid = '11111111-1111-4111-8111-111111111111';

describe('recruitment-document.validation', () => {
  it('validates recruitment document list params', () => {
    expect(() =>
      recruitmentDocumentListParamSchema.parse({
        params: { id: uuid },
      }),
    ).not.toThrow();
  });

  it('validates upload document types', () => {
    expect(() =>
      recruitmentDocumentUploadSchema.parse({
        params: { id: uuid },
        body: { document_type: 'CV' },
      }),
    ).not.toThrow();
    expect(() =>
      recruitmentDocumentUploadSchema.parse({
        params: { id: uuid },
        body: { document_type: 'UNKNOWN' },
      }),
    ).toThrow();
  });

  it('validates document identifiers', () => {
    expect(() =>
      recruitmentDocumentIdParamSchema.parse({
        params: { id: uuid },
      }),
    ).not.toThrow();
  });
});
