import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from './app';
import { signAccessToken } from './utils/jwt';

vi.mock('./repositories/user.repository', () => ({
  UserRepository: vi.fn().mockImplementation(() => ({
    findByEmail: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    findManagers: vi.fn().mockResolvedValue([]),
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

  it('protects candidate routes with JWT authentication', async () => {
    const app = createApp();

    const response = await request(app).get('/candidates').send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing access token',
    });
  });

  it('blocks managers from managing candidates', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const response = await request(app)
      .post('/candidates')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: 'Forbidden',
    });
  });

  it('protects vacancy routes with JWT authentication', async () => {
    const app = createApp();

    const response = await request(app).get('/vacancies').send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing access token',
    });
  });

  it('blocks managers from managing vacancies', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const response = await request(app)
      .post('/vacancies')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: 'Forbidden',
    });
  });

  it('protects recruitment routes with JWT authentication', async () => {
    const app = createApp();

    const response = await request(app).get('/recruitments').send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing access token',
    });
  });

  it('blocks managers from creating recruitments', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const response = await request(app)
      .post('/recruitments')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: 'Forbidden',
    });
  });

  it('protects recruitment stage routes with JWT authentication', async () => {
    const app = createApp();

    const response = await request(app).patch('/stages/invalid/status').send({});

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing access token',
    });
  });

  it('blocks managers from stage assignment', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const response = await request(app)
      .patch('/stages/11111111-1111-4111-8111-111111111111/assignment')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ assigned_user_id: '11111111-1111-4111-8111-111111111111' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: 'Forbidden',
    });
  });

  it('protects manager listing with administrator authorization', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const unauthenticatedResponse = await request(app).get('/users/managers').send();
    expect(unauthenticatedResponse.status).toBe(401);

    const managerResponse = await request(app)
      .get('/users/managers')
      .set('Authorization', `Bearer ${managerToken}`)
      .send();

    expect(managerResponse.status).toBe(403);
    expect(managerResponse.body).toEqual({
      success: false,
      message: 'Forbidden',
    });
  });
});
