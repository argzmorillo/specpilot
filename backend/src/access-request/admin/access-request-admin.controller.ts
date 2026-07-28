import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AccessRequest } from '@prisma/client';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { EcosystemRole } from '../../auth/roles/ecosystem-role.enum';
import { AccessRequestAdminService } from './access-request-admin.service';
import { ReviewAccessRequestDto } from './dto/review-access-request.dto';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Roles } from '../../auth/roles/roles.decorator';

@Controller('admin/access-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(EcosystemRole.SpecPilotAdmin)
export class AccessRequestAdminController {
  constructor(private readonly accessRequestAdminService: AccessRequestAdminService) {}

  @Get()
  findAll(): Promise<AccessRequest[]> {
    return this.accessRequestAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccessRequest> {
    return this.accessRequestAdminService.findOne(id);
  }

  @Patch(':id')
  review(
    @Param('id') id: string,
    @CurrentUser() reviewer: AuthenticatedUser,
    @Body() dto: ReviewAccessRequestDto,
  ): Promise<AccessRequest> {
    return this.accessRequestAdminService.review(id, reviewer, dto);
  }
}
