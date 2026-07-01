import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuditTable } from './AuditTable';

const auditLog = {
  id: 'audit-1',
  entity_type: 'CANDIDATE' as const,
  entity_id: 'candidate-1',
  event_type: 'UPDATE' as const,
  actor_id: 'admin-1',
  actor: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' as const },
  changes: {
    before: { full_name: 'Jane' },
    after: { full_name: 'Jane Doe' },
    changed_fields: ['full_name'],
  },
  created_at: '2026-07-02T00:00:00.000Z',
};

describe('AuditTable', () => {
  it('renders audit log rows', () => {
    render(<AuditTable auditLogs={[auditLog]} />);

    expect(screen.getByText('admin@rms.local')).toBeInTheDocument();
    expect(screen.getByText('CANDIDATE')).toBeInTheDocument();
    expect(screen.getByText('UPDATE')).toBeInTheDocument();
    expect(screen.getByText('full_name')).toBeInTheDocument();
  });

  it('renders an empty audit state', () => {
    render(<AuditTable auditLogs={[]} />);

    expect(screen.getByText('No audit logs found.')).toBeInTheDocument();
  });
});
