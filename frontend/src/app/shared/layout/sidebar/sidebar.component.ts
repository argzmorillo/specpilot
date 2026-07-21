import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

import { AnalysisHistoryItem } from '../../../features/analysis/models/analysis-history-item.model';

@Component({
  selector: 'app-sidebar',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly showAnalysisNavigation = input<boolean>(true);

  readonly history = input<AnalysisHistoryItem[]>([]);
  readonly historyLoading = input<boolean>(false);
  readonly historyError = input<string | null>(null);
  readonly selectedHistoryItemId = input<string | null>(null);

  readonly isMobile = input<boolean>(false);
  readonly closeIcon = input<LucideIconData | null>(null);

  readonly username = input<string>('Usuario');
  readonly userInitial = input<string>('U');

  readonly newAnalysis = output<void>();
  readonly selectHistory = output<AnalysisHistoryItem>();
  readonly closeMenu = output<void>();
  readonly logout = output<void>();

  onNewAnalysis(): void {
    this.newAnalysis.emit();
    this.closeMobileSidebar();
  }

  onSelectHistory(item: AnalysisHistoryItem): void {
    this.selectHistory.emit(item);
    this.closeMobileSidebar();
  }

  onLogout(): void {
    this.logout.emit();
    this.closeMobileSidebar();
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }

  private closeMobileSidebar(): void {
    if (this.isMobile()) {
      this.closeMenu.emit();
    }
  }
}
