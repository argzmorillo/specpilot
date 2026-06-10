import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideKeycloak } from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'SpecPilot',
        clientId: 'specpilot-frontend',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    }),
  ],
};
