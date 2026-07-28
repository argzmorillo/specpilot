import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessRequest } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import * as authenticatedUserInterface from '../../auth/interfaces/authenticated-user.interface';

@Controller('access-requests')
@UseGuards(JwtAuthGuard)
export class AccessRequestController {
  constructor(private readonly accessRequestService: AccessRequestService) {}

  @Post()
  create(
    @CurrentUser() user: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: CreateAccessRequestDto,
  ): Promise<AccessRequest> {
    return this.accessRequestService.create(user, dto);
  }

  @Get('me')
  findMine(
    @CurrentUser() user: authenticatedUserInterface.AuthenticatedUser,
  ): Promise<AccessRequest | null> {
    return this.accessRequestService.findMine(user);
  }
}
