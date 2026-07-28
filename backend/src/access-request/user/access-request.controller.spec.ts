import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AccessRequestStatus, RequestedApplication } from '@prisma/client';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';
import { EcosystemRole } from '../../auth/roles/ecosystem-role.enum';

describe('AccessRequestController', () => {
  let controller: AccessRequestController;

  const accessRequestServiceMock = {
    create: jest.fn(),
    findMine: jest.fn(),
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
      controllers: [AccessRequestController],
      providers: [
        {
          provide: AccessRequestService,
          useValue: accessRequestServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AccessRequestController>(AccessRequestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates access request creation to the service', async () => {
    accessRequestServiceMock.create.mockResolvedValue(accessRequest);

    const dto = { message: 'I want access' };

    const result = await controller.create(user, dto);

    expect(accessRequestServiceMock.create).toHaveBeenCalledWith(user, dto);
    expect(result).toEqual(accessRequest);
  });

  it('delegates current user access request retrieval to the service', async () => {
    accessRequestServiceMock.findMine.mockResolvedValue(accessRequest);

    const result = await controller.findMine(user);

    expect(accessRequestServiceMock.findMine).toHaveBeenCalledWith(user);
    expect(result).toEqual(accessRequest);
  });
});
