import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResponseDto } from './dto/analysis-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser): Promise<AnalysisResponseDto[]> {
    return this.analysisService.findAll(user);
  }
}
