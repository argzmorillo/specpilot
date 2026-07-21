import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { AccessRequest } from '../../models/access-request.model';
import { AccessRequestService } from '../../services/access-request.service';
import { AccessRequestPageComponent } from './access-request-page.component';

describe('AccessRequestPageComponent', () => {
  let component: AccessRequestPageComponent;
  let fixture: ComponentFixture<AccessRequestPageComponent>;

  let accessRequestService: jasmine.SpyObj<AccessRequestService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  function createRequest(
    status: AccessRequest['status'],
    overrides: Partial<AccessRequest> = {},
  ): AccessRequest {
    return {
      status,
      message: null,
      adminNotes: null,
      ...overrides,
    } as AccessRequest;
  }

  function createComponent(): void {
    fixture = TestBed.createComponent(AccessRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    accessRequestService = jasmine.createSpyObj<AccessRequestService>('AccessRequestService', [
      'getMine',
      'create',
    ]);

    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getUsername', 'logout']);

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authService.getUsername.and.returnValue('Adrián');
    authService.logout.and.returnValue(Promise.resolve());
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AccessRequestPageComponent],
      providers: [
        {
          provide: AccessRequestService,
          useValue: accessRequestService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();
  });

  it('should create and show the form when the user has no request', () => {
    accessRequestService.getMine.and.returnValue(of(null));

    createComponent();

    expect(component).toBeTruthy();
    expect(component.state()).toBe('form');
    expect(component.request()).toBeNull();
  });

  it('should show the status view when a pending request exists', () => {
    const request = createRequest('PENDING', {
      message: 'Quiero probar SpecPilot AI.',
    });

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(component.state()).toBe('status');
    expect(component.request()).toEqual(request);
    expect(component.visibleRequestStatus()).toBe('PENDING');
  });

  it('should show the status view when a rejected request exists', () => {
    const request = createRequest('REJECTED', {
      adminNotes: 'No hay plazas disponibles.',
    });

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(component.state()).toBe('status');
    expect(component.request()).toEqual(request);
    expect(component.visibleRequestStatus()).toBe('REJECTED');
  });

  it('should navigate to analysis when the request is approved', () => {
    const request = createRequest('APPROVED');

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(component.request()).toEqual(request);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/analysis']);
  });

  it('should submit a trimmed message and show the created request', () => {
    const createdRequest = createRequest('PENDING', {
      message: 'Quiero probar SpecPilot AI.',
    });

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(of(createdRequest));

    createComponent();

    component.messageControl.setValue('  Quiero probar SpecPilot AI.  ');
    component.submit();

    expect(accessRequestService.create).toHaveBeenCalledOnceWith('Quiero probar SpecPilot AI.');
    expect(component.request()).toEqual(createdRequest);
    expect(component.state()).toBe('status');
    expect(component.error()).toBeNull();
  });

  it('should submit an empty request when no message is provided', () => {
    const createdRequest = createRequest('PENDING');

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(of(createdRequest));

    createComponent();

    component.messageControl.setValue('   ');
    component.submit();

    expect(accessRequestService.create).toHaveBeenCalledOnceWith(undefined);
    expect(component.state()).toBe('status');
  });

  it('should not submit when the message exceeds the maximum length', () => {
    accessRequestService.getMine.and.returnValue(of(null));

    createComponent();

    component.messageControl.setValue('a'.repeat(component.maxMessageLength + 1));

    component.submit();

    expect(component.messageControl.invalid).toBeTrue();
    expect(component.messageControl.touched).toBeTrue();
    expect(accessRequestService.create).not.toHaveBeenCalled();
    expect(component.state()).toBe('form');
  });

  it('should prevent duplicate submissions while a request is being sent', () => {
    const createResult = new Subject<AccessRequest>();

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(createResult.asObservable());

    createComponent();

    component.submit();
    component.submit();

    expect(component.state()).toBe('submitting');
    expect(component.submitting()).toBeTrue();
    expect(accessRequestService.create).toHaveBeenCalledTimes(1);

    createResult.next(createRequest('PENDING'));
    createResult.complete();

    expect(component.state()).toBe('status');
  });

  it('should reload the existing request when creation returns a conflict', () => {
    const existingRequest = createRequest('PENDING', {
      message: 'Solicitud ya existente.',
    });

    accessRequestService.getMine.and.returnValues(of(null), of(existingRequest));

    accessRequestService.create.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            statusText: 'Conflict',
          }),
      ),
    );

    createComponent();

    component.submit();

    expect(accessRequestService.getMine).toHaveBeenCalledTimes(2);
    expect(component.request()).toEqual(existingRequest);
    expect(component.state()).toBe('status');
  });

  it('should show a validation error when creation returns status 400', () => {
    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
          }),
      ),
    );

    createComponent();

    component.submit();

    expect(component.state()).toBe('form');
    expect(component.error()).toBe('El mensaje no es válido. Revísalo e inténtalo de nuevo.');
  });

  it('should show a connection error when creation cannot reach the server', () => {
    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error',
          }),
      ),
    );

    createComponent();

    component.submit();

    expect(component.state()).toBe('form');
    expect(component.error()).toBe('No se ha podido conectar con el servidor.');
  });

  it('should show an error when the initial request lookup fails', () => {
    accessRequestService.getMine.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
          }),
      ),
    );

    createComponent();

    expect(component.state()).toBe('error');
    expect(component.error()).toBe('No se ha podido consultar el estado de tu solicitud.');
  });

  it('should retry loading the request after an initial error', () => {
    accessRequestService.getMine.and.returnValues(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error',
          }),
      ),
      of(null),
    );

    createComponent();

    expect(component.state()).toBe('error');
    expect(component.error()).toBe('No se ha podido conectar con el servidor.');

    component.retry();

    expect(accessRequestService.getMine).toHaveBeenCalledTimes(2);
    expect(component.state()).toBe('form');
    expect(component.error()).toBeNull();
  });

  it('should expose the authenticated username and its initial', () => {
    accessRequestService.getMine.and.returnValue(of(null));

    createComponent();

    expect(component.username()).toBe('Adrián');
    expect(component.userInitial()).toBe('A');
  });

  it('should open and close the mobile menu', () => {
    accessRequestService.getMine.and.returnValue(of(null));

    createComponent();

    component.openMobileMenu();

    expect(component.mobileMenuOpen()).toBeTrue();

    component.closeMobileMenu();

    expect(component.mobileMenuOpen()).toBeFalse();
  });
});
