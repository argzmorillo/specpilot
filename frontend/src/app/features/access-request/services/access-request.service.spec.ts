import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { AccessRequestService } from './access-request.service';

describe('AccessRequestService', () => {
  let service: AccessRequestService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/access-requests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AccessRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the current access request', () => {
    service.getMine().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/me`);

    expect(req.request.method).toBe('GET');

    req.flush(null);
  });

  it('should create an access request with a message', () => {
    const message = 'Quiero probar SpecPilot AI';

    service.create(message).subscribe();

    const req = httpMock.expectOne(baseUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      message,
    });

    req.flush({});
  });

  it('should create an access request without a message', () => {
    service.create().subscribe();

    const req = httpMock.expectOne(baseUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush({});
  });
});
