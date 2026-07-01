import { describe, expect, it, vi } from 'vitest';
import { ForbiddenError, UnauthorizedError } from '../utils/app-error';
import { requireStageOwnership } from './stage-ownership.middleware';

describe('requireStageOwnership', () => {
  it('allows administrators without loading the stage', async () => {
    const next = vi.fn();
    const repository = { findById: vi.fn() };
    const middleware = requireStageOwnership(repository as any);

    await middleware(
      { user: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' } } as any,
      {} as any,
      next,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('allows managers assigned to the stage', async () => {
    const next = vi.fn();
    const middleware = requireStageOwnership({
      findById: vi.fn().mockResolvedValue({ id: 'stage-1', assigned_user_id: 'manager-1' }),
    } as any);

    await middleware(
      {
        params: { id: 'stage-1' },
        user: { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' },
      } as any,
      {} as any,
      next,
    );

    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects unauthenticated users and unassigned managers', async () => {
    await expect(
      requireStageOwnership({ findById: vi.fn() } as any)({} as any, {} as any, vi.fn()),
    ).rejects.toBeInstanceOf(UnauthorizedError);

    await expect(
      requireStageOwnership({
        findById: vi.fn().mockResolvedValue({ id: 'stage-1', assigned_user_id: 'manager-2' }),
      } as any)(
        {
          params: { id: 'stage-1' },
          user: { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' },
        } as any,
        {} as any,
        vi.fn(),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
