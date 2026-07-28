import type { AccessRequestStatus } from '@prisma/client';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const REVIEWABLE_ACCESS_REQUEST_STATUSES = [
  'APPROVED',
  'REJECTED',
] as const satisfies readonly AccessRequestStatus[];

type ReviewableAccessRequestStatus = (typeof REVIEWABLE_ACCESS_REQUEST_STATUSES)[number];

export class ReviewAccessRequestDto {
  @IsIn(REVIEWABLE_ACCESS_REQUEST_STATUSES)
  status!: ReviewableAccessRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
