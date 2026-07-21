import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutStore } from '../../../../layout/store/layout.store';
import { AnalysisHistoryItem } from '../../models/analysis-history-item.model';
import { AnalysisStore } from '../../store/analysis.store';
import { AnalysisSidebarNavigationComponent } from './analysis-sidebar-navigation.component';

describe('AnalysisSidebarNavigationComponent', () => {
  let component: AnalysisSidebarNavigationComponent;
  let fixture: ComponentFixture<AnalysisSidebarNavigationComponent>;

  let analysisStore: {
    history: ReturnType<typeof signal<AnalysisHistoryItem[]>>;
    historyLoading: ReturnType<typeof signal<boolean>>;
    historyError: ReturnType<typeof signal<string | null>>;
    selectedHistoryItemId: ReturnType<typeof signal<string | null>>;
    clearInput: jasmine.Spy;
    selectHistoryItem: jasmine.Spy;
  };

  let layoutStore: {
    closeMobileMenu: jasmine.Spy;
  };

  const historyItem: AnalysisHistoryItem = {
    id: 'analysis-1',
    inputText: 'Especificación de prueba',
    summary: 'Resumen',
    userStories: ['Historia 1'],
    technicalTasks: ['Tarea 1'],
    risks: ['Riesgo 1'],
    questions: ['Pregunta 1'],
    createdAt: '2026-07-21T10:00:00Z',
  };

  beforeEach(async () => {
    analysisStore = {
      history: signal<AnalysisHistoryItem[]>([]),
      historyLoading: signal(false),
      historyError: signal<string | null>(null),
      selectedHistoryItemId: signal<string | null>(null),
      clearInput: jasmine.createSpy('clearInput'),
      selectHistoryItem: jasmine.createSpy('selectHistoryItem'),
    };

    layoutStore = {
      closeMobileMenu: jasmine.createSpy('closeMobileMenu'),
    };

    await TestBed.configureTestingModule({
      imports: [AnalysisSidebarNavigationComponent],
      providers: [
        {
          provide: AnalysisStore,
          useValue: analysisStore,
        },
        {
          provide: LayoutStore,
          useValue: layoutStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisSidebarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose analysis store state', () => {
    analysisStore.history.set([historyItem]);
    analysisStore.historyLoading.set(true);
    analysisStore.historyError.set('Error');
    analysisStore.selectedHistoryItemId.set(historyItem.id);

    expect(component.history()).toEqual([historyItem]);
    expect(component.historyLoading()).toBeTrue();
    expect(component.historyError()).toBe('Error');
    expect(component.selectedHistoryItemId()).toBe(historyItem.id);
  });

  it('should clear the current analysis when creating a new one', () => {
    component.onNewAnalysis();

    expect(analysisStore.clearInput).toHaveBeenCalled();
    expect(layoutStore.closeMobileMenu).not.toHaveBeenCalled();
  });

  it('should select a history item', () => {
    component.onSelectHistory(historyItem);

    expect(analysisStore.selectHistoryItem).toHaveBeenCalledOnceWith(historyItem);
    expect(layoutStore.closeMobileMenu).not.toHaveBeenCalled();
  });

  it('should close the mobile menu after creating a new analysis on mobile', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    component.onNewAnalysis();

    expect(analysisStore.clearInput).toHaveBeenCalled();
    expect(layoutStore.closeMobileMenu).toHaveBeenCalled();
  });

  it('should close the mobile menu after selecting history on mobile', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    component.onSelectHistory(historyItem);

    expect(analysisStore.selectHistoryItem).toHaveBeenCalledOnceWith(historyItem);
    expect(layoutStore.closeMobileMenu).toHaveBeenCalled();
  });
});
