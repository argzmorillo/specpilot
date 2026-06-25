import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyzeResult } from '../models/analyze-result.model';
import { environment } from '../../../../environments/environment';
import { AnalysisHistoryItem } from '../models/analysis-history-item.model';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private readonly http = inject(HttpClient);

  analyzeText(text: string): Observable<AnalyzeResult> {
    return this.http.post<AnalyzeResult>(`${environment.apiUrl}/ai/analyze`, { text });
  }

  getHistory(): Observable<AnalysisHistoryItem[]> {
    return this.http.get<AnalysisHistoryItem[]>(`${environment.apiUrl}/analysis`);
  }
}
