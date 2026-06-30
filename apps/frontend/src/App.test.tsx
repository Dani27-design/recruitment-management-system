import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the login page for unauthenticated users', () => {
    window.history.pushState({}, '', '/');
    window.localStorage.clear();

    render(<App />);

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
