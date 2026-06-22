import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, type Analysis } from '@prisma/client';

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

  async create(input: Prisma.AnalysisCreateInput): Promise<Analysis> {
    return this.prisma.analysis.create({
      data: input,
    });
  }

  async findAll(): Promise<Analysis[]> {
    return this.prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
