import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { IAgentService } from './interfaces/agent.service.interface';
import { LLM_MODEL } from './agent.tokens';
import { IChatMessage, IModelInfo } from '../ai-provider.interface';
import { MemorySaver } from '@langchain/langgraph';
import { createAgent, HumanMessage, SystemMessage } from 'langchain';
import { LlmModelInfoLangChainService } from './llm-model-info.langchain.service';
import { getSkillComparisonIntentPrompt } from '../../default_prompts/default.prompts';

@Injectable()
export class LangchainAgentService implements IAgentService {
  private readonly logger = new Logger(LangchainAgentService.name);

  constructor(
    @Inject(LLM_MODEL) private readonly llm: BaseChatModel,
    private readonly llmModelInfoLangChainService: LlmModelInfoLangChainService,
  ) {}

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    this.logger.debug(`Invoking LLM with query: ${prompt}`);

    const checkpointer = new MemorySaver();

    const agent = createAgent({
      model: this.llm,
      systemPrompt: systemInstruction,
      checkpointer,
    });

    const agentResult = await agent.invoke(
      { messages: [{ role: 'user', content: prompt }] },
      { configurable: { thread_id: 'great-gatsby-lc' } },
    );

    const agentMessages = agentResult.messages;
    const content = agentMessages[agentMessages.length - 1].content;

    return typeof content === 'string' ? content : JSON.stringify(content);
  }
  async isSkillComparison(prompt: string): Promise<boolean> {
    const response = await this.llm.invoke([
      new SystemMessage(getSkillComparisonIntentPrompt(prompt)),
      new HumanMessage(prompt),
    ]);

    const text =
      typeof response.content === 'string'
        ? response.content
        : response.content
            .map((c) => (c.type === 'text' ? c.text : ''))
            .join('');

    return /sí|si/.test(
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    );
  }
  getModelInfo(): IModelInfo {
    return this.llmModelInfoLangChainService.getModelInfo();
  }
}
