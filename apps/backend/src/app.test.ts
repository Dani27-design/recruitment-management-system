import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from './app';
import { signAccessToken } from './utils/jwt';

vi.mock('./repositories/dashboard.repository', () => ({
  DashboardRepository: vi.fn().mockImplementation(() => ({
    countActiveVacancies: vi.fn().mockResolvedValue(0),
    countCandidates: vi.fn().mockResolvedValue(0),
    countRecruitments: vi.fn().mockResolvedValue(0),
    listRecruitmentStageSnapshots: vi.fn().mockResolvedValue([]),
  })),
}));

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

  it('protects recruitment document routes with JWT authentication', async () => {
    const app = createApp();

    const listResponse = await request(app).get('/recruitments/invalid/documents').send();
    const downloadResponse = await request(app).get('/documents/invalid/download').send();

    expect(listResponse.status).toBe(401);
    expect(downloadResponse.status).toBe(401);
  });

  it('protects dashboard summary routes with JWT authentication and permits managers', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const unauthenticatedResponse = await request(app).get('/dashboard/summary').send();
    const managerResponse = await request(app)
      .get('/dashboard/summary')
      .set('Authorization', `Bearer ${managerToken}`)
      .send();

    expect(unauthenticatedResponse.status).toBe(401);
    expect(managerResponse.status).toBe(200);
    expect(managerResponse.body).toMatchObject({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: {
        total_candidates: 0,
        total_active_vacancies: 0,
        total_recruitments: 0,
      },
    });
  });

  it('blocks managers from deleting recruitment documents', async () => {
    const app = createApp();
    const managerToken = signAccessToken({
      id: 'manager-1',
      email: 'manager@rms.local',
      role: 'MANAGER',
    });

    const response = await request(app)
      .delete('/documents/11111111-1111-4111-8111-111111111111')
      .set('Authorization', `Bearer ${managerToken}`)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: 'Forbidden',
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
