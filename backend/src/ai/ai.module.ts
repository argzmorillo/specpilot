import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AnalysisModule } from '../analysis/analysis.module';

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [AnalysisModule],
})
export class AiModule {}
