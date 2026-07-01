import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';

describe('parseEnv', () => {
  it('parses required environment variables and defaults optional values', () => {
    const parsed = parseEnv({
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rms',
      JWT_SECRET: 'secret',
    });

    expect(parsed.PORT).toBe(4000);
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.FRONTEND_URL).toBe('http://localhost:5173');
    expect(parsed.STORAGE_BUCKET_NAME).toBe('database');
  });

  it('rejects missing required environment variables', () => {
    expect(() => parseEnv({})).toThrow();
  });
});
