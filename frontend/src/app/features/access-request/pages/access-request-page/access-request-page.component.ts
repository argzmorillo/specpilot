import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Info, LucideAngularModule, Menu, RefreshCcw, Send, UserRound, X } from 'lucide-angular';

import { AuthService } from '../../../../auth/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MobileHeaderComponent } from '../../../../shared/layout/mobile-header/mobile-header.component';
import { SidebarComponent } from '../../../../shared/layout/sidebar/sidebar.component';
import { RequestStatusComponent } from '../../components/request-status/request-status.component';
import { AccessRequest } from '../../models/access-request.model';
import { AccessRequestService } from '../../services/access-request.service';

type AccessRequestPageState = 'loading' | 'form' | 'submitting' | 'status' | 'error';

type VisibleAccessRequestStatus = 'PENDING' | 'REJECTED';

@Component({
  selector: 'app-access-request-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    MobileHeaderComponent,
    SidebarComponent,
    RequestStatusComponent,
    LucideAngularModule,
  ],
  templateUrl: './access-request-page.component.html',
  styleUrl: './access-request-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessRequestPageComponent {
  private readonly accessRequestService = inject(AccessRequestService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly maxMessageLength = 1000;

  readonly menuIcon = Menu;
  readonly closeIcon = X;
  readonly sendIcon = Send;
  readonly userIcon = UserRound;
  readonly infoIcon = Info;
  readonly retryIcon = RefreshCcw;

  readonly state = signal<AccessRequestPageState>('loading');
  readonly request = signal<AccessRequest | null>(null);
  readonly error = signal<string | null>(null);
  readonly mobileMenuOpen = signal(false);
  readonly messageValue = signal('');

  readonly username = computed(() => this.authService.getUsername() ?? 'Usuario');

  readonly userInitial = computed(() => this.username().charAt(0).toUpperCase() || 'U');

  readonly messageLength = computed(() => this.messageValue().length);

  readonly submitting = computed(() => this.state() === 'submitting');

  readonly visibleRequestStatus = computed<VisibleAccessRequestStatus | null>(() => {
    const status = this.request()?.status;

    return status === 'PENDING' || status === 'REJECTED' ? status : null;
  });

  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(this.maxMessageLength)],
  });

  constructor() {
    this.messageControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.messageValue.set(value);
      });

    this.loadRequest();
  }

  submit(): void {
    if (this.messageControl.invalid || this.submitting()) {
      this.messageControl.markAsTouched();
      return;
    }

    this.state.set('submitting');
    this.error.set(null);

    const message = this.messageControl.value.trim();

    this.accessRequestService
      .create(message || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          this.handleLoadedRequest(request);
        },
        error: (httpError: HttpErrorResponse) => {
          this.handleSubmitError(httpError);
        },
      });
  }

  retry(): void {
    this.loadRequest();
  }

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  private loadRequest(): void {
    this.state.set('loading');
    this.error.set(null);

    this.accessRequestService
      .getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          if (!request) {
            this.request.set(null);
            this.state.set('form');
            return;
          }

          this.handleLoadedRequest(request);
        },
        error: (httpError: HttpErrorResponse) => {
          this.error.set(this.resolveLoadError(httpError));
          this.state.set('error');
        },
      });
  }

  private handleLoadedRequest(request: AccessRequest): void {
    this.request.set(request);

    if (request.status === 'APPROVED') {
      void this.router.navigate(['/analysis']);
      return;
    }

    this.state.set('status');
  }

  private handleSubmitError(httpError: HttpErrorResponse): void {
    if (httpError.status === 409) {
      this.loadRequest();
      return;
    }

    if (httpError.status === 400) {
      this.error.set('El mensaje no es válido. Revísalo e inténtalo de nuevo.');
    } else if (httpError.status === 401) {
      this.error.set('Tu sesión ha caducado. Cierra sesión y vuelve a identificarte.');
    } else if (httpError.status === 0) {
      this.error.set('No se ha podido conectar con el servidor.');
    } else {
      this.error.set('No se ha podido enviar la solicitud. Inténtalo de nuevo.');
    }

    this.state.set('form');
  }

  private resolveLoadError(httpError: HttpErrorResponse): string {
    if (httpError.status === 401) {
      return 'Tu sesión no es válida o ha caducado.';
    }

    if (httpError.status === 0) {
      return 'No se ha podido conectar con el servidor.';
    }

    return 'No se ha podido consultar el estado de tu solicitud.';
  }
}
