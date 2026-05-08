import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalyzeTextDto } from './dto/analyze-text.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  analyze(@Body() analyzeTextDTO: AnalyzeTextDto) {
    return this.aiService.analyzeText(analyzeTextDTO.text);
  }
}
