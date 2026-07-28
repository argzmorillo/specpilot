import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { AccessRequest } from '@prisma/client';
import { AccessRequestStatus, RequestedApplication } from '@prisma/client';

import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { EcosystemRole } from '../../auth/roles/ecosystem-role.enum';
import { AccessRequestAdminController } from './access-request-admin.controller';
import { AccessRequestAdminService } from './access-request-admin.service';
import type { ReviewAccessRequestDto } from './dto/review-access-request.dto';

describe('AccessRequestAdminController', () => {
  let controller: AccessRequestAdminController;

  let accessRequestAdminService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    review: jest.Mock;
  };

  const requestedApplication = Object.values(RequestedApplication)[0] as RequestedApplication;

  const reviewer: AuthenticatedUser = {
    sub: 'keycloak-admin-id',
    username: 'admin',
    email: 'admin@specpilot.dev',
    roles: [EcosystemRole.SpecPilotAdmin, EcosystemRole.SpecPilotUser],
  };

  const pendingRequest: AccessRequest = {
    id: 'access-request-id',
    keycloakUserId: 'keycloak-user-id',
    email: 'user@specpilot.dev',
    fullName: 'SpecPilot User',
    approvedRole: null,
    requestedApplication,
    status: AccessRequestStatus.PENDING,
    message: 'I would like to join the private beta.',
    adminNotes: null,
    reviewedAt: null,
    reviewedByUserId: null,
    createdAt: new Date('2026-07-20T10:00:00.000Z'),
    updatedAt: new Date('2026-07-20T10:00:00.000Z'),
  };

  beforeEach(async () => {
    accessRequestAdminService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      review: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRequestAdminController],
      providers: [
        {
          provide: AccessRequestAdminService,
          useValue: accessRequestAdminService,
        },
      ],
    }).compile();

    controller = module.get<AccessRequestAdminController>(AccessRequestAdminController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all access requests', async () => {
      const requests: AccessRequest[] = [
        pendingRequest,
        {
          ...pendingRequest,
          id: 'second-access-request-id',
          keycloakUserId: 'second-keycloak-user-id',
          email: 'second-user@specpilot.dev',
        },
      ];

      accessRequestAdminService.findAll.mockResolvedValue(requests);

      await expect(controller.findAll()).resolves.toEqual(requests);

      expect(accessRequestAdminService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return one access request', async () => {
      accessRequestAdminService.findOne.mockResolvedValue(pendingRequest);

      await expect(controller.findOne(pendingRequest.id)).resolves.toEqual(pendingRequest);

      expect(accessRequestAdminService.findOne).toHaveBeenCalledTimes(1);

      expect(accessRequestAdminService.findOne).toHaveBeenCalledWith(pendingRequest.id);
    });
  });

  describe('review', () => {
    it('should delegate approval to the service', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'APPROVED',
        adminNotes: 'Approved for the private beta.',
      };

      const approvedRequest: AccessRequest = {
        ...pendingRequest,
        status: AccessRequestStatus.APPROVED,
        approvedRole: EcosystemRole.SpecPilotUser,
        adminNotes: dto.adminNotes ?? null,
        reviewedAt: new Date(),
        reviewedByUserId: reviewer.sub,
      };

      accessRequestAdminService.review.mockResolvedValue(approvedRequest);

      await expect(controller.review(pendingRequest.id, reviewer, dto)).resolves.toEqual(
        approvedRequest,
      );

      expect(accessRequestAdminService.review).toHaveBeenCalledTimes(1);

      expect(accessRequestAdminService.review).toHaveBeenCalledWith(
        pendingRequest.id,
        reviewer,
        dto,
      );
    });

    it('should delegate rejection to the service', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'REJECTED',
        adminNotes: 'Rejected after administrator review.',
      };

      const rejectedRequest: AccessRequest = {
        ...pendingRequest,
        status: AccessRequestStatus.REJECTED,
        approvedRole: null,
        adminNotes: dto.adminNotes ?? null,
        reviewedAt: new Date(),
        reviewedByUserId: reviewer.sub,
      };

      accessRequestAdminService.review.mockResolvedValue(rejectedRequest);

      await expect(controller.review(pendingRequest.id, reviewer, dto)).resolves.toEqual(
        rejectedRequest,
      );

      expect(accessRequestAdminService.review).toHaveBeenCalledWith(
        pendingRequest.id,
        reviewer,
        dto,
      );
    });
  });
});
