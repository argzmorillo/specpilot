import { SetMetadata } from '@nestjs/common';

import type { EcosystemRole } from './ecosystem-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: EcosystemRole[]) => SetMetadata(ROLES_KEY, roles);
