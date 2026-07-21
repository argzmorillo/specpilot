import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { LayoutStore } from '../../../../layout/store/layout.store';
import { AnalysisHistoryItem } from '../../models/analysis-history-item.model';
import { AnalysisStore } from '../../store/analysis.store';

@Component({
  selector: 'app-analysis-sidebar-navigation',
  imports: [DatePipe],
  templateUrl: './analysis-sidebar-navigation.component.html',
  styleUrl: './analysis-sidebar-navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisSidebarNavigationComponent {
  private readonly analysisStore = inject(AnalysisStore);

  private readonly layoutStore = inject(LayoutStore);

  readonly isMobile = input(false);

  readonly history = this.analysisStore.history;

  readonly historyLoading = this.analysisStore.historyLoading;

  readonly historyError = this.analysisStore.historyError;

  readonly selectedHistoryItemId = this.analysisStore.selectedHistoryItemId;

  onNewAnalysis(): void {
    this.analysisStore.clearInput();
    this.closeMobileMenuIfNeeded();
  }

  onSelectHistory(item: AnalysisHistoryItem): void {
    this.analysisStore.selectHistoryItem(item);
    this.closeMobileMenuIfNeeded();
  }

  private closeMobileMenuIfNeeded(): void {
    if (this.isMobile()) {
      this.layoutStore.closeMobileMenu();
    }
  }
}
