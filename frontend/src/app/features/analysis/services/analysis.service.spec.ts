import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisPageComponent } from '../pages/analysis-page/analysis-page.component';
import { provideHttpClient } from '@angular/common/http';

describe('AnalysisService', () => {
  let component: AnalysisPageComponent;
  let fixture: ComponentFixture<AnalysisPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisPageComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
