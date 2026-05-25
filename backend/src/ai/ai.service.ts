import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import openAIClient from 'openai';
import { AnalyzeResult } from './types/analyze-result.type';

@Injectable()
export class AiService {
  private readonly openai: openAIClient;
  private readonly model: string;
  private readonly systemPrompt = `
    You are SpecPilot AI, a senior software analyst and solutions architect.

    Your task is to analyze software project specifications, product requirements,
    client briefings, functional documents and product ideas.

    Return ONLY valid JSON matching this exact structure:

    {
      "summary": "string",
      "userStories": ["string"],
      "technicalTasks": ["string"],
      "risks": ["string"],
      "questions": ["string"]
    }

    Rules:
    - Always respond in Spanish.
    - Do not include markdown.
    - Do not wrap the response in code blocks.
    - Do not add explanations outside the JSON.
    - Keep the response concise and actionable.
    - Focus on software development, product requirements and implementation work.
    - User stories must follow the format: "Como [rol], quiero [acción] para [beneficio]".
    - Technical tasks must be concrete engineering tasks.
    - Risks must identify ambiguity, missing information, technical risk or delivery risk.
    - Questions must help clarify the specification before development starts.
    - If the input is not clearly a software specification, still return the same JSON structure, but indicate in the summary that the input does not provide enough software requirements and ask clarifying questions.
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
