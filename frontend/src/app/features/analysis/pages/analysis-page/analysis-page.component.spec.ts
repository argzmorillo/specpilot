import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisPageComponent } from './analysis-page.component';
import { AnalysisStore } from '../../store/analysis.store';
import { LayoutStore } from '../../../../layout/store/layout.store';
import { AnalysisSidebarNavigationComponent } from '../../components/analysis-sidebar-navigation/analysis-sidebar-navigation.component';

describe('AnalysisPageComponent', () => {
  let fixture: ComponentFixture<AnalysisPageComponent>;
  let component: AnalysisPageComponent;

  const mockAnalysisStore = {
    loadHistory: jasmine.createSpy('loadHistory'),

    text: jasmine.createSpyObj('Signal', ['set']),
    inputLength: () => 0,
    maxInputLength: 10000,
    loading: () => false,
    error: () => null,
    result: () => null,
    isAnalyzeDisabled: () => true,

    analyze: jasmine.createSpy('analyze'),
    clearInput: jasmine.createSpy('clearInput'),
  };

  const mockLayoutStore = {
    showSidebarNavigation: jasmine.createSpy('showSidebarNavigation'),
    hideSidebarNavigation: jasmine.createSpy('hideSidebarNavigation'),
  };

  beforeEach(async () => {
    mockAnalysisStore.loadHistory.calls.reset();
    mockLayoutStore.showSidebarNavigation.calls.reset();
    mockLayoutStore.hideSidebarNavigation.calls.reset();

    await TestBed.configureTestingModule({
      imports: [AnalysisPageComponent],
      providers: [
        {
          provide: AnalysisStore,
          useValue: mockAnalysisStore,
        },
        {
          provide: LayoutStore,
          useValue: mockLayoutStore,
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

  it('should register analysis sidebar on init', () => {
    expect(mockLayoutStore.showSidebarNavigation).toHaveBeenCalledWith(
      AnalysisSidebarNavigationComponent,
    );
  });

  it('should load history on init', () => {
    expect(mockAnalysisStore.loadHistory).toHaveBeenCalled();
  });

  it('should unregister analysis sidebar on destroy', () => {
    fixture.destroy();

    expect(mockLayoutStore.hideSidebarNavigation).toHaveBeenCalledWith(
      AnalysisSidebarNavigationComponent,
    );
  });
});
