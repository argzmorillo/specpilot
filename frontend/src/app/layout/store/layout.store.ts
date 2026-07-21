import { Injectable, Type, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private readonly sidebarComponentState = signal<Type<unknown> | null>(null);

  private readonly mobileMenuOpenState = signal(false);

  readonly sidebarComponent = this.sidebarComponentState.asReadonly();

  readonly mobileMenuOpen = this.mobileMenuOpenState.asReadonly();

  showSidebarNavigation(component: Type<unknown>): void {
    this.sidebarComponentState.set(component);
  }

  hideSidebarNavigation(component?: Type<unknown>): void {
    if (component && this.sidebarComponentState() !== component) {
      return;
    }

    this.sidebarComponentState.set(null);
  }

  openMobileMenu(): void {
    this.mobileMenuOpenState.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpenState.set(false);
  }
}
