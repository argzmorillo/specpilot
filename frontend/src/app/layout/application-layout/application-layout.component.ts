import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

import { AuthService } from '../../auth/auth.service';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LayoutStore } from '../store/layout.store';

@Component({
  selector: 'app-application-layout',
  imports: [
    RouterOutlet,
    NgComponentOutlet,
    LucideAngularModule,
    MobileHeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './application-layout.component.html',
  styleUrl: './application-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationLayoutComponent {
  private readonly authService = inject(AuthService);

  protected readonly layoutStore = inject(LayoutStore);

  protected readonly menuIcon = Menu;
  protected readonly closeIcon = X;

  protected readonly mobileSidebarInputs = {
    isMobile: true,
  };

  protected readonly username = computed(() => this.authService.getUsername() ?? 'Usuario');

  protected readonly userInitial = computed(() => this.username().charAt(0).toUpperCase() || 'U');

  protected logout(): void {
    void this.authService.logout();
  }
}
