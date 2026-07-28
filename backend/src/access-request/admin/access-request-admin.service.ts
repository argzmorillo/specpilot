import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessRequest, AccessRequestStatus } from '@prisma/client';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { KeycloakAdminService } from '../../auth/keycloak-admin.service';
import { EcosystemRole } from '../../auth/roles/ecosystem-role.enum';
import {
  AccessRequestRepository,
  ReviewableAccessRequestStatus,
} from '../access-request.repository';
import { ReviewAccessRequestDto } from './dto/review-access-request.dto';

@Injectable()
export class AccessRequestAdminService {
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  findAll(): Promise<AccessRequest[]> {
    return this.accessRequestRepository.findAll();
  }

  async findOne(id: string): Promise<AccessRequest> {
    const request = await this.accessRequestRepository.findById(id);

    if (!request) {
      throw new NotFoundException('Access request not found');
    }

    return request;
  }

  async review(
    id: string,
    reviewer: AuthenticatedUser,
    dto: ReviewAccessRequestDto,
  ): Promise<AccessRequest> {
    const request = await this.findOne(id);

    if (request.status !== AccessRequestStatus.PENDING) {
      throw new ConflictException('Access request has already been reviewed');
    }

    const adminNotes = dto.adminNotes?.trim() || null;

    if (dto.status === 'APPROVED') {
      await this.keycloakAdminService.assignRealmRole(
        request.keycloakUserId,
        EcosystemRole.SpecPilotUser,
      );
    }

    return this.accessRequestRepository.updateReview(request.id, {
      status: dto.status as ReviewableAccessRequestStatus,
      adminNotes,
      approvedRole: dto.status === 'APPROVED' ? EcosystemRole.SpecPilotUser : null,
      reviewedAt: new Date(),
      reviewedByUserId: reviewer.sub,
    });
  }
}
