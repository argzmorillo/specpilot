import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BookOpen,
  Eraser,
  FileText,
  ListChecks,
  LucideAngularModule,
  RotateCcw,
  TriangleAlert,
} from 'lucide-angular';

import { LayoutStore } from '../../../../layout/store/layout.store';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ListCardComponent } from '../../../../shared/components/list-card/list-card.component';
import { SummaryCardComponent } from '../../../../shared/components/summary-card/summary-card.component';
import { AnalysisSidebarNavigationComponent } from '../../components/analysis-sidebar-navigation/analysis-sidebar-navigation.component';
import { AnalysisStore } from '../../store/analysis.store';

@Component({
  selector: 'app-analysis-page',
  imports: [
    FormsModule,
    SummaryCardComponent,
    ListCardComponent,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisPageComponent implements OnInit, OnDestroy {
  private readonly layoutStore = inject(LayoutStore);

  protected readonly store = inject(AnalysisStore);

  protected readonly fileTextIcon = FileText;
  protected readonly bookOpenIcon = BookOpen;
  protected readonly listChecksIcon = ListChecks;
  protected readonly triangleAlertIcon = TriangleAlert;
  protected readonly eraserIcon = Eraser;
  protected readonly rotateCcwIcon = RotateCcw;

  ngOnInit(): void {
    this.layoutStore.showSidebarNavigation(AnalysisSidebarNavigationComponent);

    this.store.loadHistory();
  }

  ngOnDestroy(): void {
    this.layoutStore.hideSidebarNavigation(AnalysisSidebarNavigationComponent);
  }
}
