import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(AnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
