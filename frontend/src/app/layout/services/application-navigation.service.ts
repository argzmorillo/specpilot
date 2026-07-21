import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { AnalysisHistoryItem } from '../../features/analysis/models/analysis-history-item.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationNavigationService {
  readonly showAnalysisNavigation = signal(false);

  readonly history = signal<AnalysisHistoryItem[]>([]);
  readonly historyLoading = signal(false);
  readonly historyError = signal<string | null>(null);
  readonly selectedHistoryItemId = signal<string | null>(null);

  private readonly newAnalysisSubject = new Subject<void>();
  private readonly selectHistorySubject = new Subject<AnalysisHistoryItem>();

  readonly newAnalysis$ = this.newAnalysisSubject.asObservable();
  readonly selectHistory$ = this.selectHistorySubject.asObservable();

  showAnalysis(): void {
    this.showAnalysisNavigation.set(true);
  }

  hideAnalysis(): void {
    this.showAnalysisNavigation.set(false);
    this.clearAnalysisState();
  }

  requestNewAnalysis(): void {
    this.newAnalysisSubject.next();
  }

  requestHistorySelection(item: AnalysisHistoryItem): void {
    this.selectHistorySubject.next(item);
  }

  setHistory(history: AnalysisHistoryItem[]): void {
    this.history.set(history);
  }

  setHistoryLoading(loading: boolean): void {
    this.historyLoading.set(loading);
  }

  setHistoryError(error: string | null): void {
    this.historyError.set(error);
  }

  setSelectedHistoryItemId(id: string | null): void {
    this.selectedHistoryItemId.set(id);
  }

  private clearAnalysisState(): void {
    this.history.set([]);
    this.historyLoading.set(false);
    this.historyError.set(null);
    this.selectedHistoryItemId.set(null);
  }
}
