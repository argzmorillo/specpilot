/// <reference types="jest" />

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => 'test-secret'),
}));

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AiService } from '../src/ai/ai.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

const mockAnalayzeResult = {
  summary: 'Fake summary',
  userStories: ['Fake user story 1', 'Fake user story 2'],
  technicalTasks: ['Fake technical task 1', 'Fake technical task 2'],
  risks: ['Fake risk 1', 'Fake risk 2'],
  questions: ['Fake question 1', 'Fake question 2'],
};

const mockAiService = {
  analyzeText: jest.fn().mockResolvedValue(mockAnalayzeResult),
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
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
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/ai/analyze (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/analyze')
      .send({ text: 'Necesitamos una app bancaria' })
      .expect(201);

    expect(response.body).toEqual(mockAnalayzeResult);

    expect(mockAiService.analyzeText).toHaveBeenCalledWith('Necesitamos una app bancaria');
  });
});
