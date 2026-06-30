import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('HomePage', () => {
  it('renders protected application content', async () => {
    const { HomePage } = await import('./HomePage');

    render(<HomePage />);

    expect(screen.getByText('Protected Application')).toBeInTheDocument();
    expect(screen.getByText('Authentication is active.')).toBeInTheDocument();
  });
});
