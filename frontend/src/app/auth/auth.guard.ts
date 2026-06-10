import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  void authService.login();
  return false;
};
