import { beforeEach, describe, expect, it } from 'vitest';
import { tokenStorage } from './token-storage';

describe('tokenStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists and clears access tokens', () => {
    tokenStorage.setAccessToken('token');

    expect(tokenStorage.getAccessToken()).toBe('token');

    tokenStorage.clearAccessToken();

    expect(tokenStorage.getAccessToken()).toBeNull();
  });
});
