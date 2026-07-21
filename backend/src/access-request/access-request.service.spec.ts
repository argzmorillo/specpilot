import { ConflictException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AccessRequestStatus, RequestedApplication } from '@prisma/client';
import { AccessRequestRepository } from './access-request.repository';
import { AccessRequestService } from './access-request.service';
import { EcosystemRole } from '../auth/roles/ecosystem-role.enum';

describe('AccessRequestService', () => {
  let service: AccessRequestService;

  const accessRequestRepositoryMock = {
    findByUserAndApplication: jest.fn(),
    create: jest.fn(),
  };

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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestService,
        {
          provide: AccessRequestRepository,
          useValue: accessRequestRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AccessRequestService>(AccessRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a pending access request when none exists', async () => {
    accessRequestRepositoryMock.findByUserAndApplication.mockResolvedValue(null);
    accessRequestRepositoryMock.create.mockResolvedValue(accessRequest);

    const result = await service.create(user, { message: 'I want access' });

    expect(accessRequestRepositoryMock.findByUserAndApplication).toHaveBeenCalledWith(
      user.sub,
      RequestedApplication.SPECPILOT,
    );

    expect(accessRequestRepositoryMock.create).toHaveBeenCalledWith({
      keycloakUserId: user.sub,
      email: user.email,
      fullName: user.name,
      requestedApplication: RequestedApplication.SPECPILOT,
      status: AccessRequestStatus.PENDING,
      message: 'I want access',
    });

    expect(result).toEqual(accessRequest);
  });

  it('throws conflict when an access request already exists', async () => {
    accessRequestRepositoryMock.findByUserAndApplication.mockResolvedValue(accessRequest);

    await expect(service.create(user, { message: 'Duplicate' })).rejects.toThrow(ConflictException);

    expect(accessRequestRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('returns the current user access request', async () => {
    accessRequestRepositoryMock.findByUserAndApplication.mockResolvedValue(accessRequest);

    const result = await service.findMine(user);

    expect(accessRequestRepositoryMock.findByUserAndApplication).toHaveBeenCalledWith(
      user.sub,
      RequestedApplication.SPECPILOT,
    );

    expect(result).toEqual(accessRequest);
  });

  it('creates an access request without a message', async () => {
    accessRequestRepositoryMock.findByUserAndApplication.mockResolvedValue(null);
    accessRequestRepositoryMock.create.mockResolvedValue({
      ...accessRequest,
      message: null,
    });

    await service.create(user, {});

    expect(accessRequestRepositoryMock.create).toHaveBeenCalledWith({
      keycloakUserId: user.sub,
      email: user.email,
      fullName: user.name,
      requestedApplication: RequestedApplication.SPECPILOT,
      status: AccessRequestStatus.PENDING,
      message: undefined,
    });
  });

  it('returns null when the user has no access request', async () => {
    accessRequestRepositoryMock.findByUserAndApplication.mockResolvedValue(null);

    const result = await service.findMine(user);

    expect(result).toBeNull();
  });
});
