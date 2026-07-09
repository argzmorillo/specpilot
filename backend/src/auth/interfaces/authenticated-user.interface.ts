import type { EcosystemRole } from '../roles/ecosystem-role.enum';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  name?: string;
  username?: string;
  roles: EcosystemRole[];
}
