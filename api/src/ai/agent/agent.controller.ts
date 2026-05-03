import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { IAgentService } from './interfaces/agent.service.interface';
import { AGENT_SERVICE } from './interfaces/agent.service.interface';
import { AskAgentDto } from './dto/ask-agent.dto';
import { AskAgentResponseDto } from './dto/ask-agent-response.dto';

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: IAgentService,
  ) {}

  @Post('ask')
  @ApiBody({ type: AskAgentDto })
  @ApiOkResponse({ type: AskAgentResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing signature' })
  async ask(@Body() body: AskAgentDto): Promise<AskAgentResponseDto> {
    const response = await this.agentService.chat(body.query, [], '');
    return { response };
  }
}
