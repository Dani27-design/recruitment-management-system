import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
}));

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: mocks.user,
  }),
}));

describe('AppLayout', () => {
  beforeEach(() => {
    mocks.user = { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' };
  });

  it('renders protected application content with logout action', async () => {
    const { AppLayout } = await import('./AppLayout');

    render(
      <MemoryRouter>
        <AppLayout>
          <p>Protected content</p>
        </AppLayout>
      </MemoryRouter>,
    );

    expect(screen.getByText('Recruitment Management System')).toBeInTheDocument();
    expect(screen.getByText('Candidates')).toBeInTheDocument();
    expect(screen.getByText('Vacancies')).toBeInTheDocument();
    expect(screen.getByText('Recruitments')).toBeInTheDocument();
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('hides audit logs navigation from managers', async () => {
    mocks.user = { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' };
    const { AppLayout } = await import('./AppLayout');

    render(
      <MemoryRouter>
        <AppLayout>
          <p>Protected content</p>
        </AppLayout>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Audit Logs')).not.toBeInTheDocument();
  });
});
