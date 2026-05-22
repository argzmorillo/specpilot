import { Routes } from '@angular/router';
import { AnalysisPageComponent } from './features/analysis/pages/analysis-page/analysis-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full',
  },
  {
    path: 'analysis',
    component: AnalysisPageComponent,
  },
];
