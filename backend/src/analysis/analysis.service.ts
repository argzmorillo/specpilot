import { Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AnalysisRepository } from './analysis.repository';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@Injectable()
export class AnalysisService {
  constructor(private readonly analysisRepository: AnalysisRepository) {}

  async findAll(user: AuthenticatedUser): Promise<AnalysisResponseDto[]> {
    const analyses = await this.analysisRepository.findAllByUser(user.sub);

    return analyses.map((analysis) => ({
      id: analysis.id,
      inputText: analysis.inputText,
      summary: analysis.summary,
      userStories: analysis.userStories as string[],
      technicalTasks: analysis.technicalTasks as string[],
      risks: analysis.risks as string[],
      questions: analysis.questions as string[],
      createdAt: analysis.createdAt,
    }));
  }
}
