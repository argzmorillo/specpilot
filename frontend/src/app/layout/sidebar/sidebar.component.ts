import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isMobile = input<boolean>(false);
  readonly closeIcon = input<LucideIconData | null>(null);

  readonly username = input<string>('Usuario');
  readonly userInitial = input<string>('U');

  readonly closeMenu = output<void>();
  readonly logout = output<void>();

  onLogout(): void {
    this.logout.emit();

    if (this.isMobile()) {
      this.closeMenu.emit();
    }
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }
}
