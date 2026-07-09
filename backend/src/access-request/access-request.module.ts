import { Module } from '@nestjs/common';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';
import { AccessRequestRepository } from './access-request.repository';

@Module({
  controllers: [AccessRequestController],
  providers: [AccessRequestService, AccessRequestRepository],
})
export class AccessRequestModule {}
