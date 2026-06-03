import { AnalyzeResult } from './analyze-result.model';

export type AnalysisHistoryItem = AnalyzeResult & {
  id: string;
  inputText: string;
  createdAt: string;
};
