import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AccessGuard } from './auth/access.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/application-layout/application-layout.component').then(
        (m) => m.ApplicationLayoutComponent,
      ),
    canActivate: [AuthGuard],
    children: [
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
        canActivate: [AccessGuard],
      },
      {
        path: 'access-request',
        loadComponent: () =>
          import('./features/access-request/pages/access-request-page/access-request-page.component').then(
            (m) => m.AccessRequestPageComponent,
          ),
      },
    ],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
];
