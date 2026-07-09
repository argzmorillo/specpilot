import { Injectable } from '@nestjs/common';
import { AccessRequest, Prisma, RequestedApplication } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserAndApplication(
    keycloakUserId: string,
    requestedApplication: RequestedApplication,
  ): Promise<AccessRequest | null> {
    return this.prisma.accessRequest.findUnique({
      where: {
        keycloakUserId_requestedApplication: {
          keycloakUserId,
          requestedApplication,
        },
      },
    });
  }

  create(data: Prisma.AccessRequestCreateInput): Promise<AccessRequest> {
    return this.prisma.accessRequest.create({
      data,
    });
  }
}
