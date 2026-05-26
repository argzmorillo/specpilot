import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisPageComponent } from './analysis-page.component';
import { provideHttpClient } from '@angular/common/http';

describe('AnalysisPage', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
