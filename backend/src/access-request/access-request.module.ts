import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { AccessRequestRepository } from './access-request.repository';
import { AccessRequestService } from './user/access-request.service';
import { AccessRequestAdminController } from './admin/access-request-admin.controller';
import { AccessRequestAdminService } from './admin/access-request-admin.service';
import { AccessRequestController } from './user/access-request.controller';

@Module({
  imports: [AuthModule],
  controllers: [AccessRequestController, AccessRequestAdminController],
  providers: [AccessRequestService, AccessRequestAdminService, AccessRequestRepository],
})
export class AccessRequestModule {}
