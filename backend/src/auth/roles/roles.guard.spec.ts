import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { EcosystemRole } from './ecosystem-role.enum';
import { ROLES_KEY } from './roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: {
    getAllAndOverride: jest.Mock;
  };

  const createExecutionContext = (user?: AuthenticatedUser): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };

    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when the required roles array is empty', () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when the user has the required role', () => {
    reflector.getAllAndOverride.mockReturnValue([EcosystemRole.SpecPilotAdmin]);

    const user: AuthenticatedUser = {
      sub: 'admin-user-id',
      username: 'admin',
      email: 'admin@specpilot.dev',
      roles: [EcosystemRole.SpecPilotAdmin, EcosystemRole.SpecPilotUser],
    };

    const context = createExecutionContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when the user has one of several required roles', () => {
    reflector.getAllAndOverride.mockReturnValue([
      EcosystemRole.SpecPilotAdmin,
      EcosystemRole.SpecPilotUser,
    ]);

    const user: AuthenticatedUser = {
      sub: 'regular-user-id',
      username: 'user',
      email: 'user@specpilot.dev',
      roles: [EcosystemRole.SpecPilotUser],
    };

    const context = createExecutionContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when the user lacks the required role', () => {
    reflector.getAllAndOverride.mockReturnValue([EcosystemRole.SpecPilotAdmin]);

    const user: AuthenticatedUser = {
      sub: 'regular-user-id',
      username: 'user',
      email: 'user@specpilot.dev',
      roles: [EcosystemRole.SpecPilotUser],
    };

    const context = createExecutionContext(user);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access when the request has no authenticated user', () => {
    reflector.getAllAndOverride.mockReturnValue([EcosystemRole.SpecPilotAdmin]);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access when the user has no roles', () => {
    reflector.getAllAndOverride.mockReturnValue([EcosystemRole.SpecPilotAdmin]);

    const user: AuthenticatedUser = {
      sub: 'user-without-roles-id',
      username: 'user',
      email: 'user@specpilot.dev',
      roles: [],
    };

    const context = createExecutionContext(user);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should read roles from handler and controller metadata', () => {
    reflector.getAllAndOverride.mockReturnValue([EcosystemRole.SpecPilotAdmin]);

    const user: AuthenticatedUser = {
      sub: 'admin-user-id',
      username: 'admin',
      email: 'admin@specpilot.dev',
      roles: [EcosystemRole.SpecPilotAdmin],
    };

    const context = createExecutionContext(user);

    guard.canActivate(context);

    expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
