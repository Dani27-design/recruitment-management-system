import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

describe('AppLayout', () => {
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
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
