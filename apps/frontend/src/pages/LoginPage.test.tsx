import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders the login form', async () => {
    const { LoginPage } = await import('./LoginPage');

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
