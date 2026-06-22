import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { AnalysisRepository } from '../analysis/analysis.repository';

describe('AiService', () => {
  let service: AiService;

  const mockAnalysisRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPENAI_API_KEY') return 'fake-api-key';
              if (key === 'OPENAI_MODEL') return 'fake-model';
              return null;
            }),
          },
        },
        {
          provide: AnalysisRepository,
          useValue: mockAnalysisRepository,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
