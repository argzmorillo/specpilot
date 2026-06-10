import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);

  isLoggedIn(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'] as string | undefined;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }
}
