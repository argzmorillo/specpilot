import { Module } from '@nestjs/common';
import { AnalysisRepository } from './analysis.repository';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisRepository, AnalysisService],
  exports: [AnalysisRepository],
})
export class AnalysisModule {}
