import { vi } from 'vitest';

vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/rms');
vi.stubEnv('JWT_SECRET', 'unit-test-secret');
vi.stubEnv('JWT_EXPIRES_IN', '1h');
vi.stubEnv('FRONTEND_URL', 'http://localhost:5173');
