import { Component, computed, inject, signal } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { AnalyzeResult } from '../../models/analyze-result.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis-page',
  imports: [FormsModule],
  templateUrl: './analysis-page.html',
  styleUrl: './analysis-page.scss',
})
export class AnalysisPageComponent {
  private readonly analysisService = inject(AnalysisService);
  readonly maxInputLength = 10000;

  text = signal('');
  result = signal<AnalyzeResult | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  analyze(): void {
    if (!this.text().trim()) {
      this.error.set('Introduzca un texto para analizar');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.analysisService.analyzeText(this.text()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo generar el análisis técnico. Inténtalo de nuevo.');
        this.loading.set(false);
      },
    });
  }

  readonly inputLength = computed(() => this.text().length);

  readonly isInputEmpty = computed(() => !this.text().trim());

  readonly isInputTooLong = computed(() => this.inputLength() > this.maxInputLength);

  readonly isAnalyzeDisabled = computed(
    () => this.isInputEmpty() || this.isInputTooLong() || this.loading(),
  );
}
