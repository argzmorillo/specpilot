import { Module } from '@nestjs/common';
import { AnalysisRepository } from './analysis.repository';

@Module({
  providers: [AnalysisRepository],
  exports: [AnalysisRepository],
})
export class AnalysisModule {}
