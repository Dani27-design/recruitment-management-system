import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

interface StorageConfig {
  url?: string;
  serviceRoleKey?: string;
}

export function ensureStorageConfig(config: StorageConfig = {
  url: env.SUPABASE_URL,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
}) {
  if (!config.url || !config.serviceRoleKey) {
    throw new Error('Storage provider is not configured');
  }

  return {
    url: config.url,
    serviceRoleKey: config.serviceRoleKey,
  };
}

export function createStorageClient(config?: StorageConfig): SupabaseClient {
  const resolvedConfig = ensureStorageConfig(config);

  return createClient(resolvedConfig.url, resolvedConfig.serviceRoleKey);
}

export const storageClient = createStorageClient;
