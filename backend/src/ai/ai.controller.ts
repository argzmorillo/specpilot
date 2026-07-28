import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  analyze(@Body() analyzeTextDTO: AnalyzeTextDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.analyzeText(analyzeTextDTO.text, user);
  }
}
