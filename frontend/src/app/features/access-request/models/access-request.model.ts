export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AccessRequest {
  id: string;
  keycloakUserId: string;
  email: string;
  fullName: string | null;
  requestedApplication: 'SPECPILOT';
  status: AccessRequestStatus;
  message: string | null;
  adminNotes: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  approvedRole: string | null;
  createdAt: string;
  updatedAt: string;
}
