import { EcosystemRole } from '../roles/ecosystem-role.enum';
import { extractRolesFromToken } from './extract-roles.util';

describe('extractRolesFromToken', () => {
  it('extracts ecosystem roles from realm roles', () => {
    const roles = extractRolesFromToken({
      realm_access: {
        roles: ['specpilot_user', 'offline_access'],
      },
    });
    expect(roles).toEqual([EcosystemRole.SpecPilotUser]);
  });

  it('extracts ecosystem roles from client roles', () => {
    const roles = extractRolesFromToken({
      resource_access: {
        'specpilot-api': {
          roles: ['specpilot_admin'],
        },
      },
    });
    expect(roles).toEqual([EcosystemRole.SpecPilotAdmin]);
  });

  it('ignores unknown roles', () => {
    const roles = extractRolesFromToken({
      realm_access: {
        roles: ['authorization', 'random_role'],
      },
    });
    expect(roles).toEqual([]);
  });
});
