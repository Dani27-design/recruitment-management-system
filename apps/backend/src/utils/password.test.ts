import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password utilities', () => {
  it('hashes and verifies passwords with bcrypt', async () => {
    const hash = await hashPassword('Admin@12345');

    expect(hash).not.toBe('Admin@12345');
    await expect(verifyPassword('Admin@12345', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });
});
