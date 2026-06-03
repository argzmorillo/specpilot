import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { AnalysisHistoryItem } from '../../../features/analysis/models/analysis-history-item.model';

@Component({
  selector: 'app-sidebar',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly history = input.required<AnalysisHistoryItem[]>();
  readonly historyLoading = input<boolean>(false);
  readonly historyError = input<string | null>(null);
  readonly selectedHistoryItemId = input<string | null>(null);

  readonly isMobile = input<boolean>(false);
  readonly closeIcon = input<LucideIconData | null>(null);

  readonly newAnalysis = output<void>();
  readonly selectHistory = output<AnalysisHistoryItem>();
  readonly closeMenu = output<void>();

  onNewAnalysis() {
    this.newAnalysis.emit();

    if (this.isMobile()) {
      this.closeMenu.emit();
    }
  }

  onSelectHistory(item: AnalysisHistoryItem): void {
    this.selectHistory.emit(item);

    if (this.isMobile()) {
      this.closeMenu.emit();
    }
  }
}
