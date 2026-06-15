jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => 'test-secret'),
}));

import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { AiService } from '../src/ai/ai.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

describe('AiController (e2e)', () => {
  let app: INestApplication;

  const mockAnalyzeResult = {
    summary: 'Fake summary',
    userStories: ['Fake user story 1', 'Fake user story 2'],
    technicalTasks: ['Fake technical task 1', 'Fake technical task 2'],
    risks: ['Fake risk 1', 'Fake risk 2'],
    questions: ['Fake question 1', 'Fake question 2'],
  };

  const mockAiService = {
    analyzeText: jest.fn(),
  };

  beforeEach(async () => {
    mockAiService.analyzeText.mockClear();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'KEYCLOAK_ISSUER_URL') return 'http://keycloak-test/realms/specpilot';
          if (key === 'KEYCLOAK_CLIENT_ID') return 'specpilot-api';
          if (key === 'KEYCLOAK_JWKS_URI')
            return 'http://localhost:8080/realms/specpilot/protocol/openid-connect/certs';
          if (key === 'OPENAI_API_KEY') return 'fake-api-key';
          if (key === 'OPENAI_MODEL') return 'fake-model';
          return null;
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ai/analyze (POST) should return structured analysis', async () => {
    mockAiService.analyzeText.mockResolvedValue(mockAnalyzeResult);

    const response = await request(app.getHttpServer()).post('/ai/analyze').send({
      text: 'Necesitamos una aplicación para analizar especificaciones.',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockAnalyzeResult);
    // expect(mockAiService.analyzeText).toHaveBeenCalledWith(
    //   'Necesitamos una aplicación para analizar especificaciones.',
    // );
  });

  it('/ai/analyze (POST) should reject empty text', () => {
    return request(app.getHttpServer()).post('/ai/analyze').send({ text: '' }).expect(400);
  });

  it('/ai/analyze (POST) should reject extra fields', () => {
    return request(app.getHttpServer())
      .post('/ai/analyze')
      .send({
        text: 'Texto válido',
        extra: 'campo prohibido',
      })
      .expect(400);
  });

  it('/ai/analyze (POST) should reject missing text', () => {
    return request(app.getHttpServer()).post('/ai/analyze').send({}).expect(400);
  });
});
