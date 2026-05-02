import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { getSkillComparisonIntentPrompt } from '../default_prompts/default.prompts';
import { IAIProvider, IChatMessage, IModelInfo } from './ai-provider.interface';

const CHAT_MODEL = 'gpt-oss:120b-cloud';
//const CHAT_MODEL = 'kimi-k2.5:cloud';

@Injectable()
export class OllamaService implements IAIProvider {
  constructor(
    private readonly client: Ollama,
    private readonly configService: ConfigService,
  ) {}

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    const response = await this.client.chat({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        ...history.map((msg) => ({
          role:
            msg.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ],
    });

    return response.message.content;
  }

  getModelInfo(): IModelInfo {
    const isCloud = this.configService.get<string>('OLLAMA_CLOUD') === 'true';
    return {
      provider: isCloud ? 'Ollama Cloud' : 'Ollama',
      chatModel: CHAT_MODEL,
    };
  }

  async isSkillComparison(prompt: string): Promise<boolean> {
    const response = await this.client.chat({
      model: CHAT_MODEL,
      options: { temperature: 0 },
      messages: [
        { role: 'system', content: getSkillComparisonIntentPrompt(prompt) },
        { role: 'user', content: prompt },
      ],
    });

    const text = response.message.content.toLowerCase();
    return /sí|si/.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  }
}
