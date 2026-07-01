import { describe, expect, it } from 'vitest';
import { createStorageClient, ensureStorageConfig } from './storage';

describe('storage config', () => {
  it('creates a Supabase storage client from explicit configuration', () => {
    const client = createStorageClient({
      url: 'https://example.supabase.co',
      serviceRoleKey: 'service-key',
    });

    expect(client.storage).toBeDefined();
  });

  it('rejects missing storage credentials', () => {
    expect(() => ensureStorageConfig({})).toThrow('Storage provider is not configured');
  });
});
