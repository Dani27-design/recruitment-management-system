import { describe, expect, it } from 'vitest';
import { buildErrorResponse, buildSuccessResponse } from './api-response';

describe('api response helpers', () => {
  it('builds standardized success responses', () => {
    expect(buildSuccessResponse('OK', { id: '1' })).toEqual({
      success: true,
      message: 'OK',
      data: { id: '1' },
    });
  });

  it('builds standardized error responses', () => {
    expect(buildErrorResponse('Invalid', { email: 'Required' })).toEqual({
      success: false,
      message: 'Invalid',
      errors: { email: 'Required' },
    });
  });
});
