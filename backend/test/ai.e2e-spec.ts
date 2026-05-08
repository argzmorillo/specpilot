import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('AiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('/ai/analyze (POST) should reject empty text', () => {
    return request(app.getHttpServer())
      .post('/ai/analyze')
      .send({
        text: '',
      })
      .expect(400);
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
