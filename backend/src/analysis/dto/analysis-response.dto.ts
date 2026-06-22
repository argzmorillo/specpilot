export class AnalysisResponseDto {
  id!: string;
  inputText!: string;
  summary!: string;
  userStories!: string[];
  technicalTasks!: string[];
  risks!: string[];
  questions!: string[];
  createdAt!: Date;
}
