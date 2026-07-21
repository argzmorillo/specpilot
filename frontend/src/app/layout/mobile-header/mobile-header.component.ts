import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-mobile-header',
  imports: [LucideAngularModule],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileHeaderComponent {
  readonly title = input<string>('SpecPilot AI');
  readonly menuIcon = input.required<LucideIconData>();

  readonly openMenu = output<void>();

  onOpenMenu(): void {
    this.openMenu.emit();
  }
}
