import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import openAIClient from 'openai';
import { AnalyzeResult } from './types/analyze-result.type';

@Injectable()
export class AiService {
  private readonly openai: openAIClient;
  private readonly model: string;
  private readonly systemPrompt = `
    You are a senior software analyst.

    Analyze the user's text and return ONLY valid JSON.

    The JSON must match this exact structure:
    {
      "summary": "string",
      "userStories": ["string"],
      "technicalTasks": ["string"],
      "risks": ["string"],
      "questions": ["string"]
    }

    Rules:
    - Do not include markdown.
    - Do not include explanations.
    - Do not wrap the JSON in code blocks.
    - Use Spanish.
    - Keep the content concise and useful for a software development team.
    `;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-5.4-mini';

    this.openai = new openAIClient({
      apiKey,
    });
  }

  async analyzeText(text: string): Promise<AnalyzeResult> {
    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: 'system',
            content: this.systemPrompt,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        store: true,
      });

      return this.parseAnalyzeResult(response.output_text);
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw new InternalServerErrorException('Failed to analyze text');
    }
  }

  private parseAnalyzeResult(rawOutput: string): AnalyzeResult {
    try {
      return JSON.parse(rawOutput) as AnalyzeResult;
    } catch {
      throw new InternalServerErrorException('OpenAI returned invalid JSON');
    }
  }
}
