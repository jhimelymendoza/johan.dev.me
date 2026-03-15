import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('AI')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ask')
  @ApiOperation({ summary: 'Ask a question to the AI', description: 'Sends a prompt to the active AI provider. Uses embedding-based semantic search to enrich the response with relevant skill data when needed.' })
  @ApiQuery({ name: 'prompt', description: 'The question or message to send to the AI', example: 'What technologies does Johan know?' })
  @ApiResponse({ status: 200, description: 'AI response with optional skill similarity results' })
  ask(@Query('prompt') prompt: string): Promise<IChat> {
    return this.appService.ask(prompt);
  }

  @Put('set-embedding-to-skills/:id')
  @ApiOperation({ summary: 'Generate and store embedding for a skill', description: 'Calls the AI embedding model and persists the resulting vector on the skill document.' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the skill document' })
  @ApiResponse({ status: 200, description: 'Skill updated with new embeddings' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  setEmbedding(@Param('id') id: string) {
    return this.appService.setEmbeddingsByProjectId(id);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare a question against stored skills', description: 'Generates an embedding for the question and returns all skills sorted by cosine similarity.' })
  @ApiQuery({ name: 'question', description: 'The question to compare against skill embeddings', example: 'Do you know React?' })
  @ApiResponse({ status: 200, description: 'List of skills with similarity scores sorted descending' })
  compare(@Query('question') question: string) {
    return this.appService.hasAnyOfQuestionSkills(question);
  }
}
