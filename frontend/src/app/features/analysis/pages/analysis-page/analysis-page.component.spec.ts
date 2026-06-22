import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AnalysisService } from '../../services/analysis.service';
import { AnalysisPageComponent } from './analysis-page.component';
import { AuthService } from '../../../../auth/auth.service';

describe('AnalysisPageComponent', () => {
  let fixture: ComponentFixture<AnalysisPageComponent>;
  let component: AnalysisPageComponent;

  const mockAnalysisService = {
    analyzeText: jasmine.createSpy('analyzeText'),
    getHistory: jasmine.createSpy('getHistory').and.returnValue(of([])),
  };

  const mockResult = {
    summary: 'Resumen generado',
    userStories: ['Historia 1'],
    technicalTasks: ['Tarea 1'],
    risks: ['Riesgo 1'],
    questions: ['Pregunta 1'],
  };

  beforeEach(async () => {
    mockAnalysisService.analyzeText.calls.reset();

    await TestBed.configureTestingModule({
      imports: [AnalysisPageComponent],
      providers: [
        {
          provide: AnalysisService,
          useValue: mockAnalysisService,
        },
        {
          provide: AuthService,
          useValue: {
            getUsername: () => 'demo',
            logout: jasmine.createSpy('logout'),
            isLoggedIn: () => true,
            login: jasmine.createSpy('login'),
            getToken: () => 'fake-token',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable analyze button when input is empty', () => {
    component.text.set('');
    fixture.detectChanges();

    expect(component.isAnalyzeDisabled()).toBeTrue();
  });

  it('should update character counter when text changes', () => {
    component.text.set('abc');
    fixture.detectChanges();

    expect(component.inputLength()).toBe(3);
  });

  it('should call analysis service with valid text', () => {
    mockAnalysisService.analyzeText.and.returnValue(of(mockResult));

    component.text.set('Especificación válida');
    component.analyze();

    expect(mockAnalysisService.analyzeText).toHaveBeenCalledWith('Especificación válida');
    expect(component.result()).toEqual(mockResult);
    expect(component.loading()).toBeFalse();
  });

  it('should show error when analysis service fails', () => {
    mockAnalysisService.analyzeText.and.returnValue(throwError(() => new Error('Request failed')));

    component.text.set('Especificación válida');
    component.analyze();

    expect(component.result()).toBeNull();
    expect(component.error()).toContain('No se pudo generar');
    expect(component.loading()).toBeFalse();
  });
});
