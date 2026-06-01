import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { AnalysisService } from '../src/analysis/analysis.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AnalysisController (e2e)', () => {
  let app: INestApplication;

  const mockAnalysisResponse = [
    {
      id: 1,
      inputText: 'Necesitamos una app bancaria',
      summary: 'Fake summary',
      userStories: ['Fake user story 1', 'Fake user story 2'],
      technicalTasks: ['Fake technical task 1', 'Fake technical task 2'],
      risks: ['Fake risk 1', 'Fake risk 2'],
      questions: ['Fake question 1', 'Fake question 2'],
      createdAt: new Date(),
    },
  ];

  const mockAnalysisService = {
    findAll: jest.fn().mockResolvedValue(mockAnalysisResponse),
  };

  const mockAiService = {
    analyzeText: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AnalysisService)
      .useValue(mockAnalysisService)
      .overrideProvider('AiService')
      .useValue(mockAiService)
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/analysis (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/analysis').expect(200);

    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      id: 1,
      inputText: 'Necesitamos una app bancaria',
    });
  });
});
