import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { AccessRequest } from '../../models/access-request.model';
import { AccessRequestService } from '../../services/access-request.service';
import { AccessRequestPageComponent } from './access-request-page.component';

type AccessRequestPageState = 'loading' | 'form' | 'submitting' | 'status' | 'error';

type VisibleRequestStatus = 'PENDING' | 'REJECTED' | null;

interface AccessRequestPageTestApi {
  readonly state: Signal<AccessRequestPageState>;
  readonly request: Signal<AccessRequest | null>;
  readonly visibleRequestStatus: Signal<VisibleRequestStatus>;
  readonly submitting: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly messageControl: FormControl<string>;
  readonly maxMessageLength: number;

  submit(): void;
  retry(): void;
}

describe('AccessRequestPageComponent', () => {
  let component: AccessRequestPageComponent;
  let testApi: AccessRequestPageTestApi;
  let fixture: ComponentFixture<AccessRequestPageComponent>;

  let accessRequestService: jasmine.SpyObj<AccessRequestService>;
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

    testApi = component as unknown as AccessRequestPageTestApi;

    fixture.detectChanges();
  }

  beforeEach(async () => {
    accessRequestService = jasmine.createSpyObj<AccessRequestService>('AccessRequestService', [
      'getMine',
      'create',
    ]);

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AccessRequestPageComponent],
      providers: [
        {
          provide: AccessRequestService,
          useValue: accessRequestService,
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
    expect(testApi.state()).toBe('form');
    expect(testApi.request()).toBeNull();
  });

  it('should show the status view when a pending request exists', () => {
    const request = createRequest('PENDING', {
      message: 'Quiero probar SpecPilot AI.',
    });

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(testApi.state()).toBe('status');
    expect(testApi.request()).toEqual(request);
    expect(testApi.visibleRequestStatus()).toBe('PENDING');
  });

  it('should show the status view when a rejected request exists', () => {
    const request = createRequest('REJECTED', {
      adminNotes: 'No hay plazas disponibles.',
    });

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(testApi.state()).toBe('status');
    expect(testApi.request()).toEqual(request);
    expect(testApi.visibleRequestStatus()).toBe('REJECTED');
  });

  it('should navigate to analysis when the request is approved', () => {
    const request = createRequest('APPROVED');

    accessRequestService.getMine.and.returnValue(of(request));

    createComponent();

    expect(testApi.request()).toEqual(request);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/analysis']);
  });

  it('should submit a trimmed message and show the created request', () => {
    const createdRequest = createRequest('PENDING', {
      message: 'Quiero probar SpecPilot AI.',
    });

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(of(createdRequest));

    createComponent();

    testApi.messageControl.setValue('  Quiero probar SpecPilot AI.  ');

    testApi.submit();

    expect(accessRequestService.create).toHaveBeenCalledOnceWith('Quiero probar SpecPilot AI.');

    expect(testApi.request()).toEqual(createdRequest);
    expect(testApi.state()).toBe('status');
    expect(testApi.error()).toBeNull();
  });

  it('should submit an empty request when no message is provided', () => {
    const createdRequest = createRequest('PENDING');

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(of(createdRequest));

    createComponent();

    testApi.messageControl.setValue('   ');
    testApi.submit();

    expect(accessRequestService.create).toHaveBeenCalledOnceWith(undefined);

    expect(testApi.state()).toBe('status');
  });

  it('should not submit when the message exceeds the maximum length', () => {
    accessRequestService.getMine.and.returnValue(of(null));

    createComponent();

    testApi.messageControl.setValue('a'.repeat(testApi.maxMessageLength + 1));

    testApi.submit();

    expect(testApi.messageControl.invalid).toBeTrue();
    expect(testApi.messageControl.touched).toBeTrue();

    expect(accessRequestService.create).not.toHaveBeenCalled();

    expect(testApi.state()).toBe('form');
  });

  it('should prevent duplicate submissions while a request is being sent', () => {
    const createResult = new Subject<AccessRequest>();

    accessRequestService.getMine.and.returnValue(of(null));
    accessRequestService.create.and.returnValue(createResult.asObservable());

    createComponent();

    testApi.submit();
    testApi.submit();

    expect(testApi.state()).toBe('submitting');
    expect(testApi.submitting()).toBeTrue();

    expect(accessRequestService.create).toHaveBeenCalledTimes(1);

    createResult.next(createRequest('PENDING'));
    createResult.complete();

    expect(testApi.state()).toBe('status');
    expect(testApi.submitting()).toBeFalse();
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

    testApi.submit();

    expect(accessRequestService.getMine).toHaveBeenCalledTimes(2);

    expect(testApi.request()).toEqual(existingRequest);
    expect(testApi.state()).toBe('status');
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

    testApi.submit();

    expect(testApi.state()).toBe('form');

    expect(testApi.error()).toBe('El mensaje no es válido. Revísalo e inténtalo de nuevo.');
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

    testApi.submit();

    expect(testApi.state()).toBe('form');

    expect(testApi.error()).toBe('No se ha podido conectar con el servidor.');
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

    expect(testApi.state()).toBe('error');

    expect(testApi.error()).toBe('No se ha podido consultar el estado de tu solicitud.');
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

    expect(testApi.state()).toBe('error');

    expect(testApi.error()).toBe('No se ha podido conectar con el servidor.');

    testApi.retry();

    expect(accessRequestService.getMine).toHaveBeenCalledTimes(2);

    expect(testApi.state()).toBe('form');
    expect(testApi.error()).toBeNull();
  });
});
