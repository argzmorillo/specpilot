import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideKeycloak } from 'keycloak-angular';
import { AuthInterceptor } from './auth/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideKeycloak({
      config: {
        url: environment.keycloakUrl,
        realm: 'specpilot',
        clientId: 'specpilot-frontend',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    }),
  ],
};
