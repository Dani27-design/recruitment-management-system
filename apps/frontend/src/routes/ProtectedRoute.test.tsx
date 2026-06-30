import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../features/auth/AuthProvider';
import { tokenStorage } from '../utils/token-storage';
import { ProtectedRoute } from './ProtectedRoute';

function renderRoute() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    tokenStorage.clearAccessToken();

    renderRoute();

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders protected content when a token exists', () => {
    tokenStorage.setAccessToken('token');

    renderRoute();

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });
});
