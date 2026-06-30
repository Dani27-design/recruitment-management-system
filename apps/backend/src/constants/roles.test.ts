import { describe, expect, it } from 'vitest';
import { USER_ROLES } from './roles';

describe('USER_ROLES', () => {
  it('defines the administrator and manager roles required by the PRD', () => {
    expect(USER_ROLES).toEqual({
      ADMINISTRATOR: 'ADMINISTRATOR',
      MANAGER: 'MANAGER',
    });
  });
});
