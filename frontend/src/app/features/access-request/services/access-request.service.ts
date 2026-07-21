import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AccessRequest } from '../models/access-request.model';

@Injectable({
  providedIn: 'root',
})
export class AccessRequestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/access-requests`;

  getMine(): Observable<AccessRequest | null> {
    return this.http.get<AccessRequest | null>(`${this.baseUrl}/me`);
  }

  create(message?: string): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(this.baseUrl, message ? { message } : {});
  }
}
