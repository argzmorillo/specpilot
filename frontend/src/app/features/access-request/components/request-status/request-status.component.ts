import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Clock3, LucideAngularModule, LucideIconData, XCircle } from 'lucide-angular';
import { AccessRequestStatus } from '../../models/access-request.model';

type VisibleRequestStatus = Extract<AccessRequestStatus, 'PENDING' | 'REJECTED'>;

interface StatusPresentation {
  badge: string;
  title: string;
  description: string;
  icon: LucideIconData;
  iconClass: string;
  badgeClass: string;
  borderClass: string;
}

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './request-status.component.html',
  styleUrl: './request-status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStatusComponent {
  readonly status = input.required<VisibleRequestStatus>();
  readonly message = input<string | null>(null);
  readonly adminNotes = input<string | null>(null);

  readonly presentation = computed<StatusPresentation>(() => {
    switch (this.status()) {
      case 'REJECTED':
        return {
          badge: 'Solicitud revisada',
          title: 'No podemos concederte acceso',
          description:
            'En este momento no podemos autorizar el acceso a SpecPilot AI. Si consideras que se trata de un error, puedes contactar con nosotros.',
          icon: XCircle,
          iconClass: 'bg-slate-100 text-slate-600',
          badgeClass: 'bg-slate-100 text-slate-700',
          borderClass: 'border-slate-200',
        };

      case 'PENDING':
      default:
        return {
          badge: 'Pendiente de revisión',
          title: 'Estamos revisando tu solicitud',
          description:
            'Tu solicitud se ha registrado correctamente y está pendiente de revisión por un administrador. Por ahora no necesitas hacer nada más.',
          icon: Clock3,
          iconClass: 'bg-amber-100 text-amber-700',
          badgeClass: 'bg-amber-100 text-amber-700',
          borderClass: 'border-amber-200',
        };
    }
  });
}
