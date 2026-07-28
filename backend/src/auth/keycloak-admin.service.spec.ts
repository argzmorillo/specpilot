import { BadGatewayException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { KeycloakAdminService } from './keycloak-admin.service';
import { EcosystemRole } from './roles/ecosystem-role.enum';

describe('KeycloakAdminService', () => {
  let service: KeycloakAdminService;

  const fetchMock = jest.fn();

  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        KEYCLOAK_BASE_URL: 'http://localhost:8080',
        KEYCLOAK_REALM: 'specpilot',
        KEYCLOAK_ADMIN_CLIENT_ID: 'specpilot-admin-api',
        KEYCLOAK_ADMIN_CLIENT_SECRET: 'secret',
      };

      return values[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    global.fetch = fetchMock as typeof fetch;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakAdminService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get(KeycloakAdminService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should assign a realm role', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'admin-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'role-id',
          name: EcosystemRole.SpecPilotUser,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    await expect(
      service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser),
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should request an access token using client credentials', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'admin-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'role-id',
          name: EcosystemRole.SpecPilotUser,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    await service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser);

    const [, options] = fetchMock.mock.calls[0];

    const body = (options as RequestInit).body as URLSearchParams;

    expect(body.get('grant_type')).toBe('client_credentials');
    expect(body.get('client_id')).toBe('specpilot-admin-api');
    expect(body.get('client_secret')).toBe('secret');
  });

  it('should throw when authentication fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue('Unauthorized'),
    });

    await expect(
      service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('should throw when access token is missing', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(
      service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should throw when role lookup fails', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'admin-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Role not found'),
      });

    await expect(
      service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('should throw when role assignment fails', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'admin-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'role-id',
          name: EcosystemRole.SpecPilotUser,
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: jest.fn().mockResolvedValue('Forbidden'),
      });

    await expect(
      service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('should call the Keycloak endpoints in the expected order', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'admin-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'role-id',
          name: EcosystemRole.SpecPilotUser,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    await service.assignRealmRole('user-id', EcosystemRole.SpecPilotUser);

    expect(fetchMock.mock.calls[0][0]).toContain('/protocol/openid-connect/token');

    expect(fetchMock.mock.calls[1][0]).toContain('/roles/');

    expect(fetchMock.mock.calls[2][0]).toContain('/role-mappings/realm');
  });
});
