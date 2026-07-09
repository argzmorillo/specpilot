import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AccessRequestRepository } from './access-request.repository';
import { AccessRequest, AccessRequestStatus, RequestedApplication } from '@prisma/client';

@Injectable()
export class AccessRequestService {
  constructor(private readonly accessRequestRepository: AccessRequestRepository) {}

  async create(user: AuthenticatedUser, dto: CreateAccessRequestDto): Promise<AccessRequest> {
    const existingRequest = await this.accessRequestRepository.findByUserAndApplication(
      user.sub,
      RequestedApplication.SPECPILOT,
    );

    if (existingRequest) {
      throw new ConflictException('Access request already exists for this application');
    }

    return this.accessRequestRepository.create({
      keycloakUserId: user.sub,
      email: user.email,
      fullName: user.name,
      requestedApplication: RequestedApplication.SPECPILOT,
      status: AccessRequestStatus.PENDING,
      message: dto.message,
    });
  }

  async findMine(user: AuthenticatedUser): Promise<AccessRequest | null> {
    return this.accessRequestRepository.findByUserAndApplication(
      user.sub,
      RequestedApplication.SPECPILOT,
    );
  }
}
