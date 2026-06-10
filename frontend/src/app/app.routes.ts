import { Routes } from '@angular/router';
import { AnalysisPageComponent } from './features/analysis/pages/analysis-page/analysis-page.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full',
  },
  {
    path: 'analysis',
    loadComponent: () =>
      import('./features/analysis/pages/analysis-page/analysis-page.component').then(
        (m) => m.AnalysisPageComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
];
