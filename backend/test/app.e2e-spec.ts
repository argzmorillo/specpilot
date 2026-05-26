/// <reference types="jest" />

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AiService } from '../src/ai/ai.service';

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
