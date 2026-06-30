import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';

vi.mock('../../services/auth-service', () => ({
  loginRequest: vi.fn().mockResolvedValue({
    accessToken: 'token',
    user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
  logoutRequest: vi.fn().mockResolvedValue(undefined),
}));

function TestConsumer() {
  const { isAuthenticated, login } = useAuth();

  return (
    <button onClick={() => login({ email: 'admin@rms.local', password: 'Admin@12345' })}>
      {isAuthenticated ? 'Authenticated' : 'Anonymous'}
    </button>
  );
}

describe('AuthProvider', () => {
  it('updates authentication state after login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    screen.getByRole('button', { name: 'Anonymous' }).click();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Authenticated' })).toBeInTheDocument();
    });
  });
});
