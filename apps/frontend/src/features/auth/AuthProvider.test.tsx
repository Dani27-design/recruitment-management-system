import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';

vi.mock('../../services/auth-service', () => ({
  loginRequest: vi.fn().mockResolvedValue({
    accessToken: 'token',
    user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
  logoutRequest: vi.fn().mockResolvedValue(undefined),
}));

function TestConsumer() {
  const { isAuthenticated, login, user } = useAuth();

  return (
    <button onClick={() => login({ email: 'admin@rms.local', password: 'Admin@12345' })}>
      {isAuthenticated ? user?.role ?? 'Authenticated' : 'Anonymous'}
    </button>
  );
}

describe('AuthProvider', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('updates authentication state after login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    screen.getByRole('button', { name: 'Anonymous' }).click();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ADMINISTRATOR' })).toBeInTheDocument();
    });
  });

  it('hydrates the authenticated user from a stored token', () => {
    const payload = window.btoa(
      JSON.stringify({ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }),
    );
    window.localStorage.setItem('rms_access_token', `header.${payload}.signature`);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByRole('button', { name: 'MANAGER' })).toBeInTheDocument();
  });
});
