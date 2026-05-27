import { Component, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent {
  title = input.required<string>();
  content = input.required<string>();
  icon = input.required<LucideIconData>();
  iconClass = input<string>();
}
