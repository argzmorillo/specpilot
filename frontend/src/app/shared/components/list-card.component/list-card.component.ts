import { Component, computed, input, signal } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-list-card',
  imports: [LucideAngularModule],
  standalone: true,
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css',
})
export class ListCardComponent {
  title = input.required<string>();
  items = input.required<string[]>();
  emptyMessage = input.required<string>();
  icon = input.required<LucideIconData>();
  iconClass = input<string>();
  maxVisibleItems = input<number>(3);
  readonly expanded = signal(false);

  readonly visibleItems = computed<string[]>(() => {
    if (this.expanded()) {
      return this.items();
    }
    return this.items().slice(0, this.maxVisibleItems());
  });

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }
}
