import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAnalysisRecordInput {
  inputText: string;
  summary: string;
  userStories: string[];
  technicalTasks: string[];
  risks: string[];
  questions: string[];
}

@Injectable()
export class AnalysisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAnalysisRecordInput) {
    return this.prisma.analysis.create({
      data: {
        inputText: input.inputText,
        summary: input.summary,
        userStories: input.userStories,
        technicalTasks: input.technicalTasks,
        risks: input.risks,
        questions: input.questions,
      },
    });
  }

  async findAll() {
    return this.prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
