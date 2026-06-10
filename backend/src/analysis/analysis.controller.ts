import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResponseDto } from './dto/analysis-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async findAll(): Promise<AnalysisResponseDto[]> {
    return this.analysisService.findAll();
  }
}
