import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BookOpen,
  Eraser,
  FileText,
  ListChecks,
  LucideAngularModule,
  Menu,
  RotateCcw,
  TriangleAlert,
  X,
} from 'lucide-angular';

import { AuthService } from '../../../../auth/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ListCardComponent } from '../../../../shared/components/list-card/list-card.component';
import { SummaryCardComponent } from '../../../../shared/components/summary-card/summary-card.component';
import { MobileHeaderComponent } from '../../../../shared/layout/mobile-header/mobile-header.component';
import { SidebarComponent } from '../../../../shared/layout/sidebar/sidebar.component';
import { AnalysisHistoryItem } from '../../models/analysis-history-item.model';
import { AnalyzeResult } from '../../models/analyze-result.model';
import { AnalysisService } from '../../services/analysis.service';

@Component({
  selector: 'app-analysis-page',
  imports: [
    FormsModule,
    SummaryCardComponent,
    ListCardComponent,
    ButtonComponent,
    LucideAngularModule,
    SidebarComponent,
    MobileHeaderComponent,
  ],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisPageComponent implements OnInit {
  private readonly analysisService = inject(AnalysisService);
  private readonly authService = inject(AuthService);

  readonly maxInputLength = 10000;

  readonly fileTextIcon = FileText;
  readonly bookOpenIcon = BookOpen;
  readonly listChecksIcon = ListChecks;
  readonly triangleAlertIcon = TriangleAlert;
  readonly eraserIcon = Eraser;
  readonly rotateCcwIcon = RotateCcw;
  readonly menuIcon = Menu;
  readonly closeIcon = X;

  readonly history = signal<AnalysisHistoryItem[]>([]);
  readonly historyLoading = signal(false);
  readonly historyError = signal<string | null>(null);
  readonly selectedHistoryItemId = signal<string | null>(null);

  readonly mobileMenuOpen = signal(false);

  readonly username = computed(() => this.authService.getUsername() ?? 'Usuario');

  readonly userInitial = computed(() => this.username().charAt(0).toUpperCase() || 'U');

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

  ngOnInit(): void {
    this.loadHistory();
  }

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

  logout(): void {
    void this.authService.logout();
  }

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
