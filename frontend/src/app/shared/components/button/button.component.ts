import { Component, EventEmitter, input, Output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('secondary');
  readonly disabled = input<boolean>(false);
  readonly icon = input<LucideIconData | null>(null);

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled()) {
      return;
    }
    this.clicked.emit();
  }

  buttonClasses(): string {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white';

    if (this.variant() === 'primary') {
      return `${baseClasses} bg-[#2563EB] text-white hover:bg-[#1E3A8A]`;
    }

    return `${baseClasses} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`;
  }
}
