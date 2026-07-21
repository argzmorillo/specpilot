import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AnalysisStore } from './analysis.store';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisHistoryItem } from '../models/analysis-history-item.model';
import { AnalyzeResult } from '../models/analyze-result.model';

describe('AnalysisStore', () => {
  let store: AnalysisStore;

  const mockAnalysisService = {
    analyzeText: jasmine.createSpy('analyzeText'),
    getHistory: jasmine.createSpy('getHistory'),
  };

  const mockResult: AnalyzeResult = {
    summary: 'Resumen generado',
    userStories: ['Historia 1'],
    technicalTasks: ['Tarea 1'],
    risks: ['Riesgo 1'],
    questions: ['Pregunta 1'],
  };

  const mockHistory: AnalysisHistoryItem[] = [
    {
      id: '1',
      inputText: 'Especificación',
      summary: 'Resumen',
      userStories: ['Historia'],
      technicalTasks: ['Tarea'],
      risks: ['Riesgo'],
      questions: ['Pregunta'],
      createdAt: '2026-07-20T10:00:00Z',
    },
  ];

  beforeEach(() => {
    mockAnalysisService.analyzeText.calls.reset();
    mockAnalysisService.getHistory.calls.reset();

    mockAnalysisService.getHistory.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        AnalysisStore,
        {
          provide: AnalysisService,
          useValue: mockAnalysisService,
        },
      ],
    });

    store = TestBed.inject(AnalysisStore);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(store.history()).toEqual([]);
    expect(store.historyLoading()).toBeFalse();
    expect(store.historyError()).toBeNull();

    expect(store.text()).toBe('');
    expect(store.result()).toBeNull();
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();

    expect(store.selectedHistoryItemId()).toBeNull();
  });

  it('should detect empty input', () => {
    store.text.set('');

    expect(store.isInputEmpty()).toBeTrue();
    expect(store.isAnalyzeDisabled()).toBeTrue();
  });

  it('should calculate input length', () => {
    store.text.set('abc');

    expect(store.inputLength()).toBe(3);
  });

  it('should enable analysis for valid input', () => {
    store.text.set('Especificación válida');

    expect(store.isInputEmpty()).toBeFalse();
    expect(store.isInputTooLong()).toBeFalse();
    expect(store.isAnalyzeDisabled()).toBeFalse();
  });

  it('should detect oversized input', () => {
    store.text.set('a'.repeat(store.maxInputLength + 1));

    expect(store.isInputTooLong()).toBeTrue();
    expect(store.isAnalyzeDisabled()).toBeTrue();
  });

  it('should reject empty input', () => {
    store.text.set('');

    store.analyze();

    expect(mockAnalysisService.analyzeText).not.toHaveBeenCalled();
    expect(store.result()).toBeNull();
    expect(store.error()).toBe('Introduce una especificación para generar el análisis técnico.');
  });

  it('should reject oversized input', () => {
    store.text.set('a'.repeat(store.maxInputLength + 1));

    store.analyze();

    expect(mockAnalysisService.analyzeText).not.toHaveBeenCalled();
    expect(store.result()).toBeNull();
    expect(store.error()).toBe(
      `La especificación supera el límite de ${store.maxInputLength} caracteres.`,
    );
  });

  it('should analyze successfully', () => {
    mockAnalysisService.analyzeText.and.returnValue(of(mockResult));
    mockAnalysisService.getHistory.and.returnValue(of(mockHistory));

    store.text.set('Especificación válida');

    store.analyze();

    expect(mockAnalysisService.analyzeText).toHaveBeenCalledWith('Especificación válida');

    expect(mockAnalysisService.getHistory).toHaveBeenCalled();

    expect(store.result()).toEqual(mockResult);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('should handle analysis errors', () => {
    mockAnalysisService.analyzeText.and.returnValue(throwError(() => new Error('Request failed')));

    store.text.set('Especificación válida');

    store.analyze();

    expect(store.result()).toBeNull();
    expect(store.loading()).toBeFalse();
    expect(store.error()).toContain('No se pudo generar el análisis técnico');
  });

  it('should load history', () => {
    mockAnalysisService.getHistory.and.returnValue(of(mockHistory));

    store.loadHistory();

    expect(mockAnalysisService.getHistory).toHaveBeenCalled();
    expect(store.history()).toEqual(mockHistory);
    expect(store.historyLoading()).toBeFalse();
    expect(store.historyError()).toBeNull();
  });

  it('should handle history loading errors', () => {
    mockAnalysisService.getHistory.and.returnValue(throwError(() => new Error('Request failed')));

    store.loadHistory();

    expect(store.historyLoading()).toBeFalse();
    expect(store.historyError()).toBe('No se pudo cargar el historial');
  });

  it('should select history item', () => {
    const item = mockHistory[0];

    store.selectHistoryItem(item);

    expect(store.selectedHistoryItemId()).toBe(item.id);
    expect(store.text()).toBe(item.inputText);

    expect(store.result()).toEqual({
      summary: item.summary,
      userStories: item.userStories,
      technicalTasks: item.technicalTasks,
      risks: item.risks,
      questions: item.questions,
    });

    expect(store.error()).toBeNull();
  });

  it('should clear input', () => {
    store.text.set('Texto');
    store.result.set(mockResult);
    store.error.set('Error');
    store.selectedHistoryItemId.set('123');

    store.clearInput();

    expect(store.text()).toBe('');
    expect(store.result()).toBeNull();
    expect(store.error()).toBeNull();
    expect(store.selectedHistoryItemId()).toBeNull();
  });
});
