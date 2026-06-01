import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async findAll(): Promise<AnalysisResponseDto[]> {
    return this.analysisService.findAll();
  }
}
