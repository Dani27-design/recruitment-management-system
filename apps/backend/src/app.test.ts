import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from './app';

vi.mock('./repositories/user.repository', () => ({
  UserRepository: vi.fn().mockImplementation(() => ({
    findByEmail: vi.fn().mockResolvedValue(null),
  })),
}));

describe('createApp', () => {
  it('registers auth routes and validation errors', async () => {
    const app = createApp();

    const response = await request(app).post('/auth/login').send({
      email: 'invalid-email',
      password: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('protects logout with JWT authentication', async () => {
    const app = createApp();

    const response = await request(app).post('/auth/logout').send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing access token',
    });
  });
});
