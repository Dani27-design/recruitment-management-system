import { describe, expect, it } from 'vitest';
import { tokenStorage } from '../utils/token-storage';
import { http } from './http';

describe('http client', () => {
  it('adds bearer token authorization headers when a token exists', async () => {
    tokenStorage.setAccessToken('token');

    const requestInterceptor = http.interceptors.request as any;
    const config = await requestInterceptor.handlers[0].fulfilled?.({
      headers: {},
    } as any);

    expect(config?.headers.Authorization).toBe('Bearer token');
  });
});
