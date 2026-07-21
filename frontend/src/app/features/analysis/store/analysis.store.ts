import { Injectable, computed, inject, signal } from '@angular/core';

import { AnalysisHistoryItem } from '../models/analysis-history-item.model';
import { AnalyzeResult } from '../models/analyze-result.model';
import { AnalysisService } from '../services/analysis.service';

@Injectable({
  providedIn: 'root',
})
export class AnalysisStore {
  private readonly analysisService = inject(AnalysisService);

  readonly maxInputLength = 10000;

  readonly history = signal<AnalysisHistoryItem[]>([]);
  readonly historyLoading = signal(false);
  readonly historyError = signal<string | null>(null);
  readonly selectedHistoryItemId = signal<string | null>(null);

  readonly text = signal('');
  readonly result = signal<AnalyzeResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly inputLength = computed(() => this.text().length);

  readonly isInputEmpty = computed(() => !this.text().trim());

  readonly isInputTooLong = computed(() => this.inputLength() > this.maxInputLength);

  readonly isAnalyzeDisabled = computed(
    () => this.isInputEmpty() || this.isInputTooLong() || this.loading(),
  );

  loadHistory(): void {
    this.historyLoading.set(true);
    this.historyError.set(null);

    this.analysisService.getHistory().subscribe({
      next: (history) => {
        this.history.set(history);
        this.historyLoading.set(false);
      },
      error: () => {
        this.historyError.set('No se pudo cargar el historial');
        this.historyLoading.set(false);
      },
    });
  }

  selectHistoryItem(item: AnalysisHistoryItem): void {
    this.selectedHistoryItemId.set(item.id);
    this.text.set(item.inputText);

    this.result.set({
      summary: item.summary,
      userStories: item.userStories,
      technicalTasks: item.technicalTasks,
      risks: item.risks,
      questions: item.questions,
    });

    this.error.set(null);
  }

  analyze(): void {
    if (this.isInputEmpty()) {
      this.error.set('Introduce una especificación para generar el análisis técnico.');
      this.result.set(null);
      return;
    }

    if (this.isInputTooLong()) {
      this.error.set(`La especificación supera el límite de ${this.maxInputLength} caracteres.`);
      this.result.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.analysisService.analyzeText(this.text()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
        this.loadHistory();
      },
      error: () => {
        this.error.set(
          'No se pudo generar el análisis técnico. Revisa la especificación o inténtalo de nuevo en unos segundos.',
        );
        this.loading.set(false);
      },
    });
  }

  clearInput(): void {
    this.text.set('');
    this.result.set(null);
    this.error.set(null);
    this.selectedHistoryItemId.set(null);
  }
}
