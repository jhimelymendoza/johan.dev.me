import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { LangchainAgentService } from './langchain-agent.service';
import { AGENT_SERVICE } from './interfaces/agent.service.interface';
import { LLM_MODEL } from './agent.tokens';
import { llmFactory } from './llm.factory';
import { LlmModelInfoLangChainService } from './llm-model-info.langchain.service';

@Module({
  imports: [ConfigModule],
  controllers: [AgentController],
  providers: [
    LlmModelInfoLangChainService,
    LangchainAgentService,
    {
      provide: LLM_MODEL,
      useFactory: (config: ConfigService) => llmFactory(config),
      inject: [ConfigService],
    },
    {
      provide: AGENT_SERVICE,
      useClass: LangchainAgentService,
    },
    AgentService,
  ],
  exports: [
    LangchainAgentService,
    LlmModelInfoLangChainService,
    LLM_MODEL,
    AGENT_SERVICE,
  ],
})
export class AgentModule {}
