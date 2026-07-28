import { ConflictException, NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { AccessRequest } from '@prisma/client';
import { AccessRequestStatus, RequestedApplication } from '@prisma/client';

import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { KeycloakAdminService } from '../../auth/keycloak-admin.service';
import { EcosystemRole } from '../../auth/roles/ecosystem-role.enum';
import type { UpdateAccessRequestReviewData } from '../access-request.repository';
import { AccessRequestRepository } from '../access-request.repository';
import { AccessRequestAdminService } from './access-request-admin.service';
import type { ReviewAccessRequestDto } from './dto/review-access-request.dto';

describe('AccessRequestAdminService', () => {
  let service: AccessRequestAdminService;

  let accessRequestRepository: {
    findAll: jest.Mock;
    findById: jest.Mock;
    updateReview: jest.Mock;
  };

  let keycloakAdminService: {
    assignRealmRole: jest.Mock;
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
    accessRequestRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateReview: jest.fn(),
    };

    keycloakAdminService = {
      assignRealmRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestAdminService,
        {
          provide: AccessRequestRepository,
          useValue: accessRequestRepository,
        },
        {
          provide: KeycloakAdminService,
          useValue: keycloakAdminService,
        },
      ],
    }).compile();

    service = module.get<AccessRequestAdminService>(AccessRequestAdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      accessRequestRepository.findAll.mockResolvedValue(requests);

      await expect(service.findAll()).resolves.toEqual(requests);

      expect(accessRequestRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an access request when it exists', async () => {
      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      await expect(service.findOne(pendingRequest.id)).resolves.toEqual(pendingRequest);

      expect(accessRequestRepository.findById).toHaveBeenCalledTimes(1);

      expect(accessRequestRepository.findById).toHaveBeenCalledWith(pendingRequest.id);
    });

    it('should throw NotFoundException when it does not exist', async () => {
      accessRequestRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('missing-access-request-id')).rejects.toThrow(
        new NotFoundException('Access request not found'),
      );
    });
  });

  describe('review', () => {
    it('should approve a pending request and assign the user role', async () => {
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

      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      keycloakAdminService.assignRealmRole.mockResolvedValue(undefined);

      accessRequestRepository.updateReview.mockResolvedValue(approvedRequest);

      const result = await service.review(pendingRequest.id, reviewer, dto);

      expect(result).toEqual(approvedRequest);

      expect(keycloakAdminService.assignRealmRole).toHaveBeenCalledTimes(1);

      expect(keycloakAdminService.assignRealmRole).toHaveBeenCalledWith(
        pendingRequest.keycloakUserId,
        EcosystemRole.SpecPilotUser,
      );

      expect(accessRequestRepository.updateReview).toHaveBeenCalledTimes(1);

      expect(accessRequestRepository.updateReview).toHaveBeenCalledWith(
        pendingRequest.id,
        expect.objectContaining({
          status: 'APPROVED',
          adminNotes: 'Approved for the private beta.',
          approvedRole: EcosystemRole.SpecPilotUser,
          reviewedAt: expect.any(Date),
          reviewedByUserId: reviewer.sub,
        }),
      );
    });

    it('should reject a pending request without assigning a role', async () => {
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

      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      accessRequestRepository.updateReview.mockResolvedValue(rejectedRequest);

      const result = await service.review(pendingRequest.id, reviewer, dto);

      expect(result).toEqual(rejectedRequest);

      expect(keycloakAdminService.assignRealmRole).not.toHaveBeenCalled();

      expect(accessRequestRepository.updateReview).toHaveBeenCalledWith(
        pendingRequest.id,
        expect.objectContaining({
          status: 'REJECTED',
          adminNotes: 'Rejected after administrator review.',
          approvedRole: null,
          reviewedAt: expect.any(Date),
          reviewedByUserId: reviewer.sub,
        }),
      );
    });

    it('should trim administrator notes', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'REJECTED',
        adminNotes: '   Rejected after review.   ',
      };

      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      accessRequestRepository.updateReview.mockImplementation(
        (id: string, data: UpdateAccessRequestReviewData): Promise<AccessRequest> =>
          Promise.resolve({
            ...pendingRequest,
            id,
            status:
              data.status === 'APPROVED'
                ? AccessRequestStatus.APPROVED
                : AccessRequestStatus.REJECTED,
            adminNotes: data.adminNotes,
            approvedRole: data.approvedRole,
            reviewedAt: data.reviewedAt,
            reviewedByUserId: data.reviewedByUserId,
          }),
      );

      await service.review(pendingRequest.id, reviewer, dto);

      expect(accessRequestRepository.updateReview).toHaveBeenCalledWith(
        pendingRequest.id,
        expect.objectContaining({
          adminNotes: 'Rejected after review.',
        }),
      );
    });

    it('should store null when administrator notes are empty', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'REJECTED',
        adminNotes: '   ',
      };

      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      accessRequestRepository.updateReview.mockImplementation(
        (id: string, data: UpdateAccessRequestReviewData): Promise<AccessRequest> =>
          Promise.resolve({
            ...pendingRequest,
            id,
            status: AccessRequestStatus.REJECTED,
            adminNotes: data.adminNotes,
            approvedRole: data.approvedRole,
            reviewedAt: data.reviewedAt,
            reviewedByUserId: data.reviewedByUserId,
          }),
      );

      await service.review(pendingRequest.id, reviewer, dto);

      expect(accessRequestRepository.updateReview).toHaveBeenCalledWith(
        pendingRequest.id,
        expect.objectContaining({
          adminNotes: null,
        }),
      );
    });

    it('should throw NotFoundException when reviewing a missing request', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'APPROVED',
      };

      accessRequestRepository.findById.mockResolvedValue(null);

      await expect(
        service.review('missing-access-request-id', reviewer, dto),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(keycloakAdminService.assignRealmRole).not.toHaveBeenCalled();

      expect(accessRequestRepository.updateReview).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when the request has already been reviewed', async () => {
      const approvedRequest: AccessRequest = {
        ...pendingRequest,
        status: AccessRequestStatus.APPROVED,
        approvedRole: EcosystemRole.SpecPilotUser,
        reviewedAt: new Date(),
        reviewedByUserId: reviewer.sub,
      };

      const dto: ReviewAccessRequestDto = {
        status: 'REJECTED',
      };

      accessRequestRepository.findById.mockResolvedValue(approvedRequest);

      await expect(service.review(approvedRequest.id, reviewer, dto)).rejects.toThrow(
        new ConflictException('Access request has already been reviewed'),
      );

      expect(keycloakAdminService.assignRealmRole).not.toHaveBeenCalled();

      expect(accessRequestRepository.updateReview).not.toHaveBeenCalled();
    });

    it('should not update the request when Keycloak role assignment fails', async () => {
      const dto: ReviewAccessRequestDto = {
        status: 'APPROVED',
      };

      accessRequestRepository.findById.mockResolvedValue(pendingRequest);

      keycloakAdminService.assignRealmRole.mockRejectedValue(
        new Error('Keycloak role assignment failed'),
      );

      await expect(service.review(pendingRequest.id, reviewer, dto)).rejects.toThrow(
        'Keycloak role assignment failed',
      );

      expect(accessRequestRepository.updateReview).not.toHaveBeenCalled();
    });
  });
});
