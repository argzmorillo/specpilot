import { Injectable } from '@nestjs/common';
import { AccessRequest, Prisma, RequestedApplication } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

export type ReviewableAccessRequestStatus = 'APPROVED' | 'REJECTED';

export interface UpdateAccessRequestReviewData {
  status: ReviewableAccessRequestStatus;
  adminNotes: string | null;
  approvedRole: string | null;
  reviewedAt: Date;
  reviewedByUserId: string;
}

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

  findAll(): Promise<AccessRequest[]> {
    return this.prisma.accessRequest.findMany({
      orderBy: [
        {
          status: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  findById(id: string): Promise<AccessRequest | null> {
    return this.prisma.accessRequest.findUnique({
      where: {
        id,
      },
    });
  }

  updateReview(id: string, data: UpdateAccessRequestReviewData): Promise<AccessRequest> {
    return this.prisma.accessRequest.update({
      where: {
        id,
      },
      data,
    });
  }
}
