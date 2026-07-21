/// <reference types="jest" />

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => 'test-secret'),
}));

import type { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AccessRequestStatus, RequestedApplication } from '@prisma/client';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { EcosystemRole } from '../src/auth/roles/ecosystem-role.enum';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AccessRequestController (e2e)', () => {
  let app: INestApplication;

  const user = {
    sub: 'keycloak-user-id',
    email: 'user@example.com',
    name: 'Test User',
    username: 'testuser',
    roles: [EcosystemRole.SpecPilotUser],
  };

  const accessRequest = {
    id: 'access-request-id',
    keycloakUserId: user.sub,
    email: user.email,
    fullName: user.name,
    requestedApplication: RequestedApplication.SPECPILOT,
    status: AccessRequestStatus.PENDING,
    message: 'I want access',
    adminNotes: null,
    reviewedAt: null,
    reviewedByUserId: null,
    approvedRole: null,
    createdAt: new Date('2026-07-18T10:00:00.000Z'),
    updatedAt: new Date('2026-07-18T10:00:00.000Z'),
  };

  const prismaMock = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    accessRequest: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const authenticatedGuardMock: CanActivate = {
    canActivate(context: ExecutionContext): boolean {
      const httpContext = context.switchToHttp();
      const requestObject = httpContext.getRequest();

      requestObject.user = user;

      return true;
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'KEYCLOAK_ISSUER_URL') {
            return 'http://keycloak-test/realms/ecosystem';
          }

          if (key === 'KEYCLOAK_CLIENT_ID') {
            return 'specpilot-api';
          }

          if (key === 'KEYCLOAK_JWKS_URI') {
            return 'http://localhost:8080/realms/ecosystem/protocol/openid-connect/certs';
          }

          if (key === 'OPENAI_API_KEY') {
            return 'fake-api-key';
          }

          if (key === 'OPENAI_MODEL') {
            return 'fake-model';
          }

          return null;
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue(authenticatedGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/access-requests/me (GET) should return an empty response when no request exists', async () => {
    prismaMock.accessRequest.findUnique.mockResolvedValue(null);

    const response = await request(app.getHttpServer()).get('/access-requests/me').expect(200);

    expect(response.text).toBe('');

    expect(prismaMock.accessRequest.findUnique).toHaveBeenCalledWith({
      where: {
        keycloakUserId_requestedApplication: {
          keycloakUserId: user.sub,
          requestedApplication: RequestedApplication.SPECPILOT,
        },
      },
    });
  });

  it('/access-requests (POST) should create a pending request with a message', async () => {
    prismaMock.accessRequest.findUnique.mockResolvedValue(null);
    prismaMock.accessRequest.create.mockResolvedValue(accessRequest);

    const response = await request(app.getHttpServer())
      .post('/access-requests')
      .send({
        message: 'I want access',
      })
      .expect(201);

    expect(response.body).toEqual({
      ...accessRequest,
      createdAt: accessRequest.createdAt.toISOString(),
      updatedAt: accessRequest.updatedAt.toISOString(),
    });

    expect(prismaMock.accessRequest.create).toHaveBeenCalledWith({
      data: {
        keycloakUserId: user.sub,
        email: user.email,
        fullName: user.name,
        requestedApplication: RequestedApplication.SPECPILOT,
        status: AccessRequestStatus.PENDING,
        message: 'I want access',
      },
    });
  });

  it('/access-requests (POST) should create a pending request without a message', async () => {
    prismaMock.accessRequest.findUnique.mockResolvedValue(null);
    prismaMock.accessRequest.create.mockResolvedValue({
      ...accessRequest,
      message: null,
    });

    const response = await request(app.getHttpServer())
      .post('/access-requests')
      .send({})
      .expect(201);

    expect(response.body.message).toBeNull();

    expect(prismaMock.accessRequest.create).toHaveBeenCalledWith({
      data: {
        keycloakUserId: user.sub,
        email: user.email,
        fullName: user.name,
        requestedApplication: RequestedApplication.SPECPILOT,
        status: AccessRequestStatus.PENDING,
        message: undefined,
      },
    });
  });

  it('/access-requests/me (GET) should return the current user request', async () => {
    prismaMock.accessRequest.findUnique.mockResolvedValue(accessRequest);

    const response = await request(app.getHttpServer()).get('/access-requests/me').expect(200);

    expect(response.body).toEqual({
      ...accessRequest,
      createdAt: accessRequest.createdAt.toISOString(),
      updatedAt: accessRequest.updatedAt.toISOString(),
    });
  });

  it('/access-requests (POST) should return 409 when a request already exists', async () => {
    prismaMock.accessRequest.findUnique.mockResolvedValue(accessRequest);

    const response = await request(app.getHttpServer())
      .post('/access-requests')
      .send({
        message: 'Duplicate request',
      })
      .expect(409);

    expect(response.body.message).toBe('Access request already exists for this application');

    expect(prismaMock.accessRequest.create).not.toHaveBeenCalled();
  });

  it('/access-requests (POST) should reject messages longer than 1000 characters', async () => {
    await request(app.getHttpServer())
      .post('/access-requests')
      .send({
        message: 'a'.repeat(1001),
      })
      .expect(400);

    expect(prismaMock.accessRequest.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.accessRequest.create).not.toHaveBeenCalled();
  });

  it('/access-requests (POST) should reject extra fields', async () => {
    await request(app.getHttpServer())
      .post('/access-requests')
      .send({
        message: 'Valid message',
        extra: 'not allowed',
      })
      .expect(400);

    expect(prismaMock.accessRequest.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.accessRequest.create).not.toHaveBeenCalled();
  });
});
