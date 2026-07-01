import { describe, expect, it } from 'vitest';
import { uploadDocumentFile } from './upload.middleware';

describe('uploadDocumentFile', () => {
  it('configures a single file upload middleware', () => {
    expect(uploadDocumentFile.single('file')).toEqual(expect.any(Function));
  });
});
